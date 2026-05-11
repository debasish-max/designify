"use client"
import { UserDetailContext } from '@/context/UserDetailContext';
import React, { useState, useEffect } from 'react'
import Header, { User, } from './_components/Header';
import { CartContext } from '@/context/CartContext';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { usePathname } from 'next/navigation';
import axios from 'axios';

import { socket } from '@/lib/socket';

function Provider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [userDetail, setUserDetail] = useState<User | undefined>(undefined);
  const [cart, setCart] = useState([]);
  const pathname = usePathname();
  const isAdminPath = pathname.startsWith('/admin');
  const isCustomizePath = pathname.includes('/customize');
  const shouldApplyPadding = !isAdminPath && !isCustomizePath;

  useEffect(() => {
    if (userDetail?.email) {
      if (!socket.connected) {
        socket.connect();
      }
      socket.emit('user_connected', userDetail.email);
    }

    return () => {
      // Only disconnect on unmount if we want to be strict, 
      // but in Dev mode this triggers on every HMR.
      // Let's keep it for production safety.
    }
  }, [userDetail?.email]);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const tokenStr = localStorage.getItem('tokenResponse');
        if (tokenStr) {
          const tokenResponse = JSON.parse(tokenStr);
          if (tokenResponse?.access_token) {
            const userInfo = await axios.get(
              'https://www.googleapis.com/oauth2/v3/userinfo',
              { headers: { Authorization: 'Bearer ' + tokenResponse.access_token } }
            );
            const dbUser = await axios.post('/api/users', {
              name: userInfo.data.name,
              email: userInfo.data.email,
              picture: userInfo.data.picture
            });
            setUserDetail(dbUser.data);
            
            // Load cart
            const cartResult = await axios.get('/api/cart?email=' + userInfo.data.email);
            setCart(cartResult.data);
            return;
          }
        }
      } catch (e: any) {
        if (e.response?.status === 401) {
          localStorage.removeItem('tokenResponse');
          console.warn('Session expired. Token removed.');
        } else {
          console.error('Auth initialization error:', e);
        }
      }
      setUserDetail(null as any); // Set to null to indicate loaded but not authenticated
    };

    if (typeof window !== 'undefined') {
      initAuth();
    }
  }, []);

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
      <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
        <CartContext.Provider value={{ cart, setCart }}>
          <div className={shouldApplyPadding ? "px-10 md:px-20 lg:px-36" : ""}>
             {/* Header - Hide on Admin or Customize Routes */}
            {!isAdminPath && !isCustomizePath && <Header />}
            {children}
          </div>
        </CartContext.Provider>
      </UserDetailContext.Provider>
    </GoogleOAuthProvider>
  )
}

export default Provider