import { useState, useEffect } from 'react';
import { useAppDispatch } from '../store/hooks';
import query from '../api/APIServices';
import useServer from './useServer';
import { initSystem } from '../store/actions/global';
import initSlice, { setFullUser } from '../store/slices/initSlice';

const useInitialLoad = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const dispatch = useAppDispatch();
  const { manageErrors } = useServer();

  const init = async () => {
    await Promise.all([
      query.get('/user/myuser').then((resp) => resp.data),
      //query.get('/control/billing/subscriptions').then((resp) => resp.data),
      //query.get('/control/businesscategory').then((resp) => resp.data.items),
      //query.get('/identity/roles').then((resp) => resp.data),
      //query.get('/control/currency').then((resp) => resp.data.items),
      //query.get('/control/configs').then((resp) => resp.data),
      //query.get('/control/business').then((resp) => resp.data.items),
    ])
      .then((resp) => {
        const response = {
          user: resp[0],
        };
dispatch(setFullUser(response));
      })
      .catch((error) => manageErrors(error));
    setIsLoading(false);
  };

  return {
    init,
    isLoading,
  };
};

export default useInitialLoad;
