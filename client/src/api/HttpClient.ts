import axios, { AxiosInstance, AxiosResponse } from 'axios';

declare module 'axios' {
  interface AxiosResponse<T = any> extends Promise<T> {}
}
export default abstract class HttpClient {
  protected readonly instance: AxiosInstance;
  public constructor(apiURL?: string) {
    const baseURL = apiURL ? apiURL : `${window.location.origin}/api/v1`;
    this.instance = axios.create({
      baseURL,
    });
    this._initializeResponseInterceptor();
  }

  private _initializeResponseInterceptor = () => {
    this.instance.interceptors.response.use(
      this._handleResponse,
      this._handleError,
    );
  };

  private _handleResponse = ({ data }: AxiosResponse) => data;

  protected _handleError = (error: any) => Promise.reject(error);
}
