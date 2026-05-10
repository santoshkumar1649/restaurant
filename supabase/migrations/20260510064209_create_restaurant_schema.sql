/*
  # Restaurant App Schema

  1. New Tables
    - `tables` — restaurant tables with QR codes
      - `id` (uuid, PK), `number` (int, unique), `name` (text), `qr_code` (text), `capacity` (int), `status` (text default 'available'), `created_at` (timestamptz)
    - `categories` — menu categories (Starters, Mains, etc.)
      - `id` (uuid, PK), `name` (text), `icon` (text), `sort_order` (int), `created_at` (timestamptz)
    - `dishes` — full menu items
      - `id` (uuid, PK), `name` (text), `description` (text), `price` (numeric), `image_url` (text), `category_id` (uuid FK), `spice_level` (int default 1), `is_veg` (boolean default true), `is_featured` (boolean default false), `is_chef_pick` (boolean default false), `ingredients` (text[]), `pairing_suggestion` (text), `mood_tags` (text[]), `created_at` (timestamptz)
    - `orders` — customer orders
      - `id` (uuid, PK), `table_id` (uuid FK), `status` (text default 'placed'), `total` (numeric), `gst` (numeric), `payment_method` (text), `created_at` (timestamptz)
    - `order_items` — items within an order
      - `id` (uuid, PK), `order_id` (uuid FK), `dish_id` (uuid FK), `quantity` (int), `unit_price` (numeric), `status` (text default 'pending'), `created_at` (timestamptz)
    - `rewards` — redeemable rewards
      - `id` (uuid, PK), `title` (text), `description` (text), `xp_required` (int), `category` (text), `is_exclusive` (boolean default false), `image_url` (text), `created_at` (timestamptz)
    - `family_profiles` — family/family group on a table
      - `id` (uuid, PK), `table_id` (uuid FK), `name` (text), `avatar` (text), `member_count` (int default 4), `xp` (int default 0), `tier` (text default 'Gold'), `visits` (int default 0), `favourite_dish_ids` (uuid[]), `taste_tags` (text[]), `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Public read for tables, categories, dishes, rewards (menu browsing)
    - Authenticated access for orders, order_items, family_profiles
*/

-- Tables
CREATE TABLE IF NOT EXISTS tables (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  number int UNIQUE NOT NULL,
  name text NOT NULL,
  qr_code text DEFAULT '',
  capacity int DEFAULT 4,
  status text DEFAULT 'available',
  created_at timestamptz DEFAULT now()
);

-- Categories
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  icon text DEFAULT '',
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Dishes
CREATE TABLE IF NOT EXISTS dishes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text DEFAULT '',
  price numeric NOT NULL DEFAULT 0,
  image_url text DEFAULT '',
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  spice_level int DEFAULT 1,
  is_veg boolean DEFAULT true,
  is_featured boolean DEFAULT false,
  is_chef_pick boolean DEFAULT false,
  ingredients text[] DEFAULT '{}',
  pairing_suggestion text DEFAULT '',
  mood_tags text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Orders
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  table_id uuid REFERENCES tables(id) ON DELETE SET NULL,
  status text DEFAULT 'placed',
  total numeric DEFAULT 0,
  gst numeric DEFAULT 0,
  payment_method text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Order Items
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  dish_id uuid REFERENCES dishes(id) ON DELETE SET NULL,
  quantity int DEFAULT 1,
  unit_price numeric DEFAULT 0,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

-- Rewards
CREATE TABLE IF NOT EXISTS rewards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  xp_required int DEFAULT 0,
  category text DEFAULT '',
  is_exclusive boolean DEFAULT false,
  image_url text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Family Profiles
CREATE TABLE IF NOT EXISTS family_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  table_id uuid REFERENCES tables(id) ON DELETE SET NULL,
  name text NOT NULL,
  avatar text DEFAULT '',
  member_count int DEFAULT 4,
  xp int DEFAULT 0,
  tier text DEFAULT 'Gold',
  visits int DEFAULT 0,
  favourite_dish_ids uuid[] DEFAULT '{}',
  taste_tags text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE dishes ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_profiles ENABLE ROW LEVEL SECURITY;

-- Public read policies (menu browsing, table lookup)
CREATE POLICY "Public read tables" ON tables FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public read categories" ON categories FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public read dishes" ON dishes FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public read rewards" ON rewards FOR SELECT TO anon, authenticated USING (true);

