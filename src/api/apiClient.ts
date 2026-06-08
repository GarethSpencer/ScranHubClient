import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://localhost:7079/api/v1",
});

class ApiClient<T> {
  endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  getAll = () => {
    return axiosInstance
      .get<T[]>(this.endpoint)
      .then((response) => response.data);
  };

  get = () => {
    return axiosInstance
      .get<T>(this.endpoint)
      .then((response) => response.data);
  };
}

export default ApiClient;
