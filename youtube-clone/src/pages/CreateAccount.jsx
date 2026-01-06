import signupIcon from "../assets/signin-icon/icon-signup.png";
import { EyeIcon } from "@heroicons/react/24/outline";

function CreateAccount() {
  return (
    <div className="min-h-screen bg-blue-500 flex items-center justify-center px-4">
     
      <div className="bg-white rounded-lg shadow-md w-full max-w-4xl p-8">
        <div className="grid md:grid-cols-2 gap-8">

    
          <div>
         
            <h1 className="text-2xl font-semibold mb-1 select-none">
              <span className="text-blue-500">G</span>
              <span className="text-red-500">o</span>
              <span className="text-yellow-500">o</span>
              <span className="text-blue-500">g</span>
              <span className="text-green-500">l</span>
              <span className="text-red-500">e</span>
            </h1>

            <h2 className="text-xl font-medium mb-6">
              Create your Google Account
            </h2>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder="First name"
                className="border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <input
                type="text"
                placeholder="Last name"
                className="border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

           
            <div className="mb-2">
              <div className="flex">
                <input
                  type="text"
                  placeholder="Username"
                  className="flex-1 border rounded-l px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <span className="border border-l-0 rounded-r px-3 py-2 bg-gray-50 text-gray-500">
                  @gmail.com
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                You can use letters, numbers & periods
              </p>
            </div>

            <button className="text-blue-600 text-sm font-medium mb-4 hover:underline">
              Use my current email address instead
            </button>

            <div className="grid grid-cols-2 gap-4 mb-2">
              <div className="relative">
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <EyeIcon className="w-5 h-5 absolute right-3 top-2.5 text-gray-400 cursor-pointer" />
              </div>

              <div className="relative">
                <input
                  type="password"
                  placeholder="Confirm"
                  className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <EyeIcon className="w-5 h-5 absolute right-3 top-2.5 text-gray-400 cursor-pointer" />
              </div>
            </div>

            <p className="text-sm text-gray-500 mb-6">
              Use 8 or more characters with a mix of letters, numbers & symbols
            </p>

            
            <div className="flex items-center justify-between">
              <button className="text-blue-600 font-medium hover:underline">
                Sign in instead
              </button>

              <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition">
                Next
              </button>
            </div>
          </div>

      
          <div className="hidden md:flex flex-col items-center justify-center text-center">
            <img
              src={signupIcon}
              alt="Create account illustration"
              className="w-48 mb-4"
            />
            <p className="text-gray-600 max-w-xs">
              One account. All of Google working for you.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}

export default CreateAccount;
