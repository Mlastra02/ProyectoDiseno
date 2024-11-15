function Form({ textUsername, textPassword, textButton }) {
  return (
    <form className="space-y-6">
      <div className="relative">
        <label htmlFor="username" className="absolute left-3 top-2 ">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </label>
        <input
          type="text"
          id="username"
          placeholder={textUsername}
          // value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="pl-10 pr-4 py-2 w-full border-green-300 focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50 rounded-md"
        />
      </div>
      <div className="relative">
        <label htmlFor="password" className="absolute left-3 top-2 ">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 4v4m0 4v8m4-4H8"
            />
          </svg>
        </label>
        <input
          type="password"
          id="password"
          placeholder={textPassword}
          // value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="pl-10 pr-4 py-2 w-full border-green-300 focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50 rounded-md"
        />
      </div>
      <button
        type="submit"
        className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-500 transition duration-300"
      >
        {textButton}
      </button>
    </form>
  );
}

export default Form;
