export default function MealCard({ item, categoryId, isSelected, onSelect }) {
  return (
    <button
      className={`meal-card ${isSelected ? 'selected' : ''}`}
      onClick={() => onSelect(categoryId, item)}
    >
      <div className="meal-image-placeholder" style={{ backgroundColor: item.bgColor }}>
        <span className="meal-icon">{item.icon}</span>
      </div>
      <h3 className="meal-name">{item.name}</h3>
    </button>
  );
}