-- Authenticated policies for orders
CREATE POLICY "Authenticated read orders" ON orders FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated insert orders" ON orders FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated update orders" ON orders FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- Authenticated policies for order_items
CREATE POLICY "Authenticated read order_items" ON order_items FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated insert order_items" ON order_items FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated update order_items" ON order_items FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- Authenticated policies for family_profiles
CREATE POLICY "Authenticated read family_profiles" ON family_profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated insert family_profiles" ON family_profiles FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated update family_profiles" ON family_profiles FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- Seed data: Tables
INSERT INTO tables (number, name, qr_code, capacity, status) VALUES
  (1, 'Cozy Corner', 'QR-T1', 2, 'available'),
  (2, 'Window Bliss', 'QR-T2', 4, 'available'),
  (3, 'Garden View', 'QR-T3', 6, 'available'),
  (4, 'Royal Alcove', 'QR-T4', 8, 'available'),
  (5, 'Patio Delight', 'QR-T5', 4, 'available'),
  (6, 'Sunset Deck', 'QR-T6', 2, 'available'),
  (7, 'Family Hearth', 'QR-T7', 6, 'occupied'),
  (8, 'Chef''s Table', 'QR-T8', 10, 'available')
ON CONFLICT (number) DO NOTHING;

-- Seed data: Categories
INSERT INTO categories (name, icon, sort_order) VALUES
  ('Starters', 'Utensils', 1),
  ('Soups', 'Soup', 2),
  ('Mains', 'Beef', 3),
  ('Biryani & Rice', 'Wheat', 4),
  ('Breads', 'Croissant', 5),
  ('Desserts', 'Cake', 6),
  ('Beverages', 'Coffee', 7)
ON CONFLICT DO NOTHING;

