import { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CartProvider } from './contexts/CartContext';
import { TableProvider } from './contexts/TableContext';
import { OrderProvider } from './contexts/OrderContext';
import Splash from './pages/Splash';
import QRScan from './pages/QRScan';
import Home from './pages/Home';
import DishDetail from './pages/DishDetail';
import Cart from './pages/Cart';
import LiveKitchen from './pages/LiveKitchen';
import Rewards from './pages/Rewards';
import Profile from './pages/Profile';

type Screen = 'splash' | 'qr' | 'home' | 'dish' | 'cart' | 'kitchen' | 'rewards' | 'profile';

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

function AppContent() {
  const [screen, setScreen] = useState<Screen>('splash');
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [prevScreen, setPrevScreen] = useState<Screen>('home');

  const navigate = useCallback((to: Screen) => {
    setPrevScreen(screen);
    setScreen(to);
  }, [screen]);

  const handleSplashComplete = useCallback(() => navigate('qr'), [navigate]);
  const handleTableConnect = useCallback(() => navigate('home'), [navigate]);

  const handleDishSelect = useCallback((dish: Dish) => {
    setSelectedDish(dish);
    navigate('dish');
  }, [navigate]);

  const slideDirection = (from: Screen, to: Screen) => {
    const order: Screen[] = ['splash', 'qr', 'home', 'dish', 'cart', 'kitchen', 'rewards', 'profile'];
    return order.indexOf(to) > order.indexOf(from) ? 1 : -1;
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={screen}
        initial={{ opacity: 0, x: slideDirection(prevScreen, screen) * 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: slideDirection(prevScreen, screen) * -50 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="min-h-screen"
      >
        {screen === 'splash' && <Splash onComplete={handleSplashComplete} />}
        {screen === 'qr' && <QRScan onConnect={handleTableConnect} />}
        {screen === 'home' && (
          <Home
            onDishSelect={handleDishSelect}
            onCartOpen={() => navigate('cart')}
            onKitchenOpen={() => navigate('kitchen')}
            onRewardsOpen={() => navigate('rewards')}
            onProfileOpen={() => navigate('profile')}
          />
        )}
        {screen === 'dish' && selectedDish && (
          <DishDetail dish={selectedDish} onBack={() => navigate('home')} />
        )}
        {screen === 'cart' && (
          <Cart onBack={() => navigate('home')} onOrderPlaced={() => navigate('kitchen')} />
        )}
        {screen === 'kitchen' && (
          <LiveKitchen onBack={() => navigate('home')} />
        )}
        {screen === 'rewards' && (
          <Rewards onBack={() => navigate('home')} />
        )}
        {screen === 'profile' && (
          <Profile onBack={() => navigate('home')} />
        )}
      </motion.div>
    </AnimatePresence>
  );
}

function App() {
  return (
    <TableProvider>
      <CartProvider>
        <OrderProvider>
          <AppContent />
        </OrderProvider>
      </CartProvider>
    </TableProvider>
  );
}

export default App;
