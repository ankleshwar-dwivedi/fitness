import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "../components/ui/Button";
import { BarChart, Dumbbell, UtensilsCrossed, CheckCircle } from "lucide-react";
import Navbar from "../components/layout/Navbar"; // Import Navbar for guest view

const FeatureCard = ({ icon, title, description, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className="bg-white p-6 rounded-xl shadow-lg text-center"
  >
    <div className="inline-block p-4 bg-secondary/20 text-secondary rounded-full mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-primary mb-2">{title}</h3>
    <p className="text-muted">{description}</p>
  </motion.div>
);

const Landing = () => {
  return (
    <>
      <Navbar />
      <div className="">
        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center text-center bg-cover bg-center relative overflow-hidden">
          {/* Polymorph Blob Background */}
          <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
            {/* Gradient Blobs */}
            <div
              className="blob-animated blob-gradient delay-1 top-0 left-0"
              style={{
                background:
                  "radial-gradient(circle at 30% 30%, #00b8ff, #050443)",
              }}
            ></div>

            <div
              className="blob-animated blob-gradient delay-2 top-1/2 left-1/3"
              style={{
                background:
                  "radial-gradient(circle at 40% 60%, #00ffff, #00b8ff)",
              }}
            ></div>

            <div
              className="blob-animated blob-gradient delay-3 top-1/3 right-0"
              style={{
                background:
                  "radial-gradient(circle at 60% 40%, #ff8ae2, #00b8ff)",
              }}
            ></div>

            {/* Solid Color Blobs */}
            <div className="blob-animated blob-solid delay-4 bottom-1/4 left-1/5 bg-[#ffb347]"></div>
            <div className="blob-animated blob-solid delay-5 top-1/5 right-1/3 bg-[#98f5e1]"></div>
            <div className="blob-animated blob-solid delay-2 top-2/3 right-1/4 bg-[#a0f]"></div>
            <div className="blob-animated blob-solid delay-3 bottom-0 right-1/3 bg-[#00ffaa]"></div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="z-10 p-4"
          >
            <h1 className="text-5xl md:text-7xl font-extrabold text-primary leading-tight">
              Your Ultimate <br /> Fitness{" "}
              <span className="text-secondary">Companion</span>
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted">
              Track meals, plan workouts, and achieve your health goals with a
              personalized, data-driven approach. Your journey to a better you
              starts now.
            </p>
            <Link to="/login" className="mt-8 inline-block">
              <Button size="lg">Start Your Journey Today</Button>
            </Link>
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center text-primar] mb-12">
              Everything You Need to Succeed
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard
                icon={<UtensilsCrossed size={32} />}
                title="Smart Meal Logging"
                description="Effortlessly track your calories and macros with our intelligent food logging system."
                delay={0.2}
              />
              <FeatureCard
                icon={<Dumbbell size={32} />}
                title="Personalized Workouts"
                description="Get workout plans tailored to your goals and see how many calories you burn."
                delay={0.4}
              />
              <FeatureCard
                icon={<BarChart size={32} />}
                title="Visual Progress"
                description="Stay motivated with beautiful charts that visualize your progress over time."
                delay={0.6}
              />
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Landing;
