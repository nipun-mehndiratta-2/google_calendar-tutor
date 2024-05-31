const Card = ({ children }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md md:max-w-lg lg:max-w-xl">
        {children}
      </div>
    </div>
  );
};

export default Card;
