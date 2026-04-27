
import React from 'react';
import { motion } from 'framer-motion';

function BenefitCard({ icon: Icon, title, description, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      className="glass-card p-8 rounded-2xl premium-shadow hover:premium-shadow-lg transition-all duration-300"
    >
      <div className="flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
          <Icon className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-xl font-bold text-foreground mb-3">
          {title}
        </h3>
        <p className="text-foreground/80 leading-relaxed">
          {description}
        </p>
      </div>
    </motion.div>
  );
}

export default BenefitCard;
