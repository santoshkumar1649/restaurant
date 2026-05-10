import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ScanLine, Wifi, CheckCircle2 } from 'lucide-react';
import { useTable } from '../contexts/TableContext';

export default function QRScan({ onConnect }: { onConnect: () => void }) {
  const [scanning, setScanning] = useState(true);
  const { connectTable } = useTable();

  useEffect(() => {
    const timer = setTimeout(() => {
      setScanning(false);
      connectTable('table-7-uuid', 7, 'Family Hearth', 'The Sharmas');
    }, 3000);
    return () => clearTimeout(timer);
  }, [connectTable]);

  const handleConnect = () => {
    onConnect();
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1a0a00] via-[#0a0a0a] to-[#0a0a0a]" />

      {/* Scanner frame */}
      <div className="relative z-10 w-72 h-72 mb-8">
        {/* Corner brackets */}
        {['top-0 left-0', 'top-0 right-0', 'bottom-0 left-0', 'bottom-0 right-0'].map((pos, i) => (
          <div key={i} className={`absolute ${pos} w-8 h-8 border-[#ff6b35] ${
            i < 2 ? 'border-t-2' : 'border-b-2'
          } ${
            i % 2 === 0 ? 'border-l-2' : 'border-r-2'
          }`} />
        ))}

        {/* Scan line animation */}
        {scanning && (
          <motion.div
            className="absolute left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-[#ff6b35] to-transparent"
            style={{ boxShadow: '0 0 20px #ff6b35, 0 0 40px #ff6b3540' }}
            animate={{ top: ['0%', '100%', '0%'] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}

        {/* Center icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          {scanning ? (
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ScanLine className="w-12 h-12 text-[#ff6b35]/60" />
            </motion.div>
          ) : (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              <CheckCircle2 className="w-16 h-16 text-emerald-400" />
            </motion.div>
          )}
        </div>

        {/* Pulsing rings */}
        {scanning && (
          <>
            <motion.div
              className="absolute inset-8 border border-[#ff6b35]/20 rounded-xl"
              animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.1, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.div
              className="absolute inset-4 border border-[#ff6b35]/10 rounded-xl"
              animate={{ scale: [1, 1.05, 1], opacity: [0.2, 0.05, 0.2] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            />
          </>
        )}
      </div>

      {/* Status text */}
      <motion.div className="relative z-10 text-center">
        {scanning ? (
          <>
            <div className="flex items-center gap-2 text-[#ff9f1c] mb-2">
              <Wifi className="w-4 h-4 animate-pulse" />
              <span className="text-sm tracking-widest uppercase">Scanning</span>
            </div>
            <p className="text-white/40 text-sm">Point your camera at the table QR code</p>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <p className="text-emerald-400 text-lg font-semibold mb-1">Table 7 Detected</p>
            <p className="text-white/50 text-sm mb-6">Family Hearth — The Sharmas</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleConnect}
              className="px-8 py-3 bg-gradient-to-r from-[#ff6b35] to-[#ff9f1c] text-white font-semibold rounded-xl shadow-lg shadow-[#ff6b35]/30"
            >
              Connect Table 7
            </motion.button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
