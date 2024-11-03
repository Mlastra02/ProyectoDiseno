// components/Seccion1.js
export default function Seccion1({ title, description }) {
  return (
    <section
      id="seccion1"
      className="text-center py-4 mx-4 mt-4 text-soft-dark"
    >
      <h2 className="text-4xl font-extrabold mb-6 text-teal-700 font-sans text-soft-dark">
        {title}
      </h2>
      <p className="text-xl leading-relaxed mx-auto max-w-prose font-medium italic">
        {description}
      </p>
    </section>
  );
}
