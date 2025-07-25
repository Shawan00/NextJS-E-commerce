"use client";

export const uploadFile = async (formData: FormData): Promise<string[]> => {
  const res = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  })

  const data = await res.json();
  return data.urls;
}