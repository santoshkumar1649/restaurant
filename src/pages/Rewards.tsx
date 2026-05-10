import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Crown, Gift, Zap, Clock } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Reward {
  id: string;
  title: string;
  description: string;
  xp_required: number;
  category: string;
  is_exclusive: boolean;
  image_url: string;
}

const FAMILY_XP = 1850;
const FAMILY_TIER = 'Gold';
const NEXT_TIER_XP = 2500;
const VISIT_HISTORY = [
  { date: 'May 8, 2026', spent: 1850, xp: 150 },
  { date: 'Apr 22, 2026', spent: 2200, xp: 200 },
  { date: 'Apr 5, 2026', spent: 1600, xp: 120 },
  { date: 'Mar 18, 2026', spent: 3100, xp: 280 },
  { date: 'Mar 1, 2026', spent: 980, xp: 80 },
];

const EXCLUSIVE_OFFERS = [
  { title: 'Double XP Weekend', description: 'Earn 2x XP on all orders this weekend', expires: 'May 12' },
  { title: 'Birthday Bonus', description: 'Free dessert on your birthday visit', expires: 'Ongoing' },
];

export default function Rewards({ onBack }: { onBack: () => void }) {
  const [rewards, setRewards] = useState<Reward[]>([]);

  useEffect(() => {
    supabase.from('rewards').select('*').then(res => {
      if (res.data) setRewards(res.data as Reward[]);
    });
  }, []);

  const xpProgress = (FAMILY_XP / NEXT_TIER_XP) * 100;

  return (
    <div className="min-h-screen bg-[#0f0f0f] pb-8">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-[#0f0f0f]/90 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
          <motion.button whileTap={{ scale: 0.9 }} onClick={onBack}>
            <ArrowLeft className="w-5 h-5 text-white" />
          </motion.button>
          <h1 className="text-white font-bold text-lg">Rewards</h1>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4">
        {/* Gold Member Loyalty Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 relative rounded-2xl overflow-hidden"
        >
          <div className="bg-gradient-to-br from-amber-600 via-yellow-600 to-amber-700 p-5 relative">
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/4" />
            <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-white/5 translate-y-1/2 -translate-x-1/4" />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Crown className="w-5 h-5 text-yellow-200" />
                  <span className="text-yellow-100 font-bold text-sm uppercase tracking-wider">{FAMILY_TIER} Member</span>
                </div>
                <span className="text-yellow-200/60 text-xs">The Sharmas</span>
              </div>

              <div className="mb-3">
                <div className="flex justify-between text-xs text-yellow-100/80 mb-1">
                  <span>{FAMILY_XP} XP</span>
                  <span>{NEXT_TIER_XP} XP</span>
                </div>
                <div className="h-2 bg-black/20 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${xpProgress}%` }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-yellow-300 to-amber-300 rounded-full"
                  />
                </div>
                <p className="text-yellow-100/60 text-xs mt-1">{NEXT_TIER_XP - FAMILY_XP} XP to Platinum</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Redeemable Rewards */}
        <div className="mt-6">
          <h3 className="text-white/40 text-xs uppercase tracking-widest mb-3">Redeemable Rewards</h3>
          <div className="space-y-2">
            {rewards.map(reward => (
              <motion.div
                key={reward.id}
                whileTap={{ scale: 0.98 }}
                className="flex gap-3 p-3 rounded-xl bg-white/5"
              >
                <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
                  <img src={reward.image_url} alt={reward.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-white font-semibold text-sm truncate">{reward.title}</h4>
                    {reward.is_exclusive && (
                      <span className="px-1.5 py-0.5 bg-[#ff6b35]/20 text-[#ff6b35] text-[10px] font-bold rounded-full">EXCLUSIVE</span>
                    )}
                  </div>
                  <p className="text-white/40 text-xs mt-0.5">{reward.description}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Zap className="w-3 h-3 text-[#ff9f1c]" />
                    <span className="text-[#ff9f1c] text-xs font-medium">{reward.xp_required} XP</span>
                    {FAMILY_XP >= reward.xp_required && (
                      <span className="ml-auto px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded-full">REDEEM</span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Exclusive Offers */}
        <div className="mt-6">
          <h3 className="text-white/40 text-xs uppercase tracking-widest mb-3">Exclusive Offers</h3>
          <div className="space-y-2">
            {EXCLUSIVE_OFFERS.map((offer, i) => (
              <div key={i} className="p-4 rounded-xl bg-gradient-to-r from-[#ff6b35]/10 to-transparent border border-[#ff6b35]/20">
                <div className="flex items-center gap-2 mb-1">
                  <Gift className="w-4 h-4 text-[#ff6b35]" />
                  <h4 className="text-white font-semibold text-sm">{offer.title}</h4>
                </div>
                <p className="text-white/40 text-xs">{offer.description}</p>
                <p className="text-white/30 text-[10px] mt-1">Expires: {offer.expires}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Visit History */}
        <div className="mt-6">
          <h3 className="text-white/40 text-xs uppercase tracking-widest mb-3">Visit History</h3>
          <div className="space-y-2">
            {VISIT_HISTORY.map((visit, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-white/30" />
                  <span className="text-white/60 text-sm">{visit.date}</span>
                </div>
                <div className="text-right">
                  <p className="text-white text-sm font-medium">₹{visit.spent}</p>
                  <p className="text-[#ff9f1c] text-xs">+{visit.xp} XP</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
