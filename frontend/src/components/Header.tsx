import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Header = () => {
  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-0 w-full z-50 backdrop-blur-md border-b border-gray-300 shadow-sm"
      style={{ backgroundColor: "rgba(255, 255, 255, 0.75)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Site Name */}
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <img
                src="/src/assets/logo.png"
                alt="Xlense Analytics Logo"
                className="w-8 h-8 object-contain"
              />
              <span className="text-xl font-bold text-black">
                Xlense Analytics
              </span>
            </div>

            {/* Desktop Nav Links with Proper Anchors */}
            <nav className="hidden md:flex space-x-6">
              <a
                href="#about"
                className="font-medium text-gray-600 hover:text-black transition-colors duration-300"
              >
                About Us
              </a>
              <a
                href="#contact"
                className="font-medium text-gray-600 hover:text-black transition-colors duration-300"
              >
                Contact Us
              </a>
              <a
                href="#features"
                className="font-medium text-gray-600 hover:text-black transition-colors duration-300"
              >
                Features
              </a>
            </nav>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            <Link to="/Login">
              <Button
                variant="ghost"
                className="text-gray-600 hover:text-black transition-colors duration-300"
              >
                Login
              </Button>
            </Link>

            <Link to="/Signup">
              <Button
                className="text-white transition-opacity duration-300"
                style={{ backgroundColor: "#1E1E1E" }}
              >
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;

