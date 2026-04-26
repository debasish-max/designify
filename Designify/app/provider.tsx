"use client"
import { UserDetailContext } from '@/context/UserDetailContext';
import React, { useState } from 'react'
import Header, { User, } from './_components/Header';
import { CartContext } from '@/context/CartContext';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { usePathname } from 'next/navigation';

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