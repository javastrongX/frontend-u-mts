import { useState, useCallback } from 'react';
import { useNavigate } from "react-router-dom";
import { useToast } from "@chakra-ui/react";

// Constants
const API_ENDPOINTS = {
  HEALTH: 'https://verificationbot-zj0l.onrender.com/api/auth/health',
  TELEGRAM_LOGIN: 'https://verificationbot-zj0l.onrender.com/api/auth/telegram-login'
};

const ROUTES = {
  TELEGRAM_LOGIN: '/auth/telegram-login'
};

// Utility functions for generating IDs
const generateUniqueId = () => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `${timestamp}_${random}`;
};

const generateCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 5; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// API service
const apiService = {
  async checkHealth() {
    const response = await fetch(API_ENDPOINTS.HEALTH);
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Health check failed:', response.status, errorText);
      throw new Error(`Health check failed: ${response.status}`);
    }
    return response;
  },

  async submitTelegramLogin(uniqueId, code) {
    const response = await fetch(API_ENDPOINTS.TELEGRAM_LOGIN, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ uniqueId, code })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Server response error:', response.status, errorText);
      throw new Error(`Server error: ${response.status}`);
    }

    const data = await response.json();
    // console.log('✅ Server response:', data);
    return data;
  },

  async processLogin(uniqueId, code) {
    try {
      await this.checkHealth();
      return await this.submitTelegramLogin(uniqueId, code);
    } catch (error) {
      console.error('❌ API error:', error);
      
      if (error.name === 'SyntaxError') {
        console.error('📄 JSON parse error - server returned HTML or text');
        throw new Error('Server qaytgan javob noto\'g\'ri formatda');
      }
      
      throw error;
    }
  }
};

// Custom hook
export const useTelegramAuth = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (options = {}) => {
    const {
      shouldNavigate = true,
      loadingMessage = "Kirish jarayoni boshlandi",
      loadingDescription = "Iltimos, kuting...",
      delay = 1500,
      onSuccess,
      onError
    } = options;

    if (isLoading) return null;

    setIsLoading(true);
    
    try {
      // Generate credentials
      const uniqueId = generateUniqueId();
      const code = generateCode();
      
      // Show loading state
      toast({
        title: loadingMessage,
        description: loadingDescription,
        status: "info",
        duration: 2000,
        isClosable: true,
      });

      // Simulate loading delay
      if (delay > 0) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }
      
      // API call
      const result = await apiService.processLogin(uniqueId, code);
      
      const authData = {
        uniqueId,
        code,
        timestamp: Date.now(),
        serverResponse: result
      };

      // Navigate if needed
      if (shouldNavigate) {
        navigate(ROUTES.TELEGRAM_LOGIN, {
          state: authData
        });
      }

      // Custom success handler
      if (onSuccess) {
        onSuccess(authData);
      }

      return authData;

    } catch (error) {
      console.error('❌ Login error:', error);
      
      const errorMessage = error.message || "Iltimos, qaytadan urinib ko'ring";
      
      toast({
        title: "Xatolik yuz berdi",
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
      });

      // Custom error handler
      if (onError) {
        onError(error);
      }

      return null;
    } finally {
      setIsLoading(false);
    }
  }, [navigate, toast, isLoading]);

  const resendCode = useCallback(async (options = {}) => {
    return await login({
      shouldNavigate: false,
      loadingMessage: "Kod qayta yuborilmoqda",
      loadingDescription: "Yangi kod generatsiya qilinmoqda...",
      delay: 1000,
      ...options
    });
  }, [login]);

  return {
    login,
    resendCode,
    isLoading
  };
};
