import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ContactUs = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({
    name: false,
    email: false,
    message: false,
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [submittedName, setSubmittedName] = useState("");
  const contactEmail = "kushvardhan39797@gmail.com";

  useEffect(() => {
    // Add class to body to disable scrolling
    document.body.style.overflow = "hidden";

    // Cleanup function to restore scrolling when component unmounts
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Reset errors
    const newErrors = { name: false, email: false, message: false };
    let hasError = false;

    // Validate each field
    if (!name.trim()) {
      newErrors.name = true;
      hasError = true;
    }

    if (!email.trim()) {
      newErrors.email = true;
      hasError = true;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = true;
      hasError = true;
      toast.error("Please enter a valid email address", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 3000,
        theme: "colored",
      });
    }

    if (!message.trim()) {
      newErrors.message = true;
      hasError = true;
    }

    setErrors(newErrors);

    if (!hasError) {
      // All fields are valid, send the message

      // First, store name for notification
      setSubmittedName(name);

      // Then clear form fields
      setName("");
      setEmail("");
      setMessage("");

      // Then show success animation and notification
      setFormSubmitted(true);
      setShowNotification(true);

      // Hide notification after a delay (longer on mobile)
      const isMobile = window.innerWidth < 640;
      const notificationDuration = isMobile ? 4000 : 3000;

      setTimeout(() => {
        setFormSubmitted(false);
        setShowNotification(false);
      }, notificationDuration);
    } else if (hasError && !newErrors.email) {
      // Show general error if there are missing fields but email format is correct
      // We'll use the form validation UI instead of alerts
    }
  };

  return (
    <>
      {/* DaisyUI Toast Notification */}
      {showNotification && (
        <div className="toast toast-end toast-top custom-toast">
          <div className="alert alert-success bg-green-600 text-white shadow-lg rounded-lg flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current shrink-0 h-6 w-6 mr-2"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <span className="hidden sm:inline font-medium">
                {submittedName}, your message has been sent successfully!
              </span>
              <span className="sm:hidden font-medium">Message sent!</span>
            </div>
          </div>
        </div>
      )}

      <motion.div
        className="w-full min-h-screen bg-[#1F1E24] flex flex-col items-center justify-center px-4 sm:px-6 py-16 sm:py-8 overflow-y-auto contact-page"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      >
        <button
          onClick={() => navigate(-1)}
          className="ri-arrow-left-line text-2xl sm:text-3xl cursor-pointer transition-all hover:text-green-200 absolute top-4 sm:top-6 left-4 sm:left-10 flex items-center justify-center bg-[#2c2c2c] p-2 rounded-full"
        ></button>
        <motion.h1
          className="text-3xl sm:text-4xl text-center mt-6 text-zinc-300 font-black select-none mb-6 tracking-wide"
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, type: "spring", stiffness: 100 }}
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
              <label
                className="text-lg text-gray-400 select-none"
                htmlFor="name"
              >
                Name
              </label>
              <motion.input
                type="text"
                id="name"
                autoComplete="off"
                autoCorrect="off"
                spellCheck="false"
                className={`w-full p-3 mt-1 bg-[#3a3a3a] border-2 ${
                  errors.name ? "border-red-500" : "border-transparent"
                } outline-none rounded-lg text-white placeholder-gray-500 transition-colors duration-300`}
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                whileFocus={{ scale: 1.05, transition: { duration: 0.3 } }}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1 ml-1 animate-pulse">
                  Please enter your name
                </p>
              )}
            </div>

            <div className="mb-4">
              <label
                className="text-lg text-gray-400 select-none"
                htmlFor="email"
              >
                Email
              </label>
              <motion.input
                type="email"
                id="email"
                autoComplete="off"
                autoCorrect="off"
                spellCheck="false"
                className={`w-full p-3 mt-1 bg-[#3a3a3a] border-2 ${
                  errors.email ? "border-red-500" : "border-transparent"
                } outline-none rounded-lg text-white placeholder-gray-500 transition-colors duration-300`}
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                whileFocus={{ scale: 1.05, transition: { duration: 0.3 } }}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1 ml-1 animate-pulse">
                  Please enter a valid email address
                </p>
              )}
            </div>

            <div className="mb-4">
              <label
                className="text-lg text-gray-400 select-none"
                htmlFor="message"
              >
                Message
              </label>
              <motion.textarea
                id="message"
                autoComplete="off"
                autoCorrect="off"
                spellCheck="false"
                className={`w-full p-3 mt-1 bg-[#3a3a3a] border-2 ${
                  errors.message ? "border-red-500" : "border-transparent"
                } outline-none rounded-lg text-white placeholder-gray-500 transition-colors duration-300`}
                rows="4"
                placeholder="Enter your message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                whileFocus={{ scale: 1.05, transition: { duration: 0.3 } }}
              ></motion.textarea>
              {errors.message && (
                <p className="text-red-500 text-sm mt-1 ml-1 animate-pulse">
                  Please enter your message
                </p>
              )}
            </div>

            <motion.button
              type="submit"
              className={`w-full py-3 select-none text-white rounded-lg text-xl transition-all duration-300 ${
                formSubmitted
                  ? "bg-green-600"
                  : "bg-green-500 hover:bg-green-600"
              }`}
              whileHover={{
                scale: formSubmitted ? 1 : 1.05,
                boxShadow: formSubmitted
                  ? "0px 0px 15px rgba(0, 255, 0, 0.5)"
                  : "0px 3px 10px rgba(0, 255, 0, 0.3)",
              }}
              whileTap={{ scale: formSubmitted ? 1 : 0.95 }}
              animate={{
                scale: formSubmitted ? [1, 1.1, 1] : 1,
                backgroundColor: formSubmitted
                  ? ["#22c55e", "#16a34a", "#22c55e"]
                  : "#22c55e",
                transition: { duration: formSubmitted ? 1.5 : 0.3 },
              }}
            >
              {formSubmitted ? "✓ Message Sent!" : "Send Message"}
            </motion.button>
          </form>

          <motion.div
            className="mt-6 text-center text-gray-400 text-sm"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.5 }}
          >
            <p className="text-zinc-500 select-none">
              For immediate assistance, email us at:
            </p>
            <p className="text-sm font-bold text-green-700">{contactEmail}</p>
          </motion.div>
        </motion.div>
      </motion.div>
    </>
  );
};

export default ContactUs;
