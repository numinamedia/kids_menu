export const profiles = [
  { id: 'finley', name: 'Finley', avatar: '/finley_avatar.png', color: '#1cb0f6' },
  { id: 'avery', name: 'Avery', avatar: '/avery_avatar.png', color: '#ff4b4b' },
];

export const menuCategories = [
  {
    id: 'mains',
    title: 'Main Dishes 🍱',
    items: [
      { id: 'm1', name: 'Noodles', icon: '🍜', bgColor: '#fab1a0' },
      { id: 'm2', name: 'Spaghetti', icon: '🍝', bgColor: '#ffeaa7' },
      { id: 'm3', name: 'Sushi', icon: '🍣', bgColor: '#55efc4' },
      { id: 'm4', name: 'Chicken Satay Skewers', icon: '🍢', bgColor: '#ffeaa7' },
      { id: 'm5', name: 'Bulgogi Beef', icon: '🥩', bgColor: '#a29bfe' },
      { id: 'm6', name: 'Onigiri', icon: '🍙', bgColor: '#fd79a8' },
      { id: 'm7', name: 'Onigirazu', icon: '🥪', bgColor: '#00cec9' },
      { id: 'm8', name: 'Dumplings', icon: '🥟', bgColor: '#e17055' },
    ],
  },
  {
    id: 'sides',
    title: 'Sides 🥦',
    items: [
      { id: 's1', name: 'Salad', icon: '🥗', bgColor: '#55efc4' },
      { id: 's2', name: 'Hashbrown', icon: '🥔', bgColor: '#ffeaa7' },
      { id: 's3', name: 'Edamame', icon: '🫛', bgColor: '#00b894' },
      { id: 's4', name: 'Broccoli', icon: '🥦', bgColor: '#55efc4' },
      { id: 's5', name: 'Cucumber Salad', icon: '🥒', bgColor: '#00cec9' },
      { id: 's6', name: 'Roasted Sweet Potato Coins', icon: '🍠', bgColor: '#fdcb6e' },
      { id: 's7', name: 'Dragon Eggs', icon: '🥚', bgColor: '#fab1a0' },
      { id: 's8', name: 'Tamagoyaki', icon: '🍳', bgColor: '#ffeaa7' },
      { id: 's9', name: 'Seaweed Salad', icon: '🌿', bgColor: '#00b894' },
    ],
  },
  {
    id: 'desserts',
    title: 'Desserts 🍦',
    items: [
      { id: 'ds1', name: 'Ice Cream', icon: '🍨', bgColor: '#fd79a8' },
      { id: 'ds2', name: 'Cake', icon: '🍰', bgColor: '#fab1a0' },
      { id: 'ds3', name: 'Frozen Mango', icon: '🥭', bgColor: '#ffeaa7' },
    ],
  },
  {
    id: 'snacks',
    title: 'Snacks 🍿',
    items: [
      { id: 'sn1', name: 'Popcorn', icon: '🍿', bgColor: '#ffeaa7' },
      { id: 'sn2', name: 'Pepper and Cheese', icon: '🧀', bgColor: '#fdcb6e' },
    ],
  },
  {
    id: 'drinks',
    title: 'Drinks 💧',
    items: [
      { id: 'd1', name: 'Milk', icon: '🥛', bgColor: '#dfe6e9' },
      { id: 'd2', name: 'Water', icon: '💧', bgColor: '#74b9ff' },
      { id: 'd3', name: 'Sparkling Water', icon: '🫧', bgColor: '#a29bfe' },
    ],
  },
];

export const orderNotes = [];

// Map category ID to display order for parent dashboard
export const categoryOrder = ['mains', 'sides', 'desserts', 'snacks', 'drinks'];