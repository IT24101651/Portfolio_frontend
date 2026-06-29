import { motion } from 'framer-motion';

const sectionVariants = {
  hidden: { opacity: 0, y: 36 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function AnimatedSection({ children, className = '', id, delay = 0 }) {
  return (
    <motion.section
      id={id}
      className={`section-anchor section-gap transform-gpu ${className}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={sectionVariants}
      transition={{ delay }}
      style={{ willChange: 'transform, opacity' }}
    >
      {children}
    </motion.section>
  );
}
