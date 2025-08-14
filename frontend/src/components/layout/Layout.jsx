import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import { AnimatePresence, motion } from 'framer-motion';
import Chatbot from '../chatbot/Chatbot'; // Import the chatbot

const pageVariants = {
    initial: { opacity: 0, y: 15 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -15 },
};

const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.4,
};

const Layout = () => {
    const location = useLocation();
  return (
    <div className="bg-light min-h-screen">
      <Navbar />
      {/* Add padding-top to account for the fixed navbar's height */}
      <main className="pt-24 px-4 sm:px-6 lg:px-8">
         <AnimatePresence mode="wait">
            <motion.div
                key={location.pathname}
                variants={pageVariants}
                transition={pageTransition}
                initial="initial"
                animate="in"
                exit="out"
            >
                <Outlet />
            </motion.div>
        </AnimatePresence>
      </main>
      
      <Chatbot />
    </div>
  );
};

export default Layout;