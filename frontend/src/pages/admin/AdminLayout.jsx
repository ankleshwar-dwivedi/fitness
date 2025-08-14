import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from '../../components/layout/Navbar'; // Admins now use the main navbar

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


const AdminLayout = () => {
    const location = useLocation();

    return (
        <div className="bg-light min-h-screen">
            <Navbar />
            <main className="pt-24 container mx-auto px-4 sm:px-6 lg:px-8">
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
        </div>
    );
};

export default AdminLayout;