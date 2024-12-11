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
        className="pl-10 pr-4 py-2 w-full text-black rounded-md"
      />
    </div>
  );
}

export default FormInput;
