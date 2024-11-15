function Card({ key, className, children }) {
  return (
    <div key={key} className={className}>
      {children}
    </div>
  );
}

export default Card;
