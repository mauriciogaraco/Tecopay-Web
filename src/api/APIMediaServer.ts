import axios from "axios";
import { setKeys } from "../store/slices/sessionSlice";



let store: any;
export const injectMediaStore = (_store: any) => {
    store = _store;
};

const no_authentication = ["/files/"];

const axiosApiInstance = axios.create();


// Request interceptor for API calls
axiosApiInstance.interceptors.request.use(
  async (config) => {
    //@ts-ignore
    config.headers = {
      ...config.headers,
      Accept: "*/*",
      "Content-Type": "multipart/form-data",
      "X-App-Origin": "Tecopos-Tecopay",
    };

    const session = store.getState().session;

    const rute = config.url?.split(`${process.env.REACT_APP_API_HOST}${process.env.REACT_APP_VERSION_API}`)[1] ?? "";

    

    if (session !== null && !no_authentication.includes(rute)) {
      const keys = session.key;
      //@ts-ignore
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${keys.token}`,
      };
    }
    return config;
  },
  (error) => {
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

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const session = store.getState().session.key;

      if (session) {
        try {
          await axios
            .post(`${process.env.VITE_APP_API_HOST}${process.env.VITE_APP_VERSION_API}/refresh-token`, {
              refresh_token: session.refresh_token,
            })
            .then(async (response) => {
              const new_session = {
                token: response.data.token,
                refresh_token: response.data.refresh_token,
              };
              store.dispatch(setKeys(new_session));

              axiosApiInstance.defaults.headers.common["Authorization"] =
                "Bearer " + response.data.token;
              return axiosApiInstance(originalRequest);
            })
            .catch(async (error) => {
              localStorage.removeItem("session");
              return Promise.reject(error);
            });
        } catch (e) {
          localStorage.removeItem("session");
          return Promise.reject(error);
        }
      }
    }
    return Promise.reject(error);
  }
);

const get = async (path: string) => {
  const request = {
    url: `${process.env.VITE_APP_API_HOST}${process.env.VITE_APP_VERSION_API}${path}`,
    method: "GET",
  };

  return axiosApiInstance.get(request.url);
};

const post = async (path: string, body: object, config = {}) => {
  const request = {
    url: `${process.env.VITE_APP_API_HOST}${process.env.VITE_APP_VERSION_API}${path}`,
    method: "POST",
  };

  return axiosApiInstance.post(request.url, body, config);
};

export default {
  get,
  post,
};
