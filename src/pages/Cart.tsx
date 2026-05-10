import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Minus, Plus, Trash2, CreditCard, Smartphone, Building2, Banknote, CheckCircle2, Leaf } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useOrder } from '../contexts/OrderContext';
import { useState } from 'react';

const PAYMENT_METHODS = [
  { id: 'upi', label: 'UPI', icon: Smartphone, desc: 'Google Pay, PhonePe' },
  { id: 'card', label: 'Card', icon: CreditCard, desc: 'Credit / Debit' },
  { id: 'netbanking', label: 'Net Banking', icon: Building2, desc: 'All banks' },
  { id: 'cash', label: 'Cash', icon: Banknote, desc: 'Pay at table' },
];

export default function Cart({
  onBack,
  onOrderPlaced,
}: {
  onBack: () => void;
  onOrderPlaced: () => void;
}) {
  const { items, updateQuantity, removeItem, total, clearCart } = useCart();
  const { placeOrder } = useOrder();
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [showSuccess, setShowSuccess] = useState(false);

  const gst = Math.round(total * 0.05);
  const grandTotal = total + gst;

  const handlePlaceOrder = () => {
    const orderId = `ORD-${Date.now()}`;
    placeOrder({
      id: orderId,
      status: 'placed',
      items: items.map(i => ({
        id: i.id,
        name: i.name,
        quantity: i.quantity,
        status: 'pending' as const,
      })),
      total: grandTotal,
      paymentMethod,
      createdAt: new Date().toISOString(),
    });
    clearCart();
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      onOrderPlaced();
    }, 2500);
  };

  if (showSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-[#0f0f0f] flex flex-col items-center justify-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
        >
          <CheckCircle2 className="w-24 h-24 text-emerald-400" />
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-white text-2xl font-bold mt-6"
        >
          Order Placed!
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="text-white/50 mt-2"
        >
          Your food is being prepared with love
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-4"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 0.5 }}
            className="text-4xl"
          >
            🔥
          </motion.div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] pb-48">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-[#0f0f0f]/90 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
          <motion.button whileTap={{ scale: 0.9 }} onClick={onBack}>
            <ArrowLeft className="w-5 h-5 text-white" />
          </motion.button>
          <h1 className="text-white font-bold text-lg">Your Cart</h1>
          <span className="text-white/40 text-sm ml-auto">{items.length} items</span>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="text-5xl mb-4">🛒</div>
            <p className="text-white/40">Your cart is empty</p>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="mt-4 space-y-3">
              <AnimatePresence>
                {items.map(item => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20, height: 0 }}
                    className="flex gap-3 p-3 rounded-xl bg-white/5"
                  >
                    <img src={item.image_url} alt={item.name} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        {item.is_veg ? <Leaf className="w-3 h-3 text-emerald-400" /> : <span className="w-3 h-3 rounded-full bg-red-500 inline-block" />}
                        <h4 className="text-white font-semibold text-sm truncate">{item.name}</h4>
                      </div>
                      <p className="text-[#ff6b35] font-bold text-sm mt-1">₹{item.price * item.quantity}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <motion.button
                          whileTap={{ scale: 0.8 }}
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center"
                        >
                          <Minus className="w-3 h-3 text-white" />
                        </motion.button>
                        <span className="text-white font-semibold text-sm w-6 text-center">{item.quantity}</span>
                        <motion.button
                          whileTap={{ scale: 0.8 }}
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-7 h-7 rounded-full bg-[#ff6b35] flex items-center justify-center"
                        >
                          <Plus className="w-3 h-3 text-white" />
                        </motion.button>
                        <button onClick={() => removeItem(item.id)} className="ml-auto">
                          <Trash2 className="w-4 h-4 text-white/30 hover:text-red-400 transition-colors" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Bill Summary */}
            <div className="mt-6 p-4 rounded-xl bg-white/5">
              <h3 className="text-white/40 text-xs uppercase tracking-widest mb-3">Bill Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Subtotal</span>
                  <span className="text-white">₹{total}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">GST (5%)</span>
                  <span className="text-white">₹{gst}</span>
                </div>
                <div className="border-t border-white/10 pt-2 flex justify-between">
                  <span className="text-white font-bold">Total</span>
                  <span className="text-[#ff6b35] font-bold text-lg">₹{grandTotal}</span>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="mt-6">
              <h3 className="text-white/40 text-xs uppercase tracking-widest mb-3">Payment Method</h3>
              <div className="grid grid-cols-2 gap-2">
                {PAYMENT_METHODS.map(pm => (
                  <motion.button
                    key={pm.id}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setPaymentMethod(pm.id)}
                    className={`p-3 rounded-xl border transition-all flex items-center gap-3 ${
                      paymentMethod === pm.id
                        ? 'border-[#ff6b35] bg-[#ff6b35]/10'
                        : 'border-white/10 bg-white/5'
                    }`}
                  >
                    <pm.icon className={`w-5 h-5 ${paymentMethod === pm.id ? 'text-[#ff6b35]' : 'text-white/40'}`} />
                    <div className="text-left">
                      <p className={`text-sm font-medium ${paymentMethod === pm.id ? 'text-white' : 'text-white/60'}`}>{pm.label}</p>
                      <p className="text-[10px] text-white/30">{pm.desc}</p>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Place Order CTA */}
      {items.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#0f0f0f]/95 backdrop-blur-xl border-t border-white/5 p-4">
          <div className="max-w-lg mx-auto">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handlePlaceOrder}
              className="w-full py-4 bg-gradient-to-r from-[#ff6b35] to-[#ff9f1c] text-white font-bold text-lg rounded-xl shadow-lg shadow-[#ff6b35]/30"
            >
              Place Order — ₹{grandTotal}
            </motion.button>
          </div>
        </div>
      )}
    </div>
  );
}
