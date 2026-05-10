import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Flame, ChefHat, Clock, CheckCircle2 } from 'lucide-react';
import { useOrder } from '../contexts/OrderContext';

const STAGES = [
  { key: 'placed', label: 'Order Received', icon: Clock },
  { key: 'confirmed', label: 'Confirmed', icon: CheckCircle2 },
  { key: 'preparing', label: 'Preparing', icon: Flame },
  { key: 'cooking', label: 'Cooking', icon: ChefHat },
  { key: 'ready', label: 'Ready to Serve', icon: CheckCircle2 },
];

const CHEF = {
  name: 'Chef Rajesh',
  specialty: 'North Indian & Tandoor',
  experience: '18 years',
  avatar: '👨‍🍳',
};

export default function LiveKitchen({ onBack }: { onBack: () => void }) {
  const { currentOrder, updateOrderStatus, updateItemStatus } = useOrder();
  const [activeStage, setActiveStage] = useState(0);

  useEffect(() => {
    if (!currentOrder) return;
    const stageIndex = STAGES.findIndex(s => s.key === currentOrder.status);
    setActiveStage(Math.max(0, stageIndex));

    // Simulate progress
    const timers: ReturnType<typeof setTimeout>[] = [];
    const statuses: Array<typeof currentOrder.status> = ['confirmed', 'preparing', 'cooking', 'ready', 'served'];
    statuses.forEach((status, i) => {
      timers.push(setTimeout(() => {
        updateOrderStatus(currentOrder.id, status);
        if (currentOrder.items.length > 0) {
          currentOrder.items.forEach((item, j) => {
            const itemStatuses: Array<'preparing' | 'cooking' | 'plating' | 'ready'> = ['preparing', 'cooking', 'plating', 'ready'];
            const itemStatus = itemStatuses[Math.min(i, itemStatuses.length - 1)];
            setTimeout(() => updateItemStatus(currentOrder.id, item.id, itemStatus), j * 500);
          });
        }
      }, (i + 1) * 4000));
    });

    return () => timers.forEach(clearTimeout);
  }, [currentOrder?.id]);

  if (!currentOrder) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex flex-col items-center justify-center">
        <motion.button whileTap={{ scale: 0.9 }} onClick={onBack} className="absolute top-4 left-4">
          <ArrowLeft className="w-5 h-5 text-white" />
        </motion.button>
        <div className="text-5xl mb-4">🍳</div>
        <p className="text-white/40">No active order</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] pb-8">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-[#0f0f0f]/90 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
          <motion.button whileTap={{ scale: 0.9 }} onClick={onBack}>
            <ArrowLeft className="w-5 h-5 text-white" />
          </motion.button>
          <div>
            <h1 className="text-white font-bold text-lg">Live Kitchen</h1>
            <p className="text-white/40 text-xs">{currentOrder.id}</p>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4">
        {/* 5-Stage Progress Tracker */}
        <div className="mt-6">
          <div className="relative flex items-center justify-between">
            {/* Progress line */}
            <div className="absolute top-5 left-8 right-8 h-0.5 bg-white/10">
              <motion.div
                className="h-full bg-[#ff6b35]"
                initial={{ width: '0%' }}
                animate={{ width: `${(activeStage / (STAGES.length - 1)) * 100}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            </div>

            {STAGES.map((stage, i) => {
              const isActive = i <= activeStage;
              const isCurrent = i === activeStage;
              return (
                <div key={stage.key} className="relative flex flex-col items-center z-10">
                  <motion.div
                    animate={{
                      scale: isCurrent ? [1, 1.2, 1] : 1,
                      boxShadow: isCurrent ? '0 0 20px #ff6b35' : '0 0 0px transparent',
                    }}
                    transition={{ duration: 1.5, repeat: isCurrent ? Infinity : 0 }}
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isActive
                        ? 'bg-[#ff6b35] text-white'
                        : 'bg-white/10 text-white/30'
                    }`}
                  >
                    <stage.icon className="w-4 h-4" />
                  </motion.div>
                  <span className={`text-[10px] mt-2 text-center max-w-[60px] ${
                    isActive ? 'text-white' : 'text-white/30'
                  }`}>
                    {stage.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chef Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 p-4 rounded-xl bg-gradient-to-r from-[#ff6b35]/10 to-transparent border border-[#ff6b35]/20"
        >
          <div className="flex items-center gap-3">
            <div className="text-4xl">{CHEF.avatar}</div>
            <div>
              <h3 className="text-white font-bold">{CHEF.name}</h3>
              <p className="text-white/40 text-sm">{CHEF.specialty}</p>
              <p className="text-white/30 text-xs">{CHEF.experience} experience</p>
            </div>
          </div>
        </motion.div>

        {/* Per-Item Status */}
        <div className="mt-6">
          <h3 className="text-white/40 text-xs uppercase tracking-widest mb-3">Your Items</h3>
          <div className="space-y-2">
            {currentOrder.items.map(item => {
              const statusColors: Record<string, string> = {
                pending: 'bg-white/10 text-white/40',
                preparing: 'bg-amber-500/20 text-amber-400',
                cooking: 'bg-[#ff6b35]/20 text-[#ff6b35]',
                plating: 'bg-emerald-500/20 text-emerald-400',
                ready: 'bg-emerald-500/30 text-emerald-300',
              };
              return (
                <motion.div
                  key={item.id}
                  layout
                  className="flex items-center justify-between p-3 rounded-xl bg-white/5"
                >
                  <div>
                    <h4 className="text-white text-sm font-medium">{item.name}</h4>
                    <p className="text-white/30 text-xs">Qty: {item.quantity}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${statusColors[item.status] || statusColors.pending}`}>
                    {item.status}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
