"use client";
import { login } from "@/lib/utils/utils";
import { useFormState } from "react-dom";

export default function LoginForm() {
  const [state, formAction] = useFormState(login, undefined);

  return (
    <div className="flex flex-col items-center justify-center h-screen container mx-auto left-0 right-0 w-1/2 lg:w-2/6">
      <h1 className="text-4xl font-bold text-center bg-blue-600 w-full  p-4 text-gray-100 shadow-lg">
        e_pm
      </h1>
      <div className="flex flex-col items-center gap-10 bg-white p-10 w-full shadow-lg">
        <h2 className="font-semibold text-3xl">Login</h2>
        <form className="flex flex-col items-center gap-5 " action={formAction}>
          <input
            className="ring-1 ring-black p-4 rounded-sm w-64"
            type="text"
            placeholder="username"
          />
          <input
            className="ring-1 ring-black p-4 rounded-sm w-64"
            type="text"
            placeholder="password"
          />
          <button className="bg-blue-600 text-white py-3 w-full rounded-md hover:bg-blue-500">
            Login
          </button>
          {state?.error && <p>{state.error}</p>}
        </form>
      </div>
    </div>
  );
}
