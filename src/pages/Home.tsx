import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Star, Leaf, ShoppingCart, Sparkles, ChevronRight, Users } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useTable } from '../contexts/TableContext';
import { useCart } from '../contexts/CartContext';

interface Dish {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  spice_level: number;
  is_veg: boolean;
  is_featured: boolean;
  is_chef_pick: boolean;
  ingredients: string[];
  pairing_suggestion: string;
  mood_tags: string[];
  category_id: string;
}

interface Category {
  id: string;
  name: string;
  icon: string;
  sort_order: number;
}

const MOODS = [
  { label: 'Spicy', emoji: '🌶️', color: 'from-red-500 to-orange-500', tag: 'spicy' },
  { label: 'Cozy', emoji: '🛋️', color: 'from-amber-500 to-yellow-500', tag: 'cozy' },
  { label: 'Adventurous', emoji: '🗺️', color: 'from-emerald-500 to-teal-500', tag: 'adventurous' },
  { label: 'Comfort', emoji: '🤗', color: 'from-orange-400 to-amber-400', tag: 'comfort' },
  { label: 'Sweet', emoji: '🍯', color: 'from-pink-400 to-rose-400', tag: 'sweet' },
  { label: 'Romantic', emoji: '🌹', color: 'from-rose-500 to-red-400', tag: 'romantic' },
];

interface MoodSuggestion {
  dish: Dish;
  reason: string;
}

