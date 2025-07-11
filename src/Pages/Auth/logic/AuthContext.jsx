import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid'; // npm install uuid

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);

  // LocalStorage dan ma'lumotlarni yuklash
  useEffect(() => {
    const savedUsers = localStorage.getItem('registeredUsers');
    const savedCurrentUser = localStorage.getItem('currentUser');
    
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    }
    
    if (savedCurrentUser) {
      const user = JSON.parse(savedCurrentUser);
      setCurrentUser(user);
      setIsAuthenticated(true);
    }
  }, []);

  // Unique ID generator
  const generateUniqueId = () => {
    return uuidv4().slice(0, 8);
  };

  // Foydalanuvchi mavjudligini tekshirish
  const isUserExists = (emailOrPhone) => {
    return users.some(user => user.emailOrPhone === emailOrPhone);
  };

  // Email yoki telefon orqali foydalanuvchini topish
  const getUserByEmailOrPhone = (emailOrPhone) => {
    return users.find(user => user.emailOrPhone === emailOrPhone);
  };

  // Parolni tiklash kodini yuborish
  const sendPasswordResetCode = async (emailOrPhone) => {
    return new Promise((resolve, reject) => {
      // Foydalanuvchi mavjudligini tekshirish
      const user = getUserByEmailOrPhone(emailOrPhone);
      if (!user) {
        reject(new Error('Bu email yoki telefon raqami bilan foydalanuvchi topilmadi'));
        return;
      }

      if (!user.isVerified) {
        reject(new Error('Avval akkauntingizni tasdiqlang'));
        return;
      }

      // 2-3 soniya kutish (real API simulatsiyasi)
      setTimeout(() => {
        // 6 raqamli kod generatsiya qilish
        const resetCode = Math.floor(1000 + Math.random() * 9000).toString();
        
        // Kodni localStorage ga saqlash (real loyihada serverga yuboriladi)
        const resetData = {
          emailOrPhone: emailOrPhone,
          code: resetCode,
          expiresAt: Date.now() + 10 * 60 * 1000, // 10 daqiqa
          createdAt: Date.now()
        };
        
        localStorage.setItem(`reset_${emailOrPhone}`, JSON.stringify(resetData));
        
        // Console ga kod chiqarish (development uchun)
        console.log(`🔐 Reset code for ${emailOrPhone}: ${resetCode}`);
        
        resolve({
          success: true,
          message: 'Kod muvaffaqiyatli yuborildi',
          emailOrPhone: emailOrPhone
        });
      }, 2000);
    });
  };

  // Reset kodini tekshirish
  const verifyResetCode = async (emailOrPhone, code) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const resetDataString = localStorage.getItem(`reset_${emailOrPhone}`);
        if (!resetDataString) {
          reject(new Error('Reset kod topilmadi yoki muddati tugagan'));
          return;
        }

        const resetData = JSON.parse(resetDataString);
        
        // Kodning muddati tugaganligini tekshirish
        if (Date.now() > resetData.expiresAt) {
          localStorage.removeItem(`reset_${emailOrPhone}`);
          reject(new Error('Kodning muddati tugagan. Qaytadan so\'rang'));
          return;
        }

        // Kodni tekshirish
        if (resetData.code !== code) {
          reject(new Error('Noto\'g\'ri kod kiritildi'));
          return;
        }

        resolve({
          success: true,
          message: 'Kod tasdiqlandi',
          emailOrPhone: emailOrPhone
        });
      }, 1000);
    });
  };

  // Yangi parol o'rnatish
  const resetPassword = async (emailOrPhone, newPassword) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Foydalanuvchini topish
        const userIndex = users.findIndex(user => user.emailOrPhone === emailOrPhone);
        if (userIndex === -1) {
          reject(new Error('Foydalanuvchi topilmadi'));
          return;
        }

        // Parol validatsiyasi
        if (!newPassword || newPassword.length < 6) {
          reject(new Error('Parol kamida 6 ta belgidan iborat bo\'lishi kerak'));
          return;
        }

        // Parolni yangilash
        const updatedUsers = [...users];
        updatedUsers[userIndex] = {
          ...updatedUsers[userIndex],
          password: newPassword,
          passwordResetAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        setUsers(updatedUsers);
        localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));

        // Reset kodini o'chirish
        localStorage.removeItem(`reset_${emailOrPhone}`);

        // Agar current user bo'lsa, yangilash
        if (currentUser && currentUser.emailOrPhone === emailOrPhone) {
          setCurrentUser(updatedUsers[userIndex]);
          localStorage.setItem('currentUser', JSON.stringify(updatedUsers[userIndex]));
        }

        resolve({
          success: true,
          message: 'Parol muvaffaqiyatli yangilandi',
          user: updatedUsers[userIndex]
        });
      }, 1000);
    });
  };

  // Yangi foydalanuvchini ro'yxatga olish (parolsiz)
  const registerUser = (userData) => {
    const newUser = {
      id: generateUniqueId(), // Unique ID
      ...userData,
      isVerified: false,
      isProfileCompleted: false,
      createdAt: new Date().toISOString(),
      // Default values
      fullName: null,
      city: null,
      password: null,
      avatar: null,
      bio: null,
      pushNotification: true // default true
    };

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));
    return newUser;
  };

  // Foydalanuvchini tasdiqlash
  const verifyUser = (emailOrPhone) => {
    const userIndex = users.findIndex(user => user.emailOrPhone === emailOrPhone);
    if (userIndex !== -1) {
      const updatedUsers = [...users];
      updatedUsers[userIndex] = {
        ...updatedUsers[userIndex],
        isVerified: true,
        verifiedAt: new Date().toISOString()
      };
      setUsers(updatedUsers);
      localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));
      return updatedUsers[userIndex];
    }
    return null;
  };

  // Foydalanuvchi profilini to'ldirish
  const updateUserProfile = async (profileData) => {
    const userIndex = users.findIndex(user => user.emailOrPhone === profileData.emailOrPhone);
    if (userIndex !== -1) {
      const updatedUsers = [...users];
      updatedUsers[userIndex] = {
        ...updatedUsers[userIndex],
        fullName: profileData.fullName,
        city: profileData.city,
        password: profileData.password,
        avatar: profileData.avatar,
        country: profileData.country, // Country ni ham saqlash
        isProfileCompleted: true,
        profileCompletedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setUsers(updatedUsers);
      localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));
      
      // Agar current user ni update qilayotgan bo'lsak
      if (currentUser && currentUser.emailOrPhone === profileData.emailOrPhone) {
        setCurrentUser(updatedUsers[userIndex]);
        localStorage.setItem('currentUser', JSON.stringify(updatedUsers[userIndex]));
      }
      
      return updatedUsers[userIndex];
    }
    throw new Error('Foydalanuvchi topilmadi');
  };

  // Login qilish
  const login = async (emailOrPhone, password) => {
    const user = users.find(u =>
      u.emailOrPhone === emailOrPhone &&
      u.password === password &&
      u.isVerified &&
      u.isProfileCompleted
    );

    if (user) {
      // Login vaqtini saqlash
      const updatedUser = {
        ...user,
        lastLoginAt: new Date().toISOString()
      };
      
      // Users arrayda ham update qilish
      const userIndex = users.findIndex(u => u.id === user.id);
      if (userIndex !== -1) {
        const updatedUsers = [...users];
        updatedUsers[userIndex] = updatedUser;
        setUsers(updatedUsers);
        localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));
      }

      setCurrentUser(updatedUser);
      setIsAuthenticated(true);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      return updatedUser;
    }
    throw new Error('Login yoki parol noto\'g\'ri, yoki profil to\'ldirilmagan');
  };

  // Logout qilish
  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('currentUser');
  };

  // Foydalanuvchini topish
  const findUser = (emailOrPhone) => {
    return users.find(user => user.emailOrPhone === emailOrPhone);
  };

  // ID bo'yicha foydalanuvchini topish
  const findUserById = (userId) => {
    return users.find(user => user.id === userId);
  };

  // Profil ma'lumotlarini olish (edit uchun)
  const getUserProfile = (userId = null) => {
    const targetUser = userId ? findUserById(userId) : currentUser;
    if (!targetUser) return null;

    return {
      id: targetUser.id,
      fullName: targetUser.fullName || '',
      emailOrPhone: targetUser.emailOrPhone || '',
      country: targetUser.country || '',
      city: targetUser.city || '',
      bio: targetUser.bio || '',
      avatar: targetUser.avatar,
      pushNotification: targetUser.pushNotification !== undefined ? targetUser.pushNotification : true,
      createdAt: targetUser.createdAt,
      lastLoginAt: targetUser.lastLoginAt
    };
  };

  // Profil ma'lumotlarini edit qilish
  const editUserProfile = async (userId, updates) => {
    const userIndex = users.findIndex(user => user.id === userId);
    if (userIndex === -1) {
      throw new Error('Foydalanuvchi topilmadi');
    }

    // Allowed fields for editing
    const allowedFields = ['fullName', 'city', 'bio', 'avatar', 'pushNotification'];
    const filteredUpdates = {};
    
    Object.keys(updates).forEach(key => {
      if (allowedFields.includes(key) && updates[key] !== undefined) {
        filteredUpdates[key] = updates[key];
      }
    });

    const updatedUsers = [...users];
    updatedUsers[userIndex] = {
      ...updatedUsers[userIndex],
      ...filteredUpdates,
      updatedAt: new Date().toISOString()
    };

    setUsers(updatedUsers);
    localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));

    // Agar current user ni edit qilayotgan bo'lsak
    if (currentUser && currentUser.id === userId) {
      setCurrentUser(updatedUsers[userIndex]);
      localStorage.setItem('currentUser', JSON.stringify(updatedUsers[userIndex]));
    }

    return updatedUsers[userIndex];
  };

  // Parolni o'zgartirish
  const changePassword = async (userId, currentPassword, newPassword) => {
    const userIndex = users.findIndex(user => user.id === userId);
    if (userIndex === -1) {
      throw new Error('Foydalanuvchi topilmadi');
    }

    const user = users[userIndex];
    if (user.password !== currentPassword) {
      throw new Error('Joriy parol noto\'g\'ri');
    }

    if (newPassword.length < 6) {
      throw new Error('Yangi parol kamida 6 ta belgidan iborat bo\'lishi kerak');
    }

    const updatedUsers = [...users];
    updatedUsers[userIndex] = {
      ...updatedUsers[userIndex],
      password: newPassword,
      passwordChangedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setUsers(updatedUsers);
    localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));

    // Agar current user ni update qilayotgan bo'lsak
    if (currentUser && currentUser.id === userId) {
      setCurrentUser(updatedUsers[userIndex]);
      localStorage.setItem('currentUser', JSON.stringify(updatedUsers[userIndex]));
    }

    return updatedUsers[userIndex];
  };

  // Profilni o'chirish
  const deleteUserProfile = async (userId, password) => {
    const userIndex = users.findIndex(user => user.id === userId);
    if (userIndex === -1) {
      throw new Error('Foydalanuvchi topilmadi');
    }

    const user = users[userIndex];
    if (user.password !== password) {
      throw new Error('Parol noto\'g\'ri');
    }

    // Foydalanuvchini arraydan olib tashlash
    const updatedUsers = users.filter(user => user.id !== userId);
    setUsers(updatedUsers);
    localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));

    // Agar o'chirilgan user current user bo'lsa, logout qilish
    if (currentUser && currentUser.id === userId) {
      logout();
    }

    return true;
  };

  // Barcha foydalanuvchilar ro'yxati (admin uchun)
  const getAllUsers = () => {
    return users.map(user => ({
      id: user.id,
      fullName: user.fullName,
      emailOrPhone: user.emailOrPhone,
      country: user.country,
      city: user.city,
      isVerified: user.isVerified,
      isProfileCompleted: user.isProfileCompleted,
      createdAt: user.createdAt,
      lastLoginAt: user.lastLoginAt
    }));
  };

  // User statistikasi
  const getUserStats = () => {
    const totalUsers = users.length;
    const verifiedUsers = users.filter(u => u.isVerified).length;
    const completedProfiles = users.filter(u => u.isProfileCompleted).length;
    const activeUsers = users.filter(u => u.lastLoginAt).length;

    return {
      totalUsers,
      verifiedUsers,
      completedProfiles,
      activeUsers,
      verificationRate: totalUsers > 0 ? ((verifiedUsers / totalUsers) * 100).toFixed(1) : 0,
      completionRate: totalUsers > 0 ? ((completedProfiles / totalUsers) * 100).toFixed(1) : 0
    };
  };

  // Ma'lumotlarni tozalash (development uchun)
  const clearAllData = () => {
    setUsers([]);
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('registeredUsers');
    localStorage.removeItem('currentUser');
    // Reset kodlarini ham tozalash
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('reset_')) {
        localStorage.removeItem(key);
      }
    });
  };

  const value = {
    // State
    isAuthenticated,
    currentUser,
    users,
    
    // Auth functions
    isUserExists,
    registerUser,
    verifyUser,
    updateUserProfile,
    login,
    logout,
    
    // Password reset functions
    getUserByEmailOrPhone,
    sendPasswordResetCode,
    verifyResetCode,
    resetPassword,
    
    // User management
    findUser,
    findUserById,
    getUserProfile,
    editUserProfile,
    changePassword,
    deleteUserProfile,
    
    // Admin functions
    getAllUsers,
    getUserStats,
    
    // Utility
    clearAllData
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};