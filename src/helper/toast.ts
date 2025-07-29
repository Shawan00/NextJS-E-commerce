"use client";
import { toast, ToastOptions } from "react-toastify";

type ToastType = 'success' | 'error' | 'info' | 'warning';

export const showToast = (type: ToastType, message: string): void => {
  const options: ToastOptions = {
    position: "bottom-left",
    autoClose: 3000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'colored',
  };


  if (type) {
    toast[type](message, options);
  } else {
    toast(message, options);
  }
};
