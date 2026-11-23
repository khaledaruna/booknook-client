
"use client";

import { authClient } from "./auth-client";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000"
).replace(/\/$/, "");

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type ApiOptions = Omit<RequestInit, "headers"> & {
  headers?: HeadersInit;
  authenticated?: boolean;
};

export async function apiRequest<T>(
  path: string,
  options: ApiOptions = {}
): Promise<T> {
  const {
    authenticated = false,
    headers: customHeaders,
    ...requestOptions
  } = options;

  const headers = new Headers(customHeaders);

  headers.set("Accept", "application/json");

  if (
    requestOptions.body &&
    !headers.has("Content-Type") &&
    !(
      typeof FormData !== "undefined" &&
      requestOptions.body instanceof FormData
    )
  ) {
    headers.set("Content-Type", "application/json");
  }

  if (authenticated) {
    const { data, error } = await authClient.token();

    if (error || !data?.token) {
      throw new ApiError(
        "Your session has expired. Please log in again.",
        401
      );
    }

    headers.set(
      "Authorization",
      `Bearer ${data.token}`
    );
  }

  const endpoint = path.startsWith("/")
    ? path
    : `/${path}`;

  const response = await fetch(
    `${API_URL}${endpoint}`,
    {
      ...requestOptions,
      headers,
    }
  );

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(
      payload?.message ||
        "The request could not be completed.",
      response.status
    );
  }

  return payload as T;
}
