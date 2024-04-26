"use client";
import { register } from "@/lib/utils/utils";
import { useFormState } from "react-dom";
import MessageBox from "./MessageBox";
import { useState } from "react";
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';
import Link from "next/link";

export default function RegisterForm() {
  const [state, formAction] = useFormState(register, undefined);
  const [showMessageBox, setShowMessageBox] = useState(false);


  const handleCloseMessageBox = () => {
    setShowMessageBox(false);
  };

  const handleSubmit = (e) => {
    setShowMessageBox(true);
  }

  return (
    <>
    {showMessageBox? 
    <div className="bg-white shadow-2xl w-2/4 h-2/4 flex flex-col justify-center items-center gap-5">
     <h1>Regsiter successfully</h1>
     <Link className="bg-blue-600 text-white py-3 w-1/2 rounded-md hover:bg-blue-500 my-5 text-center" onClick={handleCloseMessageBox} href="/pages/login">
          OK
      </Link>
    </div>: 
    <div className="flex flex-col w-3/4 ipadmini:w-2/4 h-auto lg:h-3/4 bg-white shadow-lg pb-5 rounded-3xl">
      <h1 className="text-4xl font-bold text-center bg-blue-600 p-4 text-gray-100 rounded-t-3xl">
        e_pm
      </h1>
      <h2 className="text-2xl font-bold text-center py-4 ">Register</h2>
      <form className="flex flex-col justify-center items-center gap-5 " action={formAction} onSubmit={handleSubmit}>
        <div className="flex flex-col justify-around lg:flex-row  gap-5 ">
          <div className="flex flex-col gap-5 flex-1 items-center justify-center">
            <span className="flex flex-col ">
              <p className="text-sm">Employee Number</p>
              <input
                placeholder="Employee Number"
                type="text"
                className="ring-1 ring-black p-1 rounded-sm w-96 ipadmini:w-64"
                name="employeeNumber"
              />
            </span>
            <span className="flex flex-col ">
              <p className="text-sm">Employee Name</p>
              <input
                placeholder="Employee Name"
                type="text"
                className="ring-1 ring-black p-1 rounded-sm w-96 ipadmini:w-64"
                name="employeeName"
              />
            </span>
            <span className="flex flex-col ">
              <p className="text-sm">Email</p>
              <input
                placeholder="Email"
                type = "text"
                className="ring-1 ring-black p-1 rounded-sm w-96 ipadmini:w-64"
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
                className="ring-1 ring-black p-1 rounded-sm w-96 ipadmini:w-64"
                name="username"
              />
            </span>
            <span className="flex flex-col">
              <p className="text-sm">Password</p>
              <input
                placeholder="Password"
                type="text"
                className="ring-1 ring-black p-1 rounded-sm w-96 ipadmini:w-64"
                name="password"
              />
            </span>
            <span className="flex flex-col">
              <p className="text-sm">Team</p>
              <select
                className="ring-1 ring-black p-1 rounded-sm w-96 ipadmini:w-64 "
                name="team"
              >

                <option value="">Select Team</option>
                <option value="team1">Team 1</option>
                <option value="team2" >Team 2</option>
                <option value="team3" >Team 3</option>
                
              </select>
            </span>
          </div>
        </div>
        <button className="bg-blue-600 text-white py-3 w-1/2 rounded-md hover:bg-blue-500 my-5">
          Register
        </button>
      </form>
    </div>}
    </>
  );
}
