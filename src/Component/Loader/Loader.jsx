import React from "react";
import { motion } from "framer-motion";

const Loader = () => {
  return (
    <div className="flex justify-center items-center h-64">
      <div className="relative w-16 h-16">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute inset-0 border-2 border-blue-500 rounded-full"
            animate={{
              scale: [0, 2, 2],
              opacity: [1, 0.8, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.5,
              ease: "easeOut",
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Loader;
