import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

type TokenGetter = () => Promise<string>;

declare module "axios" {
  export interface AxiosRequestConfig {
    skipAuth?: boolean;
  }
}

let getAccessToken: TokenGetter | null = null;
let resolveTokenGetterReady: () => void;
const tokenGetterReady = new Promise<void>((resolve) => {
  resolveTokenGetterReady = resolve;
});

export const setAccessTokenGetter = (getter: TokenGetter) => {
  getAccessToken = getter;
  resolveTokenGetterReady();
};

axiosInstance.interceptors.request.use(async (config) => {
  if (config.skipAuth) return config;

  await tokenGetterReady;
  const token = await getAccessToken!();
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

class ApiClient {
  endpoint: string;
  skipAuth: boolean;

  constructor(endpoint: string, skipAuth = false) {
    this.endpoint = endpoint;
    this.skipAuth = skipAuth;
  }

  private buildUrl = (endpointExtension?: string) => {
    if (!endpointExtension) return this.endpoint;
    return endpointExtension.startsWith("?")
      ? `${this.endpoint}${endpointExtension}`
      : `${this.endpoint}/${endpointExtension}`;
  };

  get = async <TResponse>(endpointExtension?: string, signal?: AbortSignal) => {
    const response = await axiosInstance.get<TResponse>(
      this.buildUrl(endpointExtension),
      { skipAuth: this.skipAuth, signal },
    );
    return response.data;
  };

  post = async <TResponse, TRequest>(
    endpointExtension?: string,
    data?: TRequest,
  ) => {
    const response = await axiosInstance.post<TResponse>(
      this.buildUrl(endpointExtension),
      data,
      { skipAuth: this.skipAuth },
    );
    return response.data;
  };

  patch = async <TResponse, TRequest>(
    endpointExtension?: string,
    data?: TRequest,
  ) => {
    const response = await axiosInstance.patch<TResponse>(
      this.buildUrl(endpointExtension),
      data,
      { skipAuth: this.skipAuth },
    );
    return response.data;
  };

  delete = async <TResponse>(endpointExtension?: string) => {
    const response = await axiosInstance.delete<TResponse>(
      this.buildUrl(endpointExtension),
      { skipAuth: this.skipAuth },
    );
    return response.data;
  };
}

export default ApiClient;
