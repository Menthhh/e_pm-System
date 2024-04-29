"use client";
import { login } from "@/lib/utils/utils";
import Link from "next/link";
import { useFormState } from "react-dom";
import PersonIcon from '@mui/icons-material/Person';
import KeyIcon from '@mui/icons-material/Key';

export default function LoginForm() {
  const [state, formAction] = useFormState(login, undefined);

  return (
    <div className="h-screen w-screen bg-blue-600 flex justify-center items-center">
    <div className="flex flex-col items-center justify-center container font-sans shadow-2xl drop-shadow-2xl sm:w-7/12 lg:w-4/12 xl:w-3/12">
      <h1 className="text-4xl font-bold text-center w-full p-4 rounded-t-lg bg-blue-700 text-white">
        e_pm
      </h1>
      <div className="flex flex-col items-center gap-10 bg-white p-10 w-full relative pb-24 rounded-b-lg">
        <h2 className="text-4xl font-bold pb-4">Login</h2>
        <form className="flex flex-col items-center gap-5 " action={formAction}>
          <div className="flex justify-center items-center">
          <PersonIcon style={{ fontSize: '2.6rem' }} className="bg-blue-600 text-white p-2"/>
          <input
            className="ring-1 ring-[#808080] px-2 py-2 w-72"
            type="text"
            name="username"
            placeholder="Username"
          />
          </div>
          <div className="flex justify-center items-center">
          <KeyIcon style={{ fontSize: '2.6rem' }} className="bg-blue-600 text-white p-2"/>
          <input
            className="ring-1 ring-[#808080] px-2 py-2 w-72"
            type="text"
            name="password"
            placeholder="Password"
          />
          </div>

          <button className="bg-blue-600 text-white py-3 w-full rounded-md hover:bg-blue-500 font-bold mt-3">
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