-- Seed data: Dishes
INSERT INTO dishes (name, description, price, image_url, category_id, spice_level, is_veg, is_featured, is_chef_pick, ingredients, pairing_suggestion, mood_tags) VALUES
  ('Paneer Tikka', 'Smoky chargrilled cottage cheese with bell peppers', 320, 'https://images.pexels.com/photos/2474658/pexels-photo-2474658.jpeg', (SELECT id FROM categories WHERE name='Starters'), 2, true, true, true, ARRAY['Paneer','Bell Peppers','Spices'], 'Mango Lassi', ARRAY['adventurous','spicy']),
  ('Chicken 65', 'Crispy fried chicken with curry leaves and red chilies', 350, 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg', (SELECT id FROM categories WHERE name='Starters'), 3, false, true, false, ARRAY['Chicken','Curry Leaves','Red Chili'], 'Coke', ARRAY['spicy','adventurous']),
  ('Dal Makhani', 'Creamy slow-cooked black lentils with butter', 280, 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg', (SELECT id FROM categories WHERE name='Mains'), 1, true, false, true, ARRAY['Black Lentils','Butter','Cream'], 'Garlic Naan', ARRAY['cozy','comfort']),
  ('Butter Chicken', 'Tender chicken in rich tomato-butter gravy', 420, 'https://images.pexels.com/photos/461382/pexels-photo-461382.jpeg', (SELECT id FROM categories WHERE name='Mains'), 2, false, true, true, ARRAY['Chicken','Tomato','Butter','Cream'], 'Butter Naan', ARRAY['comfort','cozy']),
  ('Hyderabadi Biryani', 'Fragrant basmati rice layered with spiced mutton', 480, 'https://images.pexels.com/photos/12737656/pexels-photo-12737656.jpeg', (SELECT id FROM categories WHERE name='Biryani & Rice'), 3, false, true, true, ARRAY['Basmati Rice','Mutton','Saffron'], 'Raita', ARRAY['adventurous','spicy']),
  ('Veg Biryani', 'Aromatic rice with garden vegetables and whole spices', 350, 'https://images.pexels.com/photos/1893556/pexels-photo-1893556.jpeg', (SELECT id FROM categories WHERE name='Biryani & Rice'), 2, true, false, false, ARRAY['Basmati Rice','Mixed Vegetables','Spices'], 'Raita', ARRAY['cozy','comfort']),
  ('Tomato Soup', 'Rich roasted tomato soup with fresh basil', 180, 'https://images.pexels.com/photos/5397484/pexels-photo-5397484.jpeg', (SELECT id FROM categories WHERE name='Soups'), 1, true, false, false, ARRAY['Tomato','Basil','Cream'], 'Garlic Bread', ARRAY['cozy','comfort']),
  ('Hot & Sour Soup', 'Tangy soup with mushrooms and bamboo shoots', 200, 'https://images.pexels.com/photos/5397484/pexels-photo-5397484.jpeg', (SELECT id FROM categories WHERE name='Soups'), 2, true, false, false, ARRAY['Mushrooms','Bamboo Shoots','Vinegar'], 'Spring Rolls', ARRAY['spicy','adventurous']),
  ('Garlic Naan', 'Soft leavened bread with garlic and butter', 80, 'https://images.pexels.com/photos/5555164/pexels-photo-5555164.jpeg', (SELECT id FROM categories WHERE name='Breads'), 1, true, false, false, ARRAY['Flour','Garlic','Butter'], 'Dal Makhani', ARRAY['cozy','comfort']),
  ('Butter Naan', 'Classic soft bread brushed with melted butter', 70, 'https://images.pexels.com/photos/5555164/pexels-photo-5555164.jpeg', (SELECT id FROM categories WHERE name='Breads'), 1, true, false, false, ARRAY['Flour','Butter'], 'Butter Chicken', ARRAY['cozy','comfort']),
  ('Gulab Jamun', 'Soft milk dumplings soaked in rose-scented syrup', 160, 'https://images.pexels.com/photos/10955900/pexels-photo-10955900.jpeg', (SELECT id FROM categories WHERE name='Desserts'), 0, true, true, false, ARRAY['Milk Solids','Rose Water','Sugar'], 'Masala Chai', ARRAY['sweet','cozy']),
  ('Rasmalai', 'Delicate paneer dumplings in saffron-cardamom milk', 200, 'https://images.pexels.com/photos/10955900/pexels-photo-10955900.jpeg', (SELECT id FROM categories WHERE name='Desserts'), 0, true, false, true, ARRAY['Paneer','Saffron','Cardamom'], 'None', ARRAY['sweet','romantic']),
  ('Mango Lassi', 'Chilled yogurt drink blended with Alphonso mango', 140, 'https://images.pexels.com/photos/5946631/pexels-photo-5946631.jpeg', (SELECT id FROM categories WHERE name='Beverages'), 0, true, false, false, ARRAY['Yogurt','Mango','Sugar'], 'Paneer Tikka', ARRAY['cozy','sweet']),
  ('Masala Chai', 'Spiced Indian tea with ginger and cardamom', 80, 'https://images.pexels.com/photos/5946631/pexels-photo-5946631.jpeg', (SELECT id FROM categories WHERE name='Beverages'), 1, true, false, false, ARRAY['Tea','Ginger','Cardamom'], 'Gulab Jamun', ARRAY['cozy','comfort']),
  ('Palak Paneer', 'Cottage cheese cubes in creamy spinach gravy', 340, 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg', (SELECT id FROM categories WHERE name='Mains'), 1, true, false, false, ARRAY['Spinach','Paneer','Cream'], 'Jeera Rice', ARRAY['cozy','comfort']),
  ('Fish Curry', 'Coastal-style fish in tangy coconut curry', 450, 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg', (SELECT id FROM categories WHERE name='Mains'), 3, false, false, false, ARRAY['Fish','Coconut','Tamarind'], 'Steamed Rice', ARRAY['adventurous','spicy']),
  ('Tandoori Prawns', 'Jumbo prawns marinated in tandoori spices', 520, 'https://images.pexels.com/photos/461382/pexels-photo-461382.jpeg', (SELECT id FROM categories WHERE name='Starters'), 2, false, false, false, ARRAY['Prawns','Yogurt','Tandoori Masala'], 'Mango Lassi', ARRAY['adventurous','romantic']),
  ('Family Feast Combo', 'Butter Chicken + Dal Makhani + 4 Naan + 2 Raita + 2 Gulab Jamun', 1299, 'https://images.pexels.com/photos/461382/pexels-photo-461382.jpeg', (SELECT id FROM categories WHERE name='Mains'), 1, false, true, false, ARRAY['Chicken','Lentils','Naan','Raita','Gulab Jamun'], 'Family sharing', ARRAY['cozy','comfort','family'])
ON CONFLICT DO NOTHING;

-- Seed data: Rewards
INSERT INTO rewards (title, description, xp_required, category, is_exclusive, image_url) VALUES
  ('Free Appetizer', 'Choose any starter from our menu on the house', 500, 'food', false, 'https://images.pexels.com/photos/2474658/pexels-photo-2474658.jpeg'),
  ('10% Off Bill', 'Flat 10% discount on your entire order', 1000, 'discount', false, 'https://images.pexels.com/photos/461382/pexels-photo-461382.jpeg'),
  ('Free Dessert', 'Indulge in any dessert absolutely free', 750, 'food', false, 'https://images.pexels.com/photos/10955900/pexels-photo-10955900.jpeg'),
  ('Priority Seating', 'Skip the queue with priority table reservation', 1500, 'experience', true, 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg'),
  ('Chef''s Tasting', 'Exclusive 5-course tasting menu curated by our chef', 2500, 'experience', true, 'https://images.pexels.com/photos/12737656/pexels-photo-12737656.jpeg')
ON CONFLICT DO NOTHING;

-- Seed data: Family Profile for Table 7
INSERT INTO family_profiles (table_id, name, avatar, member_count, xp, tier, visits, favourite_dish_ids, taste_tags) VALUES
  ((SELECT id FROM tables WHERE number=7), 'The Sharmas', '👨‍👩‍👧‍👦', 4, 1850, 'Gold', 24, '{}', ARRAY['spicy','comfort','cozy'])
ON CONFLICT DO NOTHING;
