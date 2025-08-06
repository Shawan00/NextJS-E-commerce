"use client";

import { showToast } from "@/helper/toast";
import { http } from "@/lib/htpp";
import { ForgotPasswordBodyType, LoginBodyType, RegisterBodyType, ResetPasswordBodyType } from "@/schemaValidation/auth.schema"
import { redirect } from "next/navigation";
import { SubmitHandler } from "react-hook-form";

export const adminLogin: SubmitHandler<LoginBodyType> = async (data) => {
  const response = await fetch('/api/auth/admin/login', { // call api from API route
    headers: {
      "Content-Type": "application/json"
    },
    method: "POST",
    body: JSON.stringify(data)
  })
  const res = await response.json()

  if (response.status === 200 && 'admin' in res.payload) {
    showToast('success', res.payload.message);
    redirect("/admin/product")
  } else {
    showToast('error', res.payload.message);
  }
}

export const customerLogin: SubmitHandler<LoginBodyType> = async (data) => {
  const response = await fetch('/api/auth/login', { // call api from API route
    headers: {
      "Content-Type": "application/json"
    },
    method: "POST",
    body: JSON.stringify(data)
  })
  const res = await response.json()

  if (response.status === 200 && 'customer' in res.payload) {
    showToast('success', res.payload.message);
    redirect("/");
  } else {
    showToast('error', res.payload.message);
  }
}

export const customerRegister: SubmitHandler<RegisterBodyType> = async (data) => {
  const response = await fetch('/api/auth/register', { // call api from API route
    headers: {
      "Content-Type": "application/json"
    },
    method: "POST",
    body: JSON.stringify(data)
  })
  const res = await response.json()

  if (response.status === 201 && 'customer' in res.payload) {
    showToast('success', res.payload.message);
    redirect("/");
  } else {
    showToast('error', res.payload.message);
  }
}

export const customerForgotPassword: SubmitHandler<ForgotPasswordBodyType> = async (data) => {
  const res = await http.post<{message: string}>('/auth/forgot-password', data);
  if (res.status === 200) {
    redirect(`/reset-password?email=${data.email}`);
  } else {
    showToast('error', res.payload.message || 'Failed to send OTP');
  }
}

export const customerResetPassword: SubmitHandler<ResetPasswordBodyType> = async (data) => {
  const res = await http.post<{message: string}>('/auth/reset-password', data);
  console.log(res, data)
  if (res.status === 200) {
    showToast('success', res.payload.message);
    redirect('/login');
  } else {
    showToast('error', res.payload.message || 'Failed to reset password');
  }
}