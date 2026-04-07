import { motion } from 'framer-motion';
import { profiles } from '../../data/menuData';

// Floating food emojis for background decoration
const floatingEmojis = ['🍕', '🍔', '', '🌮', '🍦', '🍪', '', ''];

export default function ProfileGatewayV2({ onSelectKid }) {
  return (
    <div className="v2-gateway">
      {/* Animated background */}
      <div className="v2-bg-gradient" />
      
      {/* Floating food emojis */}
      <div className="v2-floating-emojis">
        {floatingEmojis.map((emoji, i) => (
          <motion.span
            key={i}
            className="v2-floating-emoji"
            style={{
              left: `${10 + (i * 12)}%`,
              animationDelay: `${i * 0.5}s`,
            }}
            animate={{
              y: [0, -30, 0],
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: i * 0.3,
              ease: 'easeInOut',
            }}
          >
            {emoji}
          </motion.span>
        ))}
      </div>

      {/* Main content */}
      <motion.div
        className="v2-gateway-content"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <motion.h1
          className="v2-gateway-title"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        >
          Who's Hungry? 🤔
        </motion.h1>

        <div className="v2-profiles-grid">
          {profiles.map((profile, index) => (
            <motion.div
              key={profile.id}
              className="v2-profile-card"
              initial={{ opacity: 0, scale: 0.5, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{
                delay: 0.3 + index * 0.15,
                type: 'spring',
                stiffness: 200,
                damping: 15,
              }}
              whileHover={{ scale: 1.05, y: -10 }}
              whileTap={{ scale: 0.95 }}
            >
              <button
                className="v2-avatar-btn"
                style={{ background: profile.color }}
                onClick={() => onSelectKid(profile)}
              >
                <motion.div
                  className="v2-avatar-ring"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                />
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="v2-avatar-img"
                />
              </button>
              
              <motion.div
                className="v2-profile-name"
                whileHover={{ scale: 1.1 }}
              >
                {profile.name}
              </motion.div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}