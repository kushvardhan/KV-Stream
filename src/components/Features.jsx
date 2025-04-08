import React from "react";
import { useNavigate } from "react-router-dom";
import SideNav from "./templates/SideNav";
import TopNav from "./templates/TopNav";
import { motion } from "framer-motion";

const Features = () => {
  const navigate = useNavigate();
  document.title = "KV | Features";

  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  // Function to handle sidebar state changes
  const handleSidebarToggle = (isOpen) => {
    setSidebarOpen(isOpen);
  };

  const features = [
    {
      title: "Improved Search",
      description: "Our enhanced search algorithm now delivers more accurate and relevant results. We've implemented advanced filtering options that allow you to narrow down your search by genre, release year, rating, and more. The search suggestions appear instantly as you type, helping you find your favorite movies and TV shows faster than ever.",
      icon: "ri-search-line",
      color: "bg-blue-500"
    },
    {
      title: "Personalized Recommendations",
      description: "Our new recommendation engine analyzes your viewing history and preferences to suggest content you'll love. The more you use KV Stream, the better our recommendations become. Discover new movies and shows tailored specifically to your taste, and explore content you might have missed otherwise.",
      icon: "ri-heart-line",
      color: "bg-red-500"
    },
    {
      title: "Watch Parties",
      description: "Now you can enjoy movies and TV shows together with friends, no matter where they are. Create a watch party, invite your friends, and stream content in perfect sync. Chat with your friends while watching, react to scenes in real-time, and share the experience as if you were all in the same room.",
      icon: "ri-group-line",
      color: "bg-green-500"
    },
    {
      title: "Enhanced Mobile Experience",
      description: "We've completely redesigned our mobile interface to provide a seamless viewing experience on all devices. The responsive design adapts to any screen size, from smartphones to tablets. Download content for offline viewing, continue watching across devices, and enjoy the same high-quality experience wherever you go.",
      icon: "ri-smartphone-line",
      color: "bg-purple-500"
    },
    {
      title: "Advanced Subtitles",
      description: "Our new subtitle system supports over 50 languages with customizable appearance. Adjust the font size, color, and position to suit your preferences. We've also added support for closed captions and audio descriptions to make content more accessible for everyone.",
      icon: "ri-subtitle",
      color: "bg-yellow-500"
    },
    {
      title: "High-Quality Streaming",
      description: "We've upgraded our streaming infrastructure to provide higher quality video with less buffering. Enjoy content in up to 4K resolution with HDR support on compatible devices. Our adaptive streaming technology automatically adjusts the quality based on your internet connection to ensure a smooth viewing experience.",
      icon: "ri-hd-line",
      color: "bg-indigo-500"
    }
  ];

  return (
    <div className="w-full h-full flex flex-col md:flex-row">
      <SideNav onToggle={handleSidebarToggle} />
      <div
        className={`w-full md:w-[80%] lg:w-[82%] xl:w-[85%] h-full overflow-x-hidden overflow-auto pt-14 md:pt-0 transition-all duration-300 ${
          sidebarOpen ? "filter brightness-[0.85]" : ""
        }`}
      >
        <TopNav />

        <div className="p-4 sm:p-6">
          <div className="flex items-center mb-6">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-zinc-400 hover:text-white transition-colors bg-[#2c2c2c] p-2 rounded-md mr-4"
            >
              <i className="ri-arrow-left-line text-lg"></i>
            </button>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
              New Features
            </h1>
          </div>

          <p className="text-zinc-300 text-sm sm:text-base md:text-lg mb-8 max-w-3xl">
            We're constantly working to improve your experience on KV Stream. Here are some of our latest features and improvements that we've added to make your streaming experience even better.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-[#2c2c2c] rounded-lg overflow-hidden shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <div className={`${feature.color} p-4 flex items-center`}>
                  <i className={`${feature.icon} text-2xl sm:text-3xl text-white mr-3`}></i>
                  <h2 className="text-xl sm:text-2xl font-bold text-white">{feature.title}</h2>
                </div>
                <div className="p-4">
                  <p className="text-zinc-300 text-sm sm:text-base">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-10 mb-8 bg-[#6556CD] rounded-lg p-6 text-white">
            <h2 className="text-xl sm:text-2xl font-bold mb-4">Coming Soon</h2>
            <p className="text-sm sm:text-base mb-4">
              We're working on even more exciting features that will be available soon:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-sm sm:text-base">
              <li>Download content for offline viewing</li>
              <li>Family profiles with parental controls</li>
              <li>Integration with smart home devices</li>
              <li>Virtual reality viewing experience</li>
              <li>Enhanced recommendation system with AI</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;
