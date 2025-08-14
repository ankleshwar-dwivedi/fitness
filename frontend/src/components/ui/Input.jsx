const Input = ({ id, name, type = 'text', placeholder, value, onChange, className = '' }) => {
  return (
    <input
      id={id}
      name={name}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`w-full px-4 py-3 bg-light border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:outline-none transition-shadow ${className}`}
    />
  );
};

export default Input;