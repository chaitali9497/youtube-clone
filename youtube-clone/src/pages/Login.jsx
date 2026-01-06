

function Login() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      
   
      <div className="bg-white w-105 rounded-lg shadow-sm px-10 py-10">
        
 
        <img
          src="https://www.gstatic.com/images/branding/googlelogo/1x/googlelogo_color_92x30dp.png"
          alt="Google"
          className="mb-4"
        />

        <h1 className="text-2xl font-normal text-gray-900">
          Sign in
        </h1>
        <p className="text-sm text-gray-600 mt-1 mb-6">
          Use your Google Account
        </p>

    
        <form className="space-y-4">
          <input
            type="email"
            placeholder="Email or phone"
            className="w-full px-4 py-3 border rounded-md focus:outline-none focus:border-blue-600"
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 border rounded-md focus:outline-none focus:border-blue-600"
          />

          <div>
            <a
              href="#"
              className="text-sm text-blue-600 font-medium hover:underline"
            >
              Forgot email?
            </a>
          </div>

          <p className="text-sm text-gray-600 mt-6">
            Not your computer? Use Guest mode to sign in privately.
            <a href="#" className="text-blue-600 ml-1 hover:underline">
              Learn more
            </a>
          </p>

          {/* Actions */}
          <div className="flex justify-between items-center mt-8">
            <a
              href="#"
              className="text-sm text-blue-600 font-medium hover:underline"
            >
              Create account
            </a>

            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
            >
              Next
            </button>
          </div>
        </form>
      </div>

    
    </div>
  );
}

export default Login;
