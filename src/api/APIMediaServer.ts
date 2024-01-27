import axios from "axios";
import { setKeys } from "../store/slices/sessionSlice";

let store: any;
export const injectMediaStore = (_store: any) => {
  store = _store;
};

const axiosApiInstance = axios.create();

//Data
//"https://apidevpay.tecopos.com"
const baseUrl = `${process.env.REACT_APP_API_HOST_TICKET}`;

//Authentication
//"https://idapidev.tecopos.com/api"  +   "/v1"
const baseAuthUrl = `${process.env.REACT_APP_API_HOST}${process.env.REACT_APP_VERSION_API}`;


// Request interceptor for API calls
axiosApiInstance.interceptors.request.use(
  async (config) => {

    const url = config.url || '';
    let xAppOriginValue = 'Tecopos-Tecopay';

    if (url.includes('idapidev.tecopos.com')) {
      xAppOriginValue = 'Tecopay-Web';
    } else if (url.includes('apidevpay.tecopos.com')) {
      xAppOriginValue = 'Tecopos-Tecopay';
    }
    config.headers['X-App-Origin'] = xAppOriginValue;

    const session = store?.getState().session;
    const keys = session?.key;
    

    //@ts-ignore
    config.headers = {
      ...config.headers,
      Accept: "*/*",
      'Content-Type': 'multipart/form-data',
    };

    if (keys !== null) {
      //@ts-ignore
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${keys.token}`,
      };
    }
    return config;
  },
  error => {
    Promise.reject(error);
  }
);

// Response interceptor for API calls
axiosApiInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async function (error) {
    const originalRequest = error.config;

    if (error.response.status === 403) {
      store.dispatch(setKeys(null));
      return Promise.reject(error);
    }

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const keys = store.getState().session.key;

      if (keys) {
        return await postAuth(
          `/refresh-token`,
          {
            refresh_token: keys.refresh_token,
          }
        )
          .then(async response => {
            const new_session = {
              token: response.data.token,
              refresh_token: response.data.refresh_token,
            };

            store.dispatch(setKeys(new_session));

            axiosApiInstance.defaults.headers.common[
              "Authorization"
            ] = "Bearer " + response.data.token;

            return axiosApiInstance(originalRequest);
          })
          .catch(async error => {
            store.dispatch(setKeys(null));
            return Promise.reject(error);
          });
      }
    }
    return Promise.reject(error);
  }
);

const get = async (path: string) => {
  const request = {
    url: `${baseUrl + path}`,
    method: "GET",
  };

  return axiosApiInstance.get(request.url);
};

const post = async (path: string, body: object, config = {}) => {
  const request = {
    url: `${baseUrl + path}`,
    method: "POST",
  };

  return axiosApiInstance.post(request.url, body, config);
};

const postAuth = async (path: string, body: object, config = {}) => {
  const request = {
    url: `${baseAuthUrl + path}`,
    method: "POST",
  };

  return axiosApiInstance.post(request.url, body, config);
};

export default {
  get,
  post,
};
