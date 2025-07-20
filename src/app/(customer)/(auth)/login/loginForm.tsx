"use client";

import { useState } from "react";
import Link from "next/link";
import SubmitButton from "@/components/admin/SubmitButton";
import { Eye, EyeClosed } from "lucide-react";

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form action="#">
      <div className="mb-4">
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Email address
        </label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="test@example.com"
          autoComplete="email"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
        />
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-1">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <Link
            href="#"
            className="text-sm text-[var(--tertiary)] hover:underline"
          >
            Forgot password?
          </Link>
        </div>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            placeholder="••••••••"
            autoComplete="current-password"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500"
          >
            {showPassword ? (
              <Eye />
            ) : (
              <EyeClosed />
            )}
          </button>
        </div>
      </div>

      <SubmitButton label="Login" className="w-full"/>
    </form>
  );
};

export default LoginForm;
