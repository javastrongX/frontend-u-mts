import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
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
    return uuidv4().slice(0, 10);
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
        reject(new Error(t('Auth.userNotFoundByEmailOrPhone', "Пользователь с таким email или телефоном не найден")));
        return;
      }

      if (!user.isVerified) {
        reject(new Error(t('Auth.accountNotVerified', "Сначала подтвердите аккаунт")));
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
        // console.log(`🔐 Reset code for ${emailOrPhone}: ${resetCode}`);
        
        resolve({
          success: true,
          message: t('Auth.codeSent', "Код успешно отправлен"),
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
          reject(new Error(t('Auth.codeExpired', "Срок действия кода истёк. Запросите заново")));
          return;
        }

        const resetData = JSON.parse(resetDataString);
        
        // Kodning muddati tugaganligini tekshirish
        if (Date.now() > resetData.expiresAt) {
          localStorage.removeItem(`reset_${emailOrPhone}`);
          reject(new Error(t('Auth.codeExpired', "Срок действия кода истёк. Запросите заново")));
          return;
        }

        // Kodni tekshirish
        if (resetData.code !== code) {
          reject(new Error(t('Auth.invalidCode', "Неверный код")));
          return;
        }

        resolve({
          success: true,
          message: t("Auth.codeVerified", "Код подтвержден"),
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
          reject(new Error(t('Auth.userNotFound', "Пользователь не найден")));
          return;
        }

        // Parol validatsiyasi
        if (!newPassword || newPassword.length < 6) {
          reject(new Error(t("Auth.passwordTooShort", 'Пароль должен содержать не менее 6 символов')));
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
          message: t("Auth.passwordUpdated", "Пароль успешно обновлён"),
          user: updatedUsers[userIndex]
        });
      }, 1000);
    });
  };

  // Yangi foydalanuvchini ro'yxatga olish (parolsiz)
  const registerUser = (userData) => {
    // console.log(userData)
    const newUser = {
      id: generateUniqueId(), // Unique ID
      ...userData,
      isVerified: false,
      isProfileCompleted: false,
      createdAt: new Date().toISOString(),
      // Default values
      fullName: null,
      password: null,
      avatar: null,
      bio: null,
      address: null,
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
        address: profileData.address,
        avatar: profileData.avatar,
        bio: profileData.bio,
        password: profileData.password,
        pushNotification: profileData.pushNotification,
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
    throw new Error(t('Auth.userNotFound', "Пользователь не найден"));
  };

  // Login qilish
  const login = async (emailOrPhone, password) => {
    const user = users.find(u =>
      u.emailOrPhone === emailOrPhone &&
      u.password === password 
      && u.isVerified &&
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
    throw new Error(t("Auth.invalidCredentials", "Email/телефон или пароль неверны"));
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
      type: targetUser.type || '',
      address: targetUser.address || '',
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
      throw new Error(t('Auth.userNotFound', "Пользователь не найден"));
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
  const changePassword = async (passwordData) => {
    const userIndex = users.findIndex(user => user.emailOrPhone === passwordData.emailOrPhone);
    if (userIndex === -1) {
      throw new Error(t('Auth.userNotFound', "Пользователь не найден"));
    }

    if (passwordData.newPassword.length < 6) {
      throw new Error(t("Auth.newPasswordTooShort", "Новый пароль должен содержать не менее 6 символов"));
    }

    const updatedUsers = [...users];
    updatedUsers[userIndex] = {
      ...updatedUsers[userIndex],
      password: passwordData.newPassword,
      passwordChangedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setUsers(updatedUsers);
    localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));

    // Agar current user ni update qilayotgan bo'lsak
    if (currentUser && currentUser.emailOrPhone === passwordData.emailOrPhone) {
      setCurrentUser(updatedUsers[userIndex]);
      localStorage.setItem('currentUser', JSON.stringify(updatedUsers[userIndex]));
    }

    return updatedUsers[userIndex];
  };

  // Profilni o'chirish
  const deleteUserProfile = async (userId, password) => {
    const userIndex = users.findIndex(user => user.id === userId);
    if (userIndex === -1) {
      throw new Error(t('Auth.userNotFound', "Пользователь не найден"));
    }

    const user = users[userIndex];
    if (user.password !== password) {
      throw new Error(t("Auth.incorrectPassword", 'Неверный пароль'));
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
    isUserExists, // ISHLATILMAGAN
    registerUser,
    verifyUser,
    updateUserProfile,
    login,
    logout,
    
    // Password reset functions
    getUserByEmailOrPhone, // ISHLATILMAGAN
    sendPasswordResetCode,
    verifyResetCode,
    resetPassword,
    
    // User management
    findUser,  // ISHLATILMAGAN
    findUserById, // ISHLATILMAGAN
    getUserProfile, 
    editUserProfile,
    changePassword,
    deleteUserProfile, // ISHLATILMAGAN
    
    // Admin functions  ISHLATILMAGAN
    getAllUsers,
    getUserStats,
    
    // Utility ISHLATILMAGAN
    clearAllData
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};