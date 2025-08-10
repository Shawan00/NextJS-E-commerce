const request = async<Response>(
  url: string,
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' = 'GET',
  body?: Record<string, unknown> | undefined | FormData
) => {
  const headers = {
    'Content-Type': 'application/json',
  }

  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const fullUrl = url.startsWith('/') ? `${baseUrl}${url}` : `${baseUrl}/${url}`

  try {
    const res = await fetch(fullUrl, {
      method,
      headers,
      body: body instanceof FormData ? body : JSON.stringify(body),
      cache: method === 'GET' ? 'default' : 'no-store'
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
    params?: Record<string, unknown>
  ) {
    const queryString = new URLSearchParams();

    Object.entries(params || {}).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach(v => queryString.append(key, v.toString()));
      } else if (value !== null && value !== undefined) {
        queryString.append(key, String(value));
      }
    });
    return request<Response>(`${url}?${queryString}`, "GET");
  },
  post<Response>(
    url: string,
    body: Record<string, unknown> | undefined | FormData
  ) {
    return request<Response>(url, "POST", body);
  },
  patch<Response>(
    url: string,
    body: Record<string, unknown> | undefined | FormData
  ) {
    return request<Response>(url, "PATCH", body);
  },
  put<Response>(
    url: string,
    body: Record<string, unknown> | undefined | FormData
  ) {
    return request<Response>(url, "PUT", body);
  },
  delete<Response>(
    url: string,
    id: number
  ) {
    return request<Response>(`${url}/${id}`, "DELETE")
  }
}