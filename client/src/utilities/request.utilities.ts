const API_URL = 'http://localhost:9001';

export const request = async <T>(
  url: string,
  method: string,
  body: T | FormData
) => {
  try {
    const isFormData = body instanceof FormData;
    const requestInfo: RequestInit = {
      method,
      headers: isFormData ? {} : { 'Content-Type': 'application/json' },
      body: isFormData ? body : JSON.stringify(body),
      credentials: 'include'
    };

    const response = await fetch(`${API_URL}${url}`, requestInfo);

    if (!response.ok) {
      throw new Error('Server error');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    }
  }
};
