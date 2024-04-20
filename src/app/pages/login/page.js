"use client"
import { useContext, useEffect, useRef, useState } from "react";
import { redirect } from "next/navigation"; // Import redirect
import { AuthContext } from "@/lib/context/AuthContext";


const Home = () => {
  const userInput = useRef(null);
  const passwordInput = useRef(null);
  const { state, dispatch } = useContext(AuthContext);

  const handleLogin = (event) => {
    event.preventDefault(); // Prevent default form submission behavior
    const username = userInput.current.value;
    const password = passwordInput.current.value;

    fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ "username": username, "password": password }),
    })
      .then((res) => res.json())
      .then((data) => {
        dispatch({ type: "LOGIN_SUCCESS", payload: data });
      });
  }

  useEffect(() => {
    if (state.accessLevel === "SA") {
      redirect("/pages/role-determiner");
    }
    if (state.accessLevel === "USER") {
      redirect("/pages/role-determiner");
    }
    else {
      console.log("Invalid Access Level")
    }
  }, [state]);


  return (
    <div className="flex flex-col items-center justify-center h-screen container mx-auto left-0 right-0 w-1/2 lg:w-2/6">
      <h1 className="text-4xl font-bold text-center bg-blue-600 w-full  p-4 text-gray-100 shadow-lg">e_pm</h1>
      <div className="flex flex-col items-center gap-10 bg-white p-10 w-full shadow-lg">
        <h2 className="font-semibold text-3xl">Login</h2>
        <div className="flex flex-col items-center gap-5 " >
          <input className="ring-1 ring-black p-4 rounded-sm w-64" type="text" placeholder="username" ref={userInput} />
          <input className="ring-1 ring-black p-4 rounded-sm w-64" type="text" placeholder="password" ref={passwordInput} />
          <button className="bg-blue-600 text-white py-3 w-full rounded-md hover:bg-blue-500" onClick={(e) => { handleLogin(e) }}> Login </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
