function FormLink({ text, href, textLink }) {
  return (
    <p className="text-center text-black mt-4">
      {`${text} `}
      <a href={href} className="text-green-700 hover:underline">
        {textLink}
      </a>
    </p>
  );
}

export default FormLink;
