import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

class ApiClient<T> {
  endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  getAll = async () => {
    const response = await axiosInstance.get<T[]>(this.endpoint);
    return response.data;
  };

  get = async () => {
    const response = await axiosInstance.get<T>(this.endpoint);
    return response.data;
  };

  patch = async <TRequest>(id: string, data: TRequest) => {
    const response = await axiosInstance.patch<T>(
      `${this.endpoint}/${id}`,
      data
    );
    return response.data;
  };
}

export default ApiClient;