const MOOD_SUGGESTIONS: Record<string, MoodSuggestion[]> = {
  spicy: [
    { dish: { id: 'd1', name: 'Chicken 65', description: 'Crispy fried chicken with curry leaves', price: 350, image_url: 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg', spice_level: 3, is_veg: false, is_featured: true, is_chef_pick: false, ingredients: ['Chicken','Curry Leaves'], pairing_suggestion: 'Coke', mood_tags: ['spicy'], category_id: '' }, reason: 'Fiery and crispy — perfect for spice lovers' },
    { dish: { id: 'd2', name: 'Hyderabadi Biryani', description: 'Fragrant basmati rice with spiced mutton', price: 480, image_url: 'https://images.pexels.com/photos/12737656/pexels-photo-12737656.jpeg', spice_level: 3, is_veg: false, is_featured: true, is_chef_pick: true, ingredients: ['Basmati Rice','Mutton'], pairing_suggestion: 'Raita', mood_tags: ['spicy'], category_id: '' }, reason: 'Rich, layered spices that ignite the palate' },
    { dish: { id: 'd3', name: 'Hot & Sour Soup', description: 'Tangy soup with mushrooms', price: 200, image_url: 'https://images.pexels.com/photos/5397484/pexels-photo-5397484.jpeg', spice_level: 2, is_veg: true, is_featured: false, is_chef_pick: false, ingredients: ['Mushrooms','Vinegar'], pairing_suggestion: 'Spring Rolls', mood_tags: ['spicy'], category_id: '' }, reason: 'Tangy heat to warm you up' },
  ],
  cozy: [
    { dish: { id: 'd4', name: 'Dal Makhani', description: 'Creamy slow-cooked black lentils', price: 280, image_url: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg', spice_level: 1, is_veg: true, is_featured: false, is_chef_pick: true, ingredients: ['Black Lentils','Butter'], pairing_suggestion: 'Garlic Naan', mood_tags: ['cozy'], category_id: '' }, reason: 'Warm, creamy comfort in every bite' },
    { dish: { id: 'd5', name: 'Tomato Soup', description: 'Rich roasted tomato soup with basil', price: 180, image_url: 'https://images.pexels.com/photos/5397484/pexels-photo-5397484.jpeg', spice_level: 1, is_veg: true, is_featured: false, is_chef_pick: false, ingredients: ['Tomato','Basil'], pairing_suggestion: 'Garlic Bread', mood_tags: ['cozy'], category_id: '' }, reason: 'Like a warm blanket for your soul' },
    { dish: { id: 'd6', name: 'Masala Chai', description: 'Spiced Indian tea with ginger', price: 80, image_url: 'https://images.pexels.com/photos/5946631/pexels-photo-5946631.jpeg', spice_level: 1, is_veg: true, is_featured: false, is_chef_pick: false, ingredients: ['Tea','Ginger'], pairing_suggestion: 'Gulab Jamun', mood_tags: ['cozy'], category_id: '' }, reason: 'The ultimate cozy companion' },
  ],
  adventurous: [
    { dish: { id: 'd7', name: 'Fish Curry', description: 'Coastal-style fish in coconut curry', price: 450, image_url: 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg', spice_level: 3, is_veg: false, is_featured: false, is_chef_pick: false, ingredients: ['Fish','Coconut'], pairing_suggestion: 'Steamed Rice', mood_tags: ['adventurous'], category_id: '' }, reason: 'Bold coastal flavors await the brave' },
    { dish: { id: 'd8', name: 'Tandoori Prawns', description: 'Jumbo prawns in tandoori spices', price: 520, image_url: 'https://images.pexels.com/photos/461382/pexels-photo-461382.jpeg', spice_level: 2, is_veg: false, is_featured: false, is_chef_pick: false, ingredients: ['Prawns','Tandoori Masala'], pairing_suggestion: 'Mango Lassi', mood_tags: ['adventurous'], category_id: '' }, reason: 'Exotic tandoor-charred delicacy' },
    { dish: { id: 'd1b', name: 'Paneer Tikka', description: 'Smoky chargrilled cottage cheese', price: 320, image_url: 'https://images.pexels.com/photos/2474658/pexels-photo-2474658.jpeg', spice_level: 2, is_veg: true, is_featured: true, is_chef_pick: true, ingredients: ['Paneer','Bell Peppers'], pairing_suggestion: 'Mango Lassi', mood_tags: ['adventurous'], category_id: '' }, reason: 'Smoky, charred, unforgettable' },
  ],
  comfort: [
    { dish: { id: 'd9', name: 'Butter Chicken', description: 'Tender chicken in tomato-butter gravy', price: 420, image_url: 'https://images.pexels.com/photos/461382/pexels-photo-461382.jpeg', spice_level: 2, is_veg: false, is_featured: true, is_chef_pick: true, ingredients: ['Chicken','Tomato','Butter'], pairing_suggestion: 'Butter Naan', mood_tags: ['comfort'], category_id: '' }, reason: 'The king of comfort food' },
    { dish: { id: 'd10', name: 'Palak Paneer', description: 'Cottage cheese in creamy spinach', price: 340, image_url: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg', spice_level: 1, is_veg: true, is_featured: false, is_chef_pick: false, ingredients: ['Spinach','Paneer'], pairing_suggestion: 'Jeera Rice', mood_tags: ['comfort'], category_id: '' }, reason: 'Nourishing and deeply satisfying' },
    { dish: { id: 'd4b', name: 'Garlic Naan', description: 'Soft leavened bread with garlic', price: 80, image_url: 'https://images.pexels.com/photos/5555164/pexels-photo-5555164.jpeg', spice_level: 1, is_veg: true, is_featured: false, is_chef_pick: false, ingredients: ['Flour','Garlic'], pairing_suggestion: 'Dal Makhani', mood_tags: ['comfort'], category_id: '' }, reason: 'Warm bread, pure comfort' },
  ],
  sweet: [
    { dish: { id: 'd11', name: 'Gulab Jamun', description: 'Milk dumplings in rose syrup', price: 160, image_url: 'https://images.pexels.com/photos/10955900/pexels-photo-10955900.jpeg', spice_level: 0, is_veg: true, is_featured: true, is_chef_pick: false, ingredients: ['Milk Solids','Rose Water'], pairing_suggestion: 'Masala Chai', mood_tags: ['sweet'], category_id: '' }, reason: 'Sweet, syrupy bliss' },
    { dish: { id: 'd12', name: 'Rasmalai', description: 'Paneer dumplings in saffron milk', price: 200, image_url: 'https://images.pexels.com/photos/10955900/pexels-photo-10955900.jpeg', spice_level: 0, is_veg: true, is_featured: false, is_chef_pick: true, ingredients: ['Paneer','Saffron'], pairing_suggestion: 'None', mood_tags: ['sweet'], category_id: '' }, reason: 'Delicate, fragrant, heavenly' },
    { dish: { id: 'd13', name: 'Mango Lassi', description: 'Chilled yogurt with Alphonso mango', price: 140, image_url: 'https://images.pexels.com/photos/5946631/pexels-photo-5946631.jpeg', spice_level: 0, is_veg: true, is_featured: false, is_chef_pick: false, ingredients: ['Yogurt','Mango'], pairing_suggestion: 'Paneer Tikka', mood_tags: ['sweet'], category_id: '' }, reason: 'Sweet mango paradise' },
  ],
  romantic: [
    { dish: { id: 'd8b', name: 'Tandoori Prawns', description: 'Jumbo prawns in tandoori spices', price: 520, image_url: 'https://images.pexels.com/photos/461382/pexels-photo-461382.jpeg', spice_level: 2, is_veg: false, is_featured: false, is_chef_pick: false, ingredients: ['Prawns','Tandoori Masala'], pairing_suggestion: 'Mango Lassi', mood_tags: ['romantic'], category_id: '' }, reason: 'Share an exotic delicacy together' },
    { dish: { id: 'd12b', name: 'Rasmalai', description: 'Paneer dumplings in saffron milk', price: 200, image_url: 'https://images.pexels.com/photos/10955900/pexels-photo-10955900.jpeg', spice_level: 0, is_veg: true, is_featured: false, is_chef_pick: true, ingredients: ['Paneer','Saffron'], pairing_suggestion: 'None', mood_tags: ['romantic'], category_id: '' }, reason: 'Saffron-kissed romance on a plate' },
    { dish: { id: 'd9b', name: 'Butter Chicken', description: 'Tender chicken in tomato-butter gravy', price: 420, image_url: 'https://images.pexels.com/photos/461382/pexels-photo-461382.jpeg', spice_level: 2, is_veg: false, is_featured: true, is_chef_pick: true, ingredients: ['Chicken','Tomato','Butter'], pairing_suggestion: 'Butter Naan', mood_tags: ['romantic'], category_id: '' }, reason: 'Share the iconic, fall in love' },
  ],
};

export default function Home({
  onDishSelect,
  onCartOpen,
  onKitchenOpen,
  onRewardsOpen,
  onProfileOpen,
}: {
  onDishSelect: (dish: Dish) => void;
  onCartOpen: () => void;
  onKitchenOpen: () => void;
  onRewardsOpen: () => void;
  onProfileOpen: () => void;
}) {
  const { familyName, tableNumber } = useTable();
  const { addItem, itemCount } = useCart();
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeMood, setActiveMood] = useState<string | null>(null);
  const [moodSheetOpen, setMoodSheetOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const [catRes, dishRes] = await Promise.all([
        supabase.from('categories').select('*').order('sort_order'),
        supabase.from('dishes').select('*').order('created_at'),
      ]);
      if (catRes.data) setCategories(catRes.data);
      if (dishRes.data) setDishes(dishRes.data as Dish[]);
    };
    fetchData();
  }, []);

  const filteredDishes = selectedCategory
    ? dishes.filter(d => d.category_id === selectedCategory)
    : dishes;

  const chefPick = dishes.find(d => d.is_chef_pick);
  const featuredDishes = dishes.filter(d => d.is_featured);
  const comboDish = dishes.find(d => d.name === 'Family Feast Combo');

  const handleMoodTap = (tag: string) => {
    setActiveMood(tag);
    setMoodSheetOpen(true);
  };

  const handleAddFromMood = (dish: Dish) => {
    addItem({ id: dish.id, name: dish.name, price: dish.price, image_url: dish.image_url, is_veg: dish.is_veg });
  };

  const aiRecommendations = dishes.filter(d => d.is_chef_pick || d.is_featured).slice(0, 3);

  return (
    <div className="min-h-screen bg-[#0f0f0f] pb-24">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-[#0f0f0f]/90 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <p className="text-white/50 text-xs">Welcome back</p>
            <h1 className="text-white font-bold text-lg flex items-center gap-2">
              <Users className="w-4 h-4 text-[#ff6b35]" />
              {familyName || 'Guest'} — Table {tableNumber}
            </h1>
          </div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onCartOpen}
            className="relative p-2 rounded-xl bg-white/5"
          >
            <ShoppingCart className="w-5 h-5 text-white" />
            {itemCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-5 h-5 bg-[#ff6b35] text-white text-xs font-bold rounded-full flex items-center justify-center"
              >
                {itemCount}
              </motion.span>
            )}
          </motion.button>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4">
        {/* Chef's Pick Banner */}
        {chefPick && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => onDishSelect(chefPick)}
            className="mt-4 relative rounded-2xl overflow-hidden cursor-pointer"
          >
            <img src={chefPick.image_url} alt={chefPick.name} className="w-full h-48 object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <div className="flex items-center gap-2 mb-1">
                <Flame className="w-4 h-4 text-[#ff6b35]" />
                <span className="text-[#ff6b35] text-xs font-semibold uppercase tracking-wider">Chef's Pick</span>
              </div>
              <h2 className="text-white font-bold text-xl">{chefPick.name}</h2>
              <p className="text-white/60 text-sm">{chefPick.description}</p>
            </div>
            <div className="absolute top-3 right-3 bg-[#ff6b35] text-white text-sm font-bold px-3 py-1 rounded-full">
              ₹{chefPick.price}
            </div>
          </motion.div>
        )}

        {/* Mood Pills */}
        <div className="mt-6">
          <h3 className="text-white/40 text-xs uppercase tracking-widest mb-3">What's your mood?</h3>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {MOODS.map(mood => (
              <motion.button
                key={mood.tag}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleMoodTap(mood.tag)}
                className={`flex-shrink-0 px-4 py-2 rounded-full bg-gradient-to-r ${mood.color} text-white text-sm font-medium flex items-center gap-1.5 shadow-lg`}
              >
                <span>{mood.emoji}</span>
                {mood.label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Category Filter */}
        <div className="mt-6">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                !selectedCategory ? 'bg-[#ff6b35] text-white' : 'bg-white/5 text-white/60'
              }`}
            >
              All
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === cat.id ? 'bg-[#ff6b35] text-white' : 'bg-white/5 text-white/60'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Dishes */}
        {!selectedCategory && featuredDishes.length > 0 && (
          <div className="mt-6">
            <h3 className="text-white/40 text-xs uppercase tracking-widest mb-3">Featured</h3>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {featuredDishes.map(dish => (
                <motion.div
                  key={dish.id}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onDishSelect(dish)}
                  className="flex-shrink-0 w-40 rounded-xl overflow-hidden bg-white/5 cursor-pointer"
                >
                  <img src={dish.image_url} alt={dish.name} className="w-full h-28 object-cover" />
                  <div className="p-2">
                    <div className="flex items-center gap-1 mb-1">
                      {dish.is_veg && <Leaf className="w-3 h-3 text-emerald-400" />}
                      <span className="text-white text-xs font-medium truncate">{dish.name}</span>
                    </div>
                    <p className="text-[#ff6b35] text-sm font-bold">₹{dish.price}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Full Menu */}
        <div className="mt-6">
          <h3 className="text-white/40 text-xs uppercase tracking-widest mb-3">
            {selectedCategory ? categories.find(c => c.id === selectedCategory)?.name || 'Menu' : 'Full Menu'}
          </h3>
          <div className="space-y-3">
            {filteredDishes.map(dish => (
              <motion.div
                key={dish.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onDishSelect(dish)}
                className="flex gap-3 p-3 rounded-xl bg-white/5 cursor-pointer hover:bg-white/10 transition-colors"
              >
                <img src={dish.image_url} alt={dish.name} className="w-20 h-20 rounded-lg object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    {dish.is_veg ? <Leaf className="w-3.5 h-3.5 text-emerald-400" /> : <span className="w-3.5 h-3.5 rounded-full bg-red-500 inline-block" />}
                    <h4 className="text-white font-semibold text-sm truncate">{dish.name}</h4>
                    {dish.is_chef_pick && <Star className="w-3.5 h-3.5 text-[#ff6b35] flex-shrink-0" />}
                  </div>
                  <p className="text-white/40 text-xs mt-0.5 line-clamp-2">{dish.description}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[#ff6b35] font-bold text-sm">₹{dish.price}</span>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: dish.spice_level }).map((_, i) => (
                        <span key={i} className="text-[8px]">🌶️</span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Family Combo Banner */}
        {comboDish && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => onDishSelect(comboDish)}
            className="mt-6 relative rounded-2xl overflow-hidden cursor-pointer"
          >
            <img src={comboDish.image_url} alt={comboDish.name} className="w-full h-36 object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#ff6b35]/80 to-transparent" />
            <div className="absolute inset-0 p-4 flex flex-col justify-center">
              <span className="text-white/80 text-xs uppercase tracking-wider font-semibold">Family Combo</span>
              <h3 className="text-white font-bold text-xl mt-1">{comboDish.name}</h3>
              <p className="text-white/70 text-sm mt-1">Save ₹200 on family feast</p>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-white font-bold text-lg">₹{comboDish.price}</span>
                <ChevronRight className="w-4 h-4 text-white" />
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#0f0f0f]/95 backdrop-blur-xl border-t border-white/5">
        <div className="max-w-lg mx-auto flex items-center justify-around py-2">
          {[
            { label: 'Home', icon: Flame, active: true },
            { label: 'Kitchen', icon: Flame, active: false, onClick: onKitchenOpen },
            { label: 'Rewards', icon: Star, active: false, onClick: onRewardsOpen },
            { label: 'Profile', icon: Users, active: false, onClick: onProfileOpen },
          ].map(item => (
            <button
              key={item.label}
              onClick={item.onClick}
              className={`flex flex-col items-center gap-0.5 px-4 py-1 ${item.active ? 'text-[#ff6b35]' : 'text-white/40'}`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[10px]">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* AI FAB */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setAiOpen(true)}
        className="fixed bottom-20 right-4 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-[#ff6b35] to-[#ff9f1c] shadow-lg shadow-[#ff6b35]/40 flex items-center justify-center"
        animate={{ boxShadow: ['0 0 20px #ff6b3540', '0 0 40px #ff6b3560', '0 0 20px #ff6b3540'] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <Sparkles className="w-6 h-6 text-white" />
      </motion.button>

      {/* Mood Bottom Sheet */}
      <AnimatePresence>
        {moodSheetOpen && activeMood && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMoodSheetOpen(false)}
              className="fixed inset-0 bg-black/60 z-50"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-[#1a1a1a] rounded-t-3xl max-h-[70vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-4" />
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">{MOODS.find(m => m.tag === activeMood)?.emoji}</span>
                  <h3 className="text-white font-bold text-lg">
                    {MOODS.find(m => m.tag === activeMood)?.label} Picks
                  </h3>
                </div>
                <div className="space-y-3">
                  {(MOOD_SUGGESTIONS[activeMood] || []).map(({ dish, reason }) => (
                    <div key={dish.id} className="flex gap-3 p-3 rounded-xl bg-white/5">
                      <img src={dish.image_url} alt={dish.name} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white font-semibold text-sm">{dish.name}</h4>
                        <p className="text-white/40 text-xs mt-0.5">{reason}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-[#ff6b35] font-bold text-sm">₹{dish.price}</span>
                          <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => { e.stopPropagation(); handleAddFromMood(dish); }}
                            className="px-3 py-1 bg-[#ff6b35] text-white text-xs font-semibold rounded-full"
                          >
                            Add
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* AI Recommendations Sheet */}
      <AnimatePresence>
        {aiOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setAiOpen(false)}
              className="fixed inset-0 bg-black/60 z-50"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-[#1a1a1a] rounded-t-3xl max-h-[70vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-4" />
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-5 h-5 text-[#ff6b35]" />
                  <h3 className="text-white font-bold text-lg">AI Recommendations</h3>
                </div>
                <p className="text-white/40 text-sm mb-4">Personalized picks for The Sharmas</p>
                <div className="space-y-3">
                  {aiRecommendations.map(dish => (
                    <div key={dish.id} className="flex gap-3 p-3 rounded-xl bg-white/5">
                      <img src={dish.image_url} alt={dish.name} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white font-semibold text-sm">{dish.name}</h4>
                        <p className="text-white/40 text-xs mt-0.5">{dish.description}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-[#ff6b35] font-bold text-sm">₹{dish.price}</span>
                          <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => { e.stopPropagation(); addItem({ id: dish.id, name: dish.name, price: dish.price, image_url: dish.image_url, is_veg: dish.is_veg }); }}
                            className="px-3 py-1 bg-[#ff6b35] text-white text-xs font-semibold rounded-full"
                          >
                            Add
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
