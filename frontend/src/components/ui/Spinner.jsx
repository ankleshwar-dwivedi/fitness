import { motion } from 'framer-motion';
import { Loader } from 'lucide-react';

const Spinner = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  };

  return (
    <div className="flex justify-center items-center p-4">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      >
        <Loader className={`${sizeClasses[size]} text-secondary`} />
      </motion.div>
    </div>
  );
};

export default Spinner;