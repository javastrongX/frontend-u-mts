import { useState, useEffect } from 'react';

export const useNews = (currentPage, limit) => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const offset = (currentPage - 1) * limit;
        
        const response = await fetch(`https://backend-u-mts.onrender.com/api/news/paginated?limit=${limit}&offset=${offset}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        setNews(data.news || []);
        return data.total || 0;
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
        return 0;
      } finally {
        setLoading(false);
      }
    };

    fetchNews().then(total => {
      // This will be handled by the parent component
      if (typeof total === 'number') {
        // Return total to parent component
      }
    });
  }, [currentPage, limit]);

  const handleViewIncrement = async (newsId) => {
    try {
      const response = await fetch(`/api/news/${newsId}/increment-view`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        setNews(prevNews => 
          prevNews.map(item => 
            item.id === newsId 
              ? { ...item, views: (item.views || 0) + 1 }
              : item
          )
        );
      }
    } catch (error) {
      console.error('Failed to increment view:', error);
    }
  };

  return {
    news,
    loading,
    error,
    handleViewIncrement,
    setNews
  };
};
