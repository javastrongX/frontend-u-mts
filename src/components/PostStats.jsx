import React, { useState, useEffect, useCallback } from 'react';

// Sodda stats manager
class StatsManager {
  constructor() {
    this.stats = new Map();
    this.likedProducts = new Set(); // Like qilingan productlarni eslab qolish uchun
  }

  getStats(productId) {
    return this.stats.get(productId) || {
      views: 0,
      likes: 0,
      shares: 0,
      clicks: 0,
      calls: 0,
      messages: 0
    };
  }

  // Like ni toggle qilish (bosilsa qo'shiladi, yana bosilsa olinadi)
  toggleLike(productId) {
    const currentStats = this.getStats(productId);
    const isLiked = this.likedProducts.has(productId);
    
    if (isLiked) {
      // Like olib tashlash
      currentStats.likes = Math.max(0, currentStats.likes - 1);
      this.likedProducts.delete(productId);
    } else {
      // Like qo'shish
      currentStats.likes += 1;
      this.likedProducts.add(productId);
    }
    
    this.stats.set(productId, currentStats);
    this.saveToAPI(productId, 'likes', currentStats.likes);
    
    return { stats: currentStats, isLiked: !isLiked };
  }

  // Boshqa actionlar uchun
  track(productId, action, value = 1) {
    const currentStats = this.getStats(productId);
    currentStats[action] = (currentStats[action] || 0) + value;
    this.stats.set(productId, currentStats);
    
    this.saveToAPI(productId, action, currentStats[action]);
    return currentStats;
  }

  // User like qilganmi yoki yo'qmi tekshirish
  isLiked(productId) {
    return this.likedProducts.has(productId);
  }

  // API ga saqlash (real API ni ulashingiz mumkin)
  async saveToAPI(productId, action, value) {
    try {
      // Real API call
      // console.log(`API: ${productId} - ${action}: ${value}`);
      
      // Uncomment bu qismni real API uchun:
      /*
      await fetch('/api/stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          action,
          value,
          timestamp: Date.now()
        })
      });
      */
    } catch (error) {
      console.error('API xatosi:', error);
    }
  }

  // Mock data yuklash
  loadMockData(productIds) {
    productIds.forEach(id => {
      this.stats.set(id, {
        views: Math.floor(Math.random() * 500),
        likes: Math.floor(Math.random() * 50),
        shares: Math.floor(Math.random() * 25),
        clicks: Math.floor(Math.random() * 100),
        calls: Math.floor(Math.random() * 15),
        messages: Math.floor(Math.random() * 40)
      });
    });
  }
}

// Global instance
const statsManager = new StatsManager();

// Hook
export const useStats = (productId) => {
  const [stats, setStats] = useState(statsManager.getStats(productId));
  const [isLiked, setIsLiked] = useState(statsManager.isLiked(productId));

  // Stats ni yangilash
  const updateStats = useCallback(() => {
    setStats(statsManager.getStats(productId));
    setIsLiked(statsManager.isLiked(productId));
  }, [productId]);

  // Like toggle
  const toggleLike = useCallback(() => {
    const result = statsManager.toggleLike(productId);
    setStats(result.stats);
    setIsLiked(result.isLiked);
  }, [productId]);

  // Boshqa actionlar
  const track = useCallback((action, value = 1) => {
    const newStats = statsManager.track(productId, action, value);
    setStats(newStats);
  }, [productId]);

  return {
    stats,
    isLiked,
    toggleLike,
    track,
    updateStats
  };
};

// const StatsTracker = ({ productId, showStats = true }) => {
//   const { stats, isLiked, toggleLike, track } = useStats(productId);

//   // View ni avtomatik track qilish
//   useEffect(() => {
//     if (productId) {
//       track('views');
//     }
//   }, [productId, track]);

//   if (!showStats) return null;

//   return (
//     <div style={{ 
//       display: 'flex', 
//       gap: '10px', 
//       alignItems: 'center',
//       padding: '10px',
//       border: '1px solid #ddd',
//       borderRadius: '8px',
//       backgroundColor: '#f9f9f9'
//     }}>
//       {/* Like button */}
//       <button 
//         onClick={toggleLike}
//         style={{
//           backgroundColor: isLiked ? '#ff4757' : '#fff',
//           color: isLiked ? 'white' : '#333',
//           border: '1px solid #ff4757',
//           padding: '5px 10px',
//           borderRadius: '5px',
//           cursor: 'pointer'
//         }}
//       >
//         ❤️ {stats.likes}
//       </button>

//       {/* Share button */}
//       <button 
//         onClick={() => track('shares')}
//         style={{
//           backgroundColor: '#3742fa',
//           color: 'white',
//           border: 'none',
//           padding: '5px 10px',
//           borderRadius: '5px',
//           cursor: 'pointer'
//         }}
//       >
//         📤 {stats.shares}
//       </button>

//       {/* Call button */}
//       <button 
//         onClick={() => track('calls')}
//         style={{
//           backgroundColor: '#2ed573',
//           color: 'white',
//           border: 'none',
//           padding: '5px 10px',
//           borderRadius: '5px',
//           cursor: 'pointer'
//         }}
//       >
//         📞 {stats.calls}
//       </button>

//       {/* Message button */}
//       <button 
//         onClick={() => track('messages')}
//         style={{
//           backgroundColor: '#ffa502',
//           color: 'white',
//           border: 'none',
//           padding: '5px 10px',
//           borderRadius: '5px',
//           cursor: 'pointer'
//         }}
//       >
//         💬 {stats.messages}
//       </button>

//       {/* Stats ko'rsatish */}
//       <div style={{ marginLeft: '20px', fontSize: '12px', color: '#666' }}>
//         👀 {stats.views} | 🖱️ {stats.clicks}
//       </div>
//     </div>
//   );
// };

// Export qilish
export { statsManager };

/*
ISHLATISH:

1. Oddiy ishlatish:
function ProductCard({ productId }) {
  return (
    <div>
      <h3>Mahsulot #{productId}</h3>
      <StatsTracker productId={productId} />
    </div>
  );
}

2. Hook bilan:
function CustomComponent({ productId }) {
  const { stats, isLiked, toggleLike, track } = useStats(productId);
  
  return (
    <div>
      <h3>Stats: {JSON.stringify(stats)}</h3>
      <button onClick={toggleLike}>
        {isLiked ? '❤️ Liked' : '🤍 Like'}
      </button>
      <button onClick={() => track('clicks')}>Click me</button>
    </div>
  );
}

3. Mock data yuklash:
statsManager.loadMockData(['product1', 'product2', 'product3']);

4. Manual track:
statsManager.track('product1', 'views', 5);
statsManager.toggleLike('product1');

API BACKEND MISOL (Node.js):

app.post('/api/stats', (req, res) => {
  const { productId, action, value } = req.body;
  
  // Database ga saqlash
  // updateStats(productId, action, value);
  
  res.json({ success: true });
});
*/