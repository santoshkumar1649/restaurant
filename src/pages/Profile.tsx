import { motion } from 'framer-motion';
import { ArrowLeft, Users, Star, Flame, UtensilsCrossed, Heart } from 'lucide-react';

const TASTE_TAGS = ['Spicy Lover', 'Comfort Foodie', 'Cozy Vibes', 'Paneer Fan', 'Biryani Expert'];
const FAVOURITE_DISHES = [
  { name: 'Butter Chicken', image_url: 'https://images.pexels.com/photos/461382/pexels-photo-461382.jpeg' },
  { name: 'Hyderabadi Biryani', image_url: 'https://images.pexels.com/photos/12737656/pexels-photo-12737656.jpeg' },
  { name: 'Dal Makhani', image_url: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg' },
  { name: 'Gulab Jamun', image_url: 'https://images.pexels.com/photos/10955900/pexels-photo-10955900.jpeg' },
];

const STATS = [
  { label: 'Visits', value: '24', icon: UtensilsCrossed },
  { label: 'XP', value: '1,850', icon: Star },
  { label: 'Orders', value: '47', icon: Flame },
  { label: 'Saved', value: '₹3.2K', icon: Heart },
];

export default function Profile({ onBack }: { onBack: () => void }) {
  return (
    <div className="min-h-screen bg-[#0f0f0f] pb-8">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-[#0f0f0f]/90 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
          <motion.button whileTap={{ scale: 0.9 }} onClick={onBack}>
            <ArrowLeft className="w-5 h-5 text-white" />
          </motion.button>
          <h1 className="text-white font-bold text-lg">Profile</h1>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4">
        {/* Family Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 relative rounded-2xl overflow-hidden"
        >
          <div className="bg-gradient-to-br from-[#ff6b35]/20 via-[#0f0f0f] to-[#ff9f1c]/10 p-6 flex items-center gap-4">
            <div className="text-5xl">👨‍👩‍👧‍👦</div>
            <div>
              <h2 className="text-white font-bold text-xl">The Sharmas</h2>
              <p className="text-white/40 text-sm">Gold Member — Table 7</p>
              <div className="flex items-center gap-1 mt-1">
                <Users className="w-3 h-3 text-[#ff6b35]" />
                <span className="text-white/50 text-xs">4 family members</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Avatar */}
        <div className="flex justify-center -mt-8 relative z-10">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#ff6b35] to-[#ff9f1c] flex items-center justify-center text-2xl shadow-lg shadow-[#ff6b35]/30 border-4 border-[#0f0f0f]">
            👤
          </div>
        </div>

        {/* Stat Boxes */}
        <div className="mt-6 grid grid-cols-4 gap-2">
          {STATS.map(stat => (
            <div key={stat.label} className="p-3 rounded-xl bg-white/5 text-center">
              <stat.icon className="w-4 h-4 text-[#ff6b35] mx-auto mb-1" />
              <p className="text-white font-bold text-sm">{stat.value}</p>
              <p className="text-white/30 text-[10px]">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Taste Preferences */}
        <div className="mt-6">
          <h3 className="text-white/40 text-xs uppercase tracking-widest mb-3">Taste Preferences</h3>
          <div className="flex flex-wrap gap-2">
            {TASTE_TAGS.map(tag => (
              <span key={tag} className="px-3 py-1.5 bg-[#ff6b35]/10 text-[#ff6b35] text-xs rounded-full border border-[#ff6b35]/20">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Favourite Dishes Gallery */}
        <div className="mt-6">
          <h3 className="text-white/40 text-xs uppercase tracking-widest mb-3">Favourite Dishes</h3>
          <div className="grid grid-cols-2 gap-2">
            {FAVOURITE_DISHES.map(dish => (
              <div key={dish.name} className="relative rounded-xl overflow-hidden aspect-[4/3]">
                <img src={dish.image_url} alt={dish.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-2">
                  <p className="text-white text-xs font-medium">{dish.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
