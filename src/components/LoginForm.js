"use client";
import { login } from "@/lib/utils/utils.js";
import Link from "next/link";
import { useFormState } from "react-dom";
import { useState } from "react"; // Import useState hook
import KeyIcon from '@mui/icons-material/Key';
import PersonIcon from '@mui/icons-material/Person';

export default function LoginForm() {
  const [state, formAction] = useFormState(login, undefined);
  const [showPassword, setShowPassword] = useState(false); // State to manage password visibility

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword); // Toggle password visibility
  };

  return (
    <div className="h-screen w-screen bg-blue-600 flex justify-center items-center">
      <div className="flex flex-col items-center justify-center container font-sans shadow-2xl drop-shadow-2xl w-8/12 ipadmini:w-4/12 ">
        <h1 className="text-4xl font-bold text-center w-full p-4 rounded-t-lg bg-blue-700 text-white">
          e_pm
        </h1>
        <div className="flex flex-col items-center gap-10 bg-white p-10 w-full relative pb-24 rounded-b-lg">
          <PersonIcon className="text-gray-500 w-20 h-20" />
          <form className="flex flex-col items-center gap-5 " action={formAction}>
            <div className="flex">
              <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border rounded-e-0 border-gray-300 border-e-0 rounded-s-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
                <svg className="w-6 h-6 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
                </svg>
              </span>
              <input type="text" id="website-admin" class="w-72 rounded-none rounded-e-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 text-sm border-gray-300 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                name="username"
                placeholder="Username"
              />
            </div>
            <div class="flex">
              <span class="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border rounded-e-0 border-gray-300 border-e-0 rounded-s-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
                <KeyIcon className="text-gray-500 w-6 h-6" />
              </span>
              <input
                type="password"
                className="w-72 rounded-none rounded-e-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 text-sm border-gray-300 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                name="password"
                placeholder="Password"
              />
            </div>
            <button className="bg-blue-600 text-white py-3 w-full rounded-md hover:bg-blue-500 font-bold mt-3 text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">
              Login
            </button>
            {state?.message && <p className="text-red-500">{state.message}</p>}
          </form>
          <Link href="/pages/register" className="underline text-sm cursor-pointer hover:text-gray-400 absolute right-2 bottom-2">
            Don't have an account?
          </Link>
        </div>
      </div>
    </div>
  );
}
