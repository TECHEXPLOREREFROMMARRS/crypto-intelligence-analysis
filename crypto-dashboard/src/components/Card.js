function Card({ title, children }) {

  return (
    <div className="bg-gray-800 rounded-xl shadow-lg p-5">

      <h2 className="text-lg font-semibold mb-4 text-gray-300">
        {title}
      </h2>

      {children}

    </div>
  );

}

export default Card;