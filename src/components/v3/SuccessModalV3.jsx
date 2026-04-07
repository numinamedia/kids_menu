import { motion } from 'framer-motion';

export default function SuccessModalV3() {
  const confettiColors = ['#58CC02', '#1CB0F6', '#FF4B4B', '#FFC800', '#FF9600'];

  return (
    <motion.div
      className="v3-success-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Confetti */}
      <div className="v3-confetti-container">
        {Array.from({ length: 40 }).map((_, i) => (
          <motion.div
            key={i}
            className="v3-confetti"
            style={{
              left: `${Math.random() * 100}%`,
              backgroundColor: confettiColors[i % confettiColors.length],
            }}
            initial={{ y: -20, rotate: 0, scale: 0 }}
            animate={{
              y: ['0vh', '100vh'],
              rotate: [0, 720],
              scale: [0, 1, 0.5],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              delay: Math.random() * 0.5,
              ease: 'easeOut',
            }}
          />
        ))}
      </div>

      {/* Success Content */}
      <motion.div
        className="v3-success-content"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
      >
        <motion.div
          className="v3-success-icon"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          ✓
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Amazing!
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Your order is on the way! 🍕
        </motion.p>
      </motion.div>
    </motion.div>
  );
}