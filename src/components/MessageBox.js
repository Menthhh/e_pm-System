const MessageBox = ({ message, onYes, onNo }) => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
        <div className="bg-slate-500 bg-opacity-50 w-auto px-5 h-auto py-10 flex flex-col justify-center items-center gap-4">
          <p className="text-white">{message}</p>
          <div className="flex gap-4">
            <button
              className="bg-green-500 px-5 py-2 rounded-md hover:bg-green-600 text-white"
              onClick={onYes}
            >
              Yes
            </button>
            <button
              className="bg-red-500 px-5 py-2 rounded-md hover:bg-red-600 text-white"
              onClick={onNo}
            >
              No
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  export default MessageBox;
  