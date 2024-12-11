function FormInput({ placeholder, type, id, handleChange, children }) {
  return (
    <div className="relative">
      {children}
      <input
        type={type}
        id={id}
        name={id}
        placeholder={placeholder}
        // value={password}
        onChange={handleChange}
        className={`${
          children ? "pl-10" : "pl-5"
        } pr-4 py-2 w-full text-black rounded-md focus:outline-none focus:ring-2 focus:ring-green-600`}
      />
    </div>
  );
}

export default FormInput;
