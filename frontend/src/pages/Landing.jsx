// /frontend/src/pages/Landing.jsx
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "../components/ui/Button";
import { BarChart, Dumbbell, UtensilsCrossed, CheckCircle } from "lucide-react";
import Navbar from "../components/layout/Navbar";


const heroImageUrl = "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2070&auto=format&fit=crop"; 
const featureImageUrl = "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg"; 

const Feature = ({ icon, title, text }) => (
    <div className="flex items-start gap-4">
        <div className="flex-shrink-0 p-3 bg-secondary/10 text-secondary rounded-full">{icon}</div>
        <div>
            <h3 className="text-xl font-bold text-primary">{title}</h3>
            <p className="text-muted mt-1">{text}</p>
        </div>
    </div>
);


const Landing = () => {
  return (
    <>
      <Navbar />
      <div className="overflow-hidden">
        {/* Blob Animations Background */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
            <div className="blob-animated blob-gradient delay-1 top-0 left-0"></div>
            <div className="blob-animated blob-gradient delay-2 top-1/2 left-1/3"></div>
            <div className="blob-animated blob-gradient delay-3 top-1/3 right-0"></div>
        </div>

        {/* Hero Section */}
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32">
            <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
                <motion.div 
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-center lg:text-left"
                >
                    <h1 className="text-5xl md:text-6xl font-extrabold text-primary leading-tight">
                        Stop Guessing. <br/> Start <span className="text-secondary">Achieving.</span>
                    </h1>
                    <p className="mt-6 max-w-lg mx-auto lg:mx-0 text-lg text-muted">
                        FitTrack is your personal AI-powered fitness and nutrition coach. Get dynamic plans, track every detail, and visualize your success in one simple platform.
                    </p>
                    <Link to="/login" className="mt-8 inline-block">
                        <Button className="!px-8 !py-3 text-lg">Start Your Transformation</Button>
                    </Link>
                </motion.div>
                <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                >
                    <img src={heroImageUrl} alt="Fitness" className="rounded-3xl shadow-2xl w-full h-auto object-cover" />
                </motion.div>
            </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-16 items-center">
                <motion.div
                     initial={{ opacity: 0, scale: 0.9 }}
                     whileInView={{ opacity: 1, scale: 1 }}
                     viewport={{ once: true, amount: 0.5 }}
                     transition={{ duration: 0.6 }}
                >
                    <img src={featureImageUrl} alt="Healthy Meal" className="rounded-3xl shadow-xl"/>
                </motion.div>
                <motion.div 
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.6 }}
                    className="space-y-8"
                >
                    <h2 className="text-4xl font-bold text-primary">Your Goals, Your Plan.</h2>
                    <Feature icon={<UtensilsCrossed />} title="AI-Powered Meal Plans" text="Tell us your goal and we'll generate daily meal suggestions tailored to your calorie and macro needs." />
                    <Feature icon={<Dumbbell />} title="Intelligent Workout Logging" text="Search thousands of exercises, log your sets, reps, and duration, and we’ll calculate the calories burned." />
                    <Feature icon={<BarChart />} title="Visualize Your Progress" text="Stay motivated with intuitive charts that show your calorie balance, weight trends, and consistency over time." />
                </motion.div>
            </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-20 text-center">
             <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-4xl font-bold text-primary">Ready to Take Control?</h2>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-muted">Join thousands of others on their journey to a healthier life. Your first step is just a click away.</p>
                     <Link to="/login" className="mt-8 inline-block">
                        <Button className="!px-10 !py-4 text-xl">Sign Up for Free</Button>
                    </Link>
                </motion.div>
             </div>
        </section>
      </div>
    </>
  );
};

export default Landing;