import axios from "axios"
const URL_PREFIX = import.meta.env.VITE_SERVER_URL_DEV;
;

export const httpGet = async (url:string): Promise<unknown> => {  
  return axios.get(URL_PREFIX + url);
}

export const httpPost = async (url: string, payload: unknown): Promise<unknown> => {
  return axios.post(URL_PREFIX + url, payload);
}