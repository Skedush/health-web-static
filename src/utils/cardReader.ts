import axios, { AxiosRequestConfig, AxiosError } from 'axios';
import qs from 'qs';
import Config from '@/utils/config';
import api from '../services/api';

const { cardReaderHost } = Config;

export function localhostRequest(apiUrl: string) {
  return function(data: object, config: AxiosRequestConfig = {}): Promise<any> {
    const url = cardReaderHost + apiUrl + (data ? `?${qs.stringify(data)}` : '');
    const method = 'GET';

    const options: AxiosRequestConfig = {
      url,
      method,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        ...config,
      },
    };
    return axios(options)
      .then(response => {
        return response.data;
      })
      .catch((error: AxiosError) => {
        return {
          error,
        };
      });
  };
}

export const getCardInfo = localhostRequest(api.getIdCardInfo);

export const readerDeviceApi = localhostRequest(api.getReadCardId);
