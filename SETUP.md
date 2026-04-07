# Kids Menu App - Supabase Setup Guide

## Overview

This guide will walk you through setting up Supabase as the backend for your Kids Menu app. Once configured, you'll be able to:
- **View orders in real-time** on the Parent Dashboard
- **Manage menu items** (add, edit, remove, toggle availability)
- **Track order status** from pending → preparing → ready → completed

---

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up
2. Click **"New Project"**
3. Choose your organization (or create one)
4. Fill in:
   - **Project name**: `kids-menu`
   - **Database password**: Generate a strong password (save it securely)
   - **Region**: Choose the closest to you (e.g., `West US (North California)` for Alberta)
5. Click **"Create new project"** and wait ~2 minutes for setup

---

## Step 2: Get Your API Credentials

1. In your Supabase dashboard, go to **Settings** (gear icon) → **API**
2. Copy these two values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **`anon` / `public` key** (a long string)

---

## Step 3: Configure the App

1. Create a `.env` file in the project root (copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and paste your credentials:
   ```
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

---

## Step 4: Create Database Tables

Go to **SQL Editor** in Supabase and run each of these SQL commands:

### Table 1: Orders

```sql
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  kid_name TEXT NOT NULL,
  items JSONB NOT NULL,
  notes TEXT DEFAULT '',
  status TEXT DEFAULT 'pending',
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable real-time subscriptions
ALTER PUBLICATION supabase_realtime ADD TABLE orders;

-- Create index for faster queries
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at DESC);
```

### Table 2: Menu Items

```sql
CREATE TABLE menu_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL,
  name TEXT NOT NULL,
  icon TEXT DEFAULT '🍽️',
  bg_color TEXT DEFAULT '#ffeaa7',
  is_available BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable real-time subscriptions
ALTER PUBLICATION supabase_realtime ADD TABLE menu_items;

-- Create index for faster queries
CREATE INDEX idx_menu_items_category ON menu_items(category, sort_order);
```

---

## Step 5: Seed Menu Data (Optional)

If you want to pre-populate your menu in Supabase, run this:

```sql
INSERT INTO menu_items (category, name, icon, bg_color, sort_order) VALUES
-- Mains
('mains', 'Noodles', '🍜', '#fab1a0', 1),
('mains', 'Spaghetti', '🍝', '#ffeaa7', 2),
('mains', 'Sushi', '🍣', '#55efc4', 3),
('mains', 'Chicken Satay Skewers', '🍢', '#ffeaa7', 4),
('mains', 'Bulgogi Beef', '🥩', '#a29bfe', 5),
('mains', 'Onigiri', '🍙', '#fd79a8', 6),
('mains', 'Onigirazu', '🥪', '#00cec9', 7),
('mains', 'Dumplings', '🥟', '#e17055', 8),
-- Sides
('sides', 'Salad', '🥗', '#55efc4', 1),
('sides', 'Hashbrown', '🥔', '#ffeaa7', 2),
('sides', 'Edamame', '🫛', '#00b894', 3),
('sides', 'Broccoli', '🥦', '#55efc4', 4),
('sides', 'Cucumber Salad', '🥒', '#00cec9', 5),
('sides', 'Roasted Sweet Potato Coins', '🍠', '#fdcb6e', 6),
('sides', 'Dragon Eggs', '🥚', '#fab1a0', 7),
('sides', 'Tamagoyaki', '🍳', '#ffeaa7', 8),
('sides', 'Seaweed Salad', '🌿', '#00b894', 9),
-- Desserts
('desserts', 'Ice Cream', '🍨', '#fd79a8', 1),
('desserts', 'Cake', '🍰', '#fab1a0', 2),
('desserts', 'Frozen Mango', '🥭', '#ffeaa7', 3),
-- Snacks
('snacks', 'Popcorn', '🍿', '#ffeaa7', 1),
('snacks', 'Pepper and Cheese', '🧀', '#fdcb6e', 2),
-- Drinks
('drinks', 'Milk', '🥛', '#dfe6e9', 1),
('drinks', 'Water', '💧', '#74b9ff', 2),
('drinks', 'Sparkling Water', '🫧', '#a29bfe', 3);
```

---

## Step 6: Test the App

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open the app and place a test order
3. Click **🔒 Parent Dashboard** on the profile screen
4. Enter PIN: **1234**
5. You should see the order in the queue!

---

## PIN Code

The default PIN is **1234**. To change it, edit `src/components/ParentDashboard/PINDialog.jsx`:
```javascript
const CORRECT_PIN = '1234'; // Change this
```

---

## How It Works

### Without Supabase (Fallback)
- Orders are sent to Google Sheets via the existing webhook
- Menu is loaded from `src/data/menuData.js`
- Parent Dashboard shows a setup notice

### With Supabase Configured
- Orders are saved to Supabase in real-time
- Menu can be managed from the Parent Dashboard
- Orders update live without page refresh

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "Supabase credentials not configured" | Check `.env` file exists and has correct values |
| No orders showing | Verify `orders` table exists in Supabase |
| Menu not loading from Supabase | Check `menu_items` table and `is_available` column |
| CORS errors | Make sure your Supabase project has API access enabled |