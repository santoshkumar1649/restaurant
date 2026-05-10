import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame } from 'lucide-react';

interface Ember {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
}

export default function Splash({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<'embers' | 'brand' | 'tagline' | 'done'>('embers');
  const [embers, setEmbers] = useState<Ember[]>([]);

  useEffect(() => {
    const generated: Ember[] = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 6 + 2,
      delay: Math.random() * 2,
      duration: Math.random() * 3 + 2,
    }));
    setEmbers(generated);
  }, []);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('brand'), 1200);
    const t2 = setTimeout(() => setPhase('tagline'), 2400);
    const t3 = setTimeout(() => {
      setPhase('done');
      onComplete();
    }, 3800);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-[#0a0a0a] flex items-center justify-center overflow-hidden">
      {/* Ember particles */}
      {embers.map(ember => (
        <motion.div
          key={ember.id}
          className="absolute rounded-full"
          style={{
            left: `${ember.x}%`,
            bottom: '-5%',
            width: ember.size,
            height: ember.size,
            background: `radial-gradient(circle, #ff6b35, #ff9f1c, transparent)`,
            boxShadow: `0 0 ${ember.size * 2}px #ff6b35`,
          }}
          animate={{
            y: [0, -(ember.y + 50) * 4],
            x: [0, Math.sin(ember.id) * 40],
            opacity: [0, 1, 1, 0],
            scale: [0.5, 1, 0.3],
          }}
          transition={{
            duration: ember.duration,
            delay: ember.delay,
            repeat: Infinity,
            ease: 'easeOut',
          }}
        />
      ))}

      {/* Ambient glow */}
      <motion.div
        className="absolute w-96 h-96 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(255,107,53,0.15), transparent 70%)',
        }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 4, repeat: Infinity }}
      />

      {/* Brand reveal */}
      <div className="relative z-10 text-center">
        <AnimatePresence>
          {phase !== 'embers' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="flex items-center justify-center gap-3 mb-4"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
              >
                <Flame className="w-12 h-12 text-[#ff6b35]" />
              </motion.div>
              <h1 className="text-6xl font-bold tracking-tight">
                <span className="text-[#ff6b35]">Ember</span>
                <span className="text-white">Kitchen</span>
              </h1>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {phase === 'tagline' || phase === 'done' ? (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[#ff9f1c]/80 text-lg tracking-[0.3em] uppercase"
            >
              Where Every Flame Tells a Story
            </motion.p>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}
