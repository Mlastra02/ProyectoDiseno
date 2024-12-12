import { User, Lock } from "lucide-react";
function Form({
  textUsername,
  textPassword,
  textButton,
  handleSubmit,
  handleChangeUserName,
  handleChangePassword,
  children,
}) {
  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="relative items-center">
        <label
          htmlFor="username"
          className="absolute left-3 top-2 text-gray-300"
        >
          <User size={20} />
        </label>
        <input
          type="text"
          name="username"
          id="username"
          placeholder={textUsername}
          // value={username}
          onChange={handleChangeUserName}
          className="pl-10 pr-4 py-2 w-full text-black rounded-md"
        />
      </div>
      <div className="relative items-center">
        <label
          htmlFor="password"
          className="absolute left-3 top-2 text-gray-300"
        >
          <Lock size={20} />
        </label>
        <input
          type="password"
          id="password"
          name="password"
          placeholder={textPassword}
          // value={password}
          onChange={handleChangePassword}
          className="pl-10 pr-4 py-2 w-full text-black rounded-md"
        />
      </div>
      {children}
      <button
        type="submit"
        className="w-full px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-500 transition duration-300"
      >
        {textButton}
      </button>
    </form>
  );
}

export default Form;
