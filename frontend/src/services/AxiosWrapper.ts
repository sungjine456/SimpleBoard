import axios, { AxiosError, AxiosResponse, Method } from "axios";

interface ServerError {
  errorMessage: string;
}

interface AxiosData {
  method: Method;
  url: string;
  data?: {};
  header: {};
}

const localUrl = "http://localhost:8080";

const wrapper = async <T>(axiosData: AxiosData): Promise<T | ServerError> => {
  const method = axiosData.method;
  const url = localUrl + axiosData.url;
  const data = axiosData.data;
  const header = axiosData.header;

  try {
    const response: AxiosResponse<T, any> | false =
      (method === "get" && (await axios.get(url, header))) ||
      (method === "post" && (await axios.post(url, data, header)));

    if (!response) {
      return { errorMessage: "잘못된 HTTP Method" };
    }

    return response.data;
  } catch (e) {
    if (axios.isAxiosError(e)) {
      const error = e as AxiosError<{ message: string }>;

      if (error && error.response?.data) {
        return {
          errorMessage: error.response?.data.message,
        };
      }
    }

    return { errorMessage: "" };
  }
};

function isError<T>(v: T | ServerError): v is ServerError {
  return (v as ServerError).errorMessage !== undefined;
}

async function orElse<T>(ps: Promise<T | ServerError>, or: T): Promise<T> {
  const v = await ps;

  return isError(v) ? or : v;
}

const get = <T>(url: string, header: {} = {}) => {
  return wrapper<T>({ method: "get", url, header });
};

const post = <T>(url: string, data: {}, header: {} = {}) => {
  return wrapper<T>({ method: "post", url, data, header });
};

const getOrElse = <T>(url: string, header: {} = {}, or: T) => {
  return orElse<T>(wrapper<T>({ method: "get", url, header }), or);
};

const postOrElse = <T>(url: string, data: {}, header: {} = {}, or: T) => {
  return orElse<T>(wrapper<T>({ method: "post", url, data, header }), or);
};

export { get, getOrElse, post, postOrElse, isError };
