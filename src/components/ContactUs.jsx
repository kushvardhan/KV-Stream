import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ContactUs = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const contactEmail = 'kushvardhan39797@gmail.com';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name && email && message) {
      toast.success('Message sent successfully!', {
        position: toast.POSITION.BOTTOM_CENTER,
        autoClose: 3000,
        theme: 'colored',
      });
      setName('');
      setEmail('');
      setMessage('');
    } else {
      toast.error('Please fill in all fields!', {
        position: toast.POSITION.BOTTOM_CENTER,
        autoClose: 3000,
        theme: 'colored',
      });
    }
  };

  return (
    <motion.div
      className="w-full h-screen bg-[#1F1E24] flex flex-col items-center justify-center px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5, ease: 'easeInOut' }}
    >
      <motion.h1
        className="text-3xl sm:text-4xl text-center mt-6 text-zinc-300 font-black select-none mb-6 tracking-wide"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, type: 'spring', stiffness: 100 }}
      >
        Contact Us
      </motion.h1>

      <motion.div
        className="max-w-md w-full bg-[#2c2c2c] p-4 sm:p-6 rounded-2xl shadow-xl"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.3 }}
      >
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="text-lg text-gray-400 select-none" htmlFor="name">
              Name
            </label>
            <motion.input
              type="text"
              id="name"
              className="w-full p-3 mt-1 bg-[#3a3a3a] border-none outline-none rounded-lg text-white placeholder-gray-500"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              whileFocus={{ scale: 1.05, backgroundColor: '#4a4a4a', transition: { duration: 0.3 } }}
            />
          </div>

          <div className="mb-4">
            <label className="text-lg text-gray-400 select-none" htmlFor="email">
              Email
            </label>
            <motion.input
              type="email"
              id="email"
              className="w-full p-3 mt-1 bg-[#3a3a3a] border-none outline-none rounded-lg text-white placeholder-gray-500"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              whileFocus={{ scale: 1.05, backgroundColor: '#4a4a4a', transition: { duration: 0.3 } }}
            />
          </div>

          <div className="mb-4">
            <label className="text-lg text-gray-400 select-none" htmlFor="message">
              Message
            </label>
            <motion.textarea
              id="message"
              className="w-full p-3 mt-1 bg-[#3a3a3a] border-none outline-none rounded-lg text-white placeholder-gray-500"
              rows="4"
              placeholder="Enter your message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              whileFocus={{ scale: 1.05, backgroundColor: '#4a4a4a', transition: { duration: 0.3 } }}
            ></motion.textarea>
          </div>

          <motion.button
            type="submit"
            className="w-full py-3 bg-green-500 hover:bg-green-600 select-none text-white rounded-lg text-xl transition-all duration-300"
            whileHover={{ scale: 1.05, boxShadow: '0px 3px 10px rgba(0, 255, 0, 0.3)' }}
            whileTap={{ scale: 0.95 }}
          >
            Send Message
          </motion.button>
        </form>

        <motion.div
          className="mt-6 text-center text-gray-400 text-sm"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.5 }}
        >
          <p className="text-zinc-500 select-none">For immediate assistance, email us at:</p>
          <p className="text-sm font-bold text-green-700">{contactEmail}</p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default ContactUs;
