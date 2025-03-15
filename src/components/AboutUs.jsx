import React from 'react';
import { motion } from 'framer-motion';

const AboutUs = () => {
  return (
    <motion.div
      className="w-full h-screen bg-gradient-to-b from-[#1F1E24] to-[#2c2c2c] flex flex-col items-center justify-center px-6 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5, ease: 'easeInOut' }}
    >
      <motion.h1
        className="text-5xl text-center text-zinc-300 font-black select-none mb-6 tracking-wide"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, type: 'spring', stiffness: 100 }}
      >
        About Us
      </motion.h1>

      <motion.div
        className="max-w-4xl w-full bg-[#2c2c2c] p-6 rounded-2xl shadow-xl relative overflow-hidden"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.3 }}
      >
        <motion.div
          className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-t from-green-500 via-transparent to-transparent"
          initial={{ y: 150, opacity: 0 }}
          animate={{
            y: -window.innerHeight,
            opacity: 0.3,
            transition: { duration: 4, ease: 'easeOut' },
          }}
          exit={{
            opacity: 0,
            y: -window.innerHeight,
            transition: { duration: 4 },
          }}
        ></motion.div>

        <motion.p
          className="text-lg text-gray-300 leading-relaxed mb-6 text-shadow"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          Welcome to{" "}
          <span className="text-green-500 font-semibold select-none">KV Stream</span> — your
          ultimate destination for endless entertainment! We’re an innovative
          streaming platform that brings the best movies, shows, and exclusive
          content right to your screen.
        </motion.p>

        <motion.p
          className="text-lg text-gray-300 leading-relaxed mb-6 text-shadow"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          Whether you’re into the latest blockbusters, timeless classics, or
          original series,{" "}
          <span className="text-green-500 font-semibold select-none">KV Stream</span> has
          something for everyone. Our mission is to provide an unparalleled
          streaming experience with a wide selection of content, seamless
          streaming quality, and a user-friendly interface.
        </motion.p>

        <motion.p
          className="text-lg text-gray-300 leading-relaxed mb-6 text-shadow"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 1.1 }}
        >
          At <span className="text-green-500 font-semibold select-none">KV Stream</span>,
          we’re committed to delivering entertainment that fits into your
          lifestyle. Whether you’re watching on your couch, on the go, or with
          friends, our platform ensures that you have access to your favorite
          titles anytime, anywhere.
        </motion.p>

        <motion.p
          className="text-lg text-gray-300 leading-relaxed mb-6 text-shadow"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 1.4 }}
        >
          Join us today and dive into the world of unlimited movies, TV shows,
          and exclusive content. It's time to start streaming your favorites and
          discover new ones with{" "}
          <span className="text-green-500 font-semibold select-none">KV Stream</span>.
        </motion.p>

        <motion.p
          className="text-lg text-gray-300 leading-relaxed text-shadow"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 1.7 }}
        >
          Thank you for choosing us as your go-to streaming service. We're
          excited to have you on this journey with us! 
        </motion.p>

        <motion.div 
          className="w-full p-3 flex mt-3 justify-center items-center gap-2 bg-[#1f1f1f] rounded-xl shadow-lg"
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.5, delay: 2, ease: "easeOut" }}
          whileHover={{ scale: 1.02, transition: { duration: 0.5 } }}
        >
          <h1 className="text-sm inline-block text-red-800 font-semibold select-none">Contact us:</h1>
          <span className="text-sm text-bold text-green-700">kushvardhan39797@gmail.com</span>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default AboutUs;
