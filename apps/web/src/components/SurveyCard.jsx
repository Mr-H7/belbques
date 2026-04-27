
import React from 'react';
import { motion } from 'framer-motion';

function SurveyCard({ children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay }}
      className="glass-card p-8 rounded-2xl premium-shadow mb-8"
    >
      {children}
    </motion.div>
  );
}

export default SurveyCard;
