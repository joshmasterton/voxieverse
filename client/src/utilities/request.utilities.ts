import { ErrorResponse } from '../../types/utilities/request.utilities.types';

// const API_URL = 'http://localhost:9001';
const API_URL = 'http://ec2-3-10-51-74.eu-west-2.compute.amazonaws.com:9001';

export const request = async <T, D>(
  url: string,
  method: string,
  body?: T | FormData
) => {
  try {
    const isFormData = body instanceof FormData;
    const requestInfo: RequestInit = {
      method,
      headers: isFormData ? {} : { 'Content-Type': 'application/json' },
      credentials: 'include'
    };

    if (body) {
      requestInfo.body = isFormData ? body : JSON.stringify(body);
    }

    const response = await fetch(`${API_URL}${url}`, requestInfo);

    if (!response.ok) {
      const { error } = (await response.json()) as ErrorResponse;
      throw new Error(error);
    }

    const data = (await response.json()) as D;
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
  }
};
