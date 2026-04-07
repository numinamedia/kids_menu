import { motion } from 'framer-motion';

export default function SuccessModalV2() {
  return (
    <motion.div
      className="v2-success-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Confetti particles */}
      <div className="v2-confetti-container">
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            className="v2-confetti"
            style={{
              left: `${Math.random() * 100}%`,
              backgroundColor: ['#6C5CE7', '#00CEC9', '#FD79A8', '#FDCB6E', '#00B894'][i % 5],
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

      {/* Success content */}
      <motion.div
        className="v2-success-content"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
      >
        <motion.div
          className="v2-success-emoji"
          animate={{
            y: [0, -20, 0],
            rotate: [0, 10, -10, 0],
          }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          🎉
        </motion.div>
        
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Yum! Order Sent!
        </motion.h1>
        
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Your food is on the way! 🍕
        </motion.p>

        {/* Countdown ring */}
        <motion.div
          className="v2-countdown-ring"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.6, type: 'spring' }}
        >
          <svg viewBox="0 0 100 100">
            <motion.circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="8"
            />
            <motion.circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#00B894"
              strokeWidth="8"
              strokeLinecap="round"
              initial={{ pathLength: 1 }}
              animate={{ pathLength: 0 }}
              transition={{ duration: 3, ease: 'linear' }}
              style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
            />
          </svg>
          <span className="v2-countdown-text">3</span>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}