import { motion } from 'framer-motion';
import { profiles } from '../../data/menuData';

export default function ProfileGatewayV3({ onSelectKid }) {
  return (
    <div className="v3-gateway">
      <motion.h1
        className="v3-gateway-title"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 200 }}
      >
        Who's Ordering?
      </motion.h1>

      <div className="v3-profiles-grid">
        {profiles.map((profile, index) => (
          <motion.div
            key={profile.id}
            className="v3-profile-card"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: 0.2 + index * 0.15,
              type: 'spring',
              stiffness: 300,
              damping: 20,
            }}
          >
            <motion.button
              className="v3-avatar-btn"
              style={{ background: profile.color }}
              onClick={() => onSelectKid(profile)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <img
                src={profile.avatar}
                alt={profile.name}
                className="v3-avatar-img"
              />
            </motion.button>
            <motion.span
              className="v3-profile-name"
              whileHover={{ scale: 1.1 }}
            >
              {profile.name}
            </motion.span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}