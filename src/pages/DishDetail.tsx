import { motion } from 'framer-motion';
import { ArrowLeft, Leaf, Plus, Flame, Wine } from 'lucide-react';
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
}

export default function DishDetail({
  dish,
  onBack,
}: {
  dish: Dish;
  onBack: () => void;
}) {
  const { addItem } = useCart();

  const handleAdd = () => {
    addItem({ id: dish.id, name: dish.name, price: dish.price, image_url: dish.image_url, is_veg: dish.is_veg });
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] pb-32">
      {/* Full-screen photo */}
      <div className="relative h-[45vh]">
        <img src={dish.image_url} alt={dish.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-transparent to-black/40" />

        {/* Steam animation */}
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-3">
          {[0, 1, 2].map(i => (
            <motion.div
              key={i}
              className="w-1 bg-gradient-to-t from-white/0 via-white/30 to-white/0 rounded-full"
              style={{ height: 60 + i * 20 }}
              animate={{
                y: [-10, -40, -10],
                opacity: [0, 0.6, 0],
                scaleX: [1, 1.5, 1],
              }}
              transition={{
                duration: 2 + i * 0.3,
                repeat: Infinity,
                delay: i * 0.4,
                ease: 'easeOut',
              }}
            />
          ))}
        </div>

        {/* Back button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onBack}
          className="absolute top-4 left-4 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </motion.button>

        {/* Badges */}
        <div className="absolute top-4 right-4 flex gap-2">
          {dish.is_chef_pick && (
            <span className="px-2 py-1 bg-[#ff6b35] text-white text-xs font-bold rounded-full flex items-center gap-1">
              <Flame className="w-3 h-3" /> Chef's Pick
            </span>
          )}
          {dish.is_veg && (
            <span className="px-2 py-1 bg-emerald-500/80 text-white text-xs font-bold rounded-full flex items-center gap-1">
              <Leaf className="w-3 h-3" /> Veg
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-lg mx-auto px-4 -mt-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-white text-3xl font-bold">{dish.name}</h1>
          <p className="text-white/50 mt-2 leading-relaxed">{dish.description}</p>

          {/* Price & Spice */}
          <div className="flex items-center gap-4 mt-4">
            <span className="text-[#ff6b35] text-2xl font-bold">₹{dish.price}</span>
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full ${
                    i < dish.spice_level ? 'bg-[#ff6b35]' : 'bg-white/10'
                  }`}
                />
              ))}
              <span className="text-white/40 text-xs ml-1">
                {dish.spice_level === 0 ? 'Mild' : dish.spice_level <= 2 ? 'Medium' : 'Hot'}
              </span>
            </div>
          </div>

          {/* Ingredients */}
          <div className="mt-6">
            <h3 className="text-white/40 text-xs uppercase tracking-widest mb-3">Ingredients</h3>
            <div className="flex flex-wrap gap-2">
              {dish.ingredients.map(ing => (
                <span key={ing} className="px-3 py-1.5 bg-white/5 text-white/70 text-xs rounded-full border border-white/10">
                  {ing}
                </span>
              ))}
            </div>
          </div>

          {/* Perfect Pairing */}
          {dish.pairing_suggestion && dish.pairing_suggestion !== 'None' && (
            <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-[#ff6b35]/10 to-transparent border border-[#ff6b35]/20">
              <div className="flex items-center gap-2 mb-1">
                <Wine className="w-4 h-4 text-[#ff6b35]" />
                <span className="text-[#ff6b35] text-xs font-semibold uppercase tracking-wider">Perfect Pairing</span>
              </div>
              <p className="text-white/70 text-sm">{dish.pairing_suggestion}</p>
            </div>
          )}

          {/* Mood Tags */}
          {dish.mood_tags.length > 0 && (
            <div className="mt-6">
              <h3 className="text-white/40 text-xs uppercase tracking-widest mb-3">Mood</h3>
              <div className="flex gap-2">
                {dish.mood_tags.map(tag => (
                  <span key={tag} className="px-3 py-1.5 bg-white/5 text-white/50 text-xs rounded-full capitalize">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Add to Order CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#0f0f0f]/95 backdrop-blur-xl border-t border-white/5 p-4">
        <div className="max-w-lg mx-auto">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleAdd}
            className="w-full py-4 bg-gradient-to-r from-[#ff6b35] to-[#ff9f1c] text-white font-bold text-lg rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-[#ff6b35]/30"
          >
            <Plus className="w-5 h-5" />
            Add to Order — ₹{dish.price}
          </motion.button>
        </div>
      </div>
    </div>
  );
}
