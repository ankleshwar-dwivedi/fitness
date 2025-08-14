import { motion } from 'framer-motion';

const Button = ({ children, onClick, type = 'button', variant = 'primary', className = '' }) => {
  const baseStyle = 'px-6 py-2.5 rounded-full font-semibold text-white transition-all duration-300 shadow-lg';
  
  const variants = {
    primary: 'bg-secondary hover:bg-accent hover:text-primary',
    secondary: 'bg-primary hover:bg-opacity-80',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      type={type}
      onClick={onClick}
      className={`${baseStyle} ${variants[variant]} ${className}`}
    >
      {children}
    </motion.button>
  );
};

export default Button;