function FormInput({ placeholder, type, id, handleChange }) {
  return (
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
        type={type}
        id={id}
        name={id}
        placeholder={placeholder}
        // value={password}
        onChange={handleChange}
        className="pl-10 pr-4 py-2 w-full text-black rounded-md"
      />
    </div>
  );
}

export default FormInput;
