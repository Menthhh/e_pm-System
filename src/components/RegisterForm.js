"use client";
import { register } from "@/lib/utils/utils";
import { useFormState } from "react-dom";

export default function RegisterForm() {
  const [state, formAction] = useFormState(register, undefined);



  return (
    <div className="flex flex-col w-2/4 h-auto lg:h-3/4 bg-white shadow-lg pb-5 rounded-3xl">
      <h1 className="text-4xl font-bold text-center bg-blue-600 p-4 text-gray-100 rounded-t-3xl">
        e_pm
      </h1>
      <h2 className="text-2xl font-bold text-center py-4 ">Register</h2>
      <form className="flex flex-col justify-center items-center gap-5 " action={formAction} >
        <div className="flex flex-col justify-around lg:flex-row w-full gap-5 lg:gap-0">
          <div className="flex flex-col gap-5 flex-1 items-center justify-center">
            <span className="flex flex-col ">
              <p className="text-sm">Employee Number</p>
              <input
                placeholder="Employee Number"
                type="number"
                className="ring-1 ring-black p-1 rounded-sm w-64"
                name="employeeNumber"
              />
            </span>
            <span className="flex flex-col ">
              <p className="text-sm">Employee Name</p>
              <input
                placeholder="Employee Name"
                type="text"
                className="ring-1 ring-black p-1 rounded-sm w-64"
                name="employeeName"
              />
            </span>
            <span className="flex flex-col ">
              <p className="text-sm">Email</p>
              <input
                placeholder="Email"
                type = "text"
                className="ring-1 ring-black p-1 rounded-sm w-64"
                name = "email"
              />
            </span>
          </div>

          <div className="flex flex-col gap-5 flex-1 items-center">
            <span className="flex flex-col">
              <p className="text-sm">Username</p>
              <input
                placeholder="Username"
                type="text"
                className="ring-1 ring-black p-1 rounded-sm w-64"
                name="username"
              />
            </span>
            <span className="flex flex-col">
              <p className="text-sm">Password</p>
              <input
                placeholder="Password"
                type="text"
                className="ring-1 ring-black p-1 rounded-sm w-64"
                name="password"
              />
            </span>
            <span className="flex flex-col">
              <p className="text-sm">Team</p>
              <select
                className="ring-1 ring-black p-1 rounded-sm w-64"
                name="team"
              >
                <option value="">Select Team</option>
                <option value="team1">Team 1</option>
                <option value="team2">Team 2</option>
                <option value="team3">Team 3</option>
              </select>
            </span>
          </div>
        </div>
        <button className="bg-blue-600 text-white py-3 w-1/2 rounded-md hover:bg-blue-500 my-5">
          Register
        </button>
      </form>
    </div>
  );
}
