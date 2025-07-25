const request = async<Response>(
  url: string,
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' = 'GET',
  body?: Record<string, any> | undefined | FormData
) => {
  const headers: { [key: string]: string } = body instanceof FormData ? {} : { 'Content-Type': 'application/json' };

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';
  const fullUrl = url.startsWith('/') ? `${baseUrl}${url}` : `${baseUrl}/${url}`

  try {
    const res = await fetch(fullUrl, {
      method,
      headers,
      body: body instanceof FormData ? body : JSON.stringify(body),
    });
    const payload: Response = await res.json();
    return {
      status: res.status,
      payload
    }
  } catch (error) {
    console.log("API Erorr", error)
    return {
      status: 500,
      payload: {
        error,
        message: "An unknow error"
      }
    }
  }
}

export const http = {
  get<Response>(
    url: string,
    params?: Record<string, any>
  ) {
    const queryString = new URLSearchParams();

    Object.entries(params || {}).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach(v => queryString.append(key, v.toString()));
      } else {
        queryString.append(key, value.toString());
      }
    });
    return request<Response>(`${url}?${queryString}`, "GET");
  },
  post<Response>(
    url: string,
    body: Record<string, any> | undefined | FormData
  ) {
    return request<Response>(url, "POST", body);
  },
  patch<Response>(
    url: string,
    body: Record<string, any> | undefined | FormData
  ) {
    return request<Response>(url, "PATCH", body);
  },
  put<Response>(
    url: string,
    body: Record<string, any> | undefined | FormData
  ) {
    return request<Response>(url, "PUT", body);
  },
  delete<Response>(
    url: string,
    id: number
  ) {
    return request<Response>(`${url}${id}`, "DELETE")
  }
}