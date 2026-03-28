import React from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { Link } from "react-router-dom";
import bgVideo from "@/assets/bar-chart.mp4";
import { motion } from "framer-motion";

const Hero = () => {
  return (
    <section className="relative w-full h-screen overflow-hidden bg-black">
      {/* Animated Background Video */}
      <motion.video
        src={bgVideo}
        autoPlay
        muted
        loop
        playsInline
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
        className="absolute right-5 bottom-0 w-[400px] h-[300px] sm:w-[500px] sm:h-[400px] md:w-[600px] md:h-[500px] lg:w-[700px] lg:h-[600px] object-cover mt-16 sm:mt-24 lg:-ml-10"
      />

      {/* Content */}
      <div className="relative z-10 flex h-full items-center px-4 sm:px-8 md:px-12 lg:px-20 mt-[-90px] sm:mt-0">
        <div className="max-w-2xl space-y-6 text-white">
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-snug"
          >
            Transform Your <br />
            <span className="text-[#9C4EFF]">Excel Data</span> Into Stunning
            Charts
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1 }}
            className="text-base sm:text-lg text-gray-300 leading-relaxed"
          >
            Upload your Excel sheets and generate beautiful 2D & 3D
            <br className="hidden sm:block" />
            visualizations instantly.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.7 }}
          >
            <Button
              size="lg"
              className="bg-[#9C4EFF] hover:bg-[#883ee2] px-6 py-3 sm:px-8 sm:py-4 
             transform transition-transform duration-300 ease-in-out 
             hover:scale-105 hover:shadow-xl"
            >
              <Upload className="w-5 h-5 mr-3" />
              <Link to="/Login">Get Started Free</Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
