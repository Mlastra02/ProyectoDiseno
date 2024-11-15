function FormBox({ children, boxSize }) {
  return (
    <div
      className={`w-full ${boxSize} backdrop-blur-sm bg-white/70 py-8 px-4 rounded-xl shadow-lg text-center`}
    >
      {children}
    </div>
  );
}

export default FormBox;
