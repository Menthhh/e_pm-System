


const Home =  () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold text-center bg-blue-600 w-1/4 p-4 text-gray-100 shadow-lg">e_pm</h1>
      <div className="flex flex-col items-center gap-10 bg-white p-10 w-1/4 shadow-lg">
        <h2 className="font-semibold text-3xl">Login</h2>
        <form className="flex flex-col items-center gap-5 ">
          <input className="ring-1 ring-black p-4 rounded-sm" type="text" placeholder="username" />
          <input className="ring-1 ring-black p-4 rounded-sm" type="text" placeholder="password" />
          <button className="bg-blue-600 text-white py-3 w-full rounded-md hover:bg-blue-500"> Login </button>
        </form>
      </div>
    </div>

  );
};

export default Home;