import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const NotFound = () => {
  const navigate = useNavigate();
  console.log('not found loaded');
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black text-white relative overflow-hidden">
      <motion.h1 
        initial={{ opacity: 0, y: -50 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-7xl font-bold text-gray-300 relative"
      >
        4<span className="text-red-500 glitch">0</span>4
      </motion.h1>

      <motion.p 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.5, duration: 0.8 }}
        className="text-lg text-zinc-400 mt-2"
      >
        Oops! The page you are looking for doesn't exist.
      </motion.p>

      <motion.button 
       onClick={() => navigate(-1)} 
       whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.1)" }}
       whileTap={{ scale: 0.95 }}
       className="mt-6 px-6 py-2 rounded-lg bg-zinc-800 text-white font-medium transition-all duration-300 hover:bg-zinc-700"
      >
        Go Back
    </motion.button>

      <div className="absolute w-32 h-32 bg-red-500 opacity-20 rounded-full blur-3xl top-20 left-10 animate-pulse"></div>
      <div className="absolute w-32 h-32 bg-blue-500 opacity-20 rounded-full blur-3xl bottom-20 right-10 animate-pulse"></div>
    </div>
  );
};

export default NotFound;  