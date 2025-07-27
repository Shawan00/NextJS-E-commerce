import React from 'react';
import LoginForm from './loginForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Admin Login | Manage FurStore",
};

function LoginPage() {

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200">
        <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-lg mx-2">
          <div className="text-center mb-10">
            <h2 className="mt-6 text-3xl font-bold text-primary">
              Welcome Back!
            </h2>
            <p className="mt-2 text-sm text-secondary-foreground">
              Sign in as an admin to manage your store.
            </p>
          </div>
          <div className="bg-cyan-50 border border-cyan-200 text-sm text-cyan-800 rounded-lg p-4 mb-6 flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <p>
              Use <strong className="font-semibold">admin@gmail.com</strong> with password <strong className="font-semibold">Test@123</strong>
            </p>
          </div>
          
          <LoginForm/>
        </div>
      </div>
    </>
  );
};

export default LoginPage;