// Shuffle funksiyasi
const shuffleArray = (array) => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

// Produktlarni ranklariga qarab tartiblash funksiyasi
export const SortProductsByRank = (products, shouldShuffle = false) => {
  // Produktlarni ranki bo'lgan va bo'lmagan guruhlarga ajratish
  const rankedProducts = [];
  const normalProducts = [];    
  
  products.forEach(product => {
    const hasPremium = product.rank_premium || false;
    const hasSearch = product.rank_search || false;
    const hasHotOffer = product.rank_hot_offer || false;
    
    if (hasPremium || hasSearch || hasHotOffer) {
      rankedProducts.push(product);
    } else {
      normalProducts.push(product);
    }
  });
  
  // Ranki bo'lgan produktlarni tartiblash
  const sortedRankedProducts = rankedProducts.sort((a, b) => {
    const getRankPriority = (product) => {
      const hasPremium = product.rank_premium || false;
      const hasSearch = product.rank_search || false;
      const hasHotOffer = product.rank_hot_offer || false;
      
      // Eng yuqori prioritet: Premium + Search + Hot Offer
      if (hasPremium && hasSearch && hasHotOffer) return 7;
      
      // Premium + Search
      if (hasPremium && hasSearch) return 6;
      
      // Faqat Premium
      if (hasPremium) return 5;
      
      // Search + Hot Offer
      if (hasSearch && hasHotOffer) return 4;
      
      // Faqat Search
      if (hasSearch) return 3;
      
      // Faqat Hot Offer
      if (hasHotOffer) return 2;
      
      // Hech qanday rank yo'q (bu holat bu yerda bo'lmasligi kerak)
      return 1;
    };
    
    const priorityA = getRankPriority(a);
    const priorityB = getRankPriority(b);
    
    return priorityB - priorityA;
  });
  
  // Oddiy produktlarni shuffle qilish (agar kerak bo'lsa)
  const finalNormalProducts = shouldShuffle ? shuffleArray(normalProducts) : normalProducts;
  
  // Avval ranki bo'lgan, keyin oddiy produktlar
  return [...sortedRankedProducts, ...finalNormalProducts];
};

