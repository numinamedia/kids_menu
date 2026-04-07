import { profiles } from '../data/menuData';

export default function ProfileGateway({ onSelectKid }) {
  return (
    <div className="gateway-bg">
      <div className="glass-panel">
        <h1 className="who-is-watching">Who's hungry?</h1>
        <div className="profiles-grid">
          {profiles.map(profile => (
            <div key={profile.id} className="profile-wrapper">
              <button
                className="duo-avatar-btn"
                style={{ backgroundColor: profile.color }}
                onClick={() => onSelectKid(profile)}
              >
                <span className="avatar-emoji">
                  <img src={profile.avatar} alt={profile.name} className="custom-avatar" />
                </span>
              </button>
              <h2 className="profile-name">{profile.name}</h2>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
