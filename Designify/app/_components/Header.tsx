"use client"
import { Button } from '@/components/ui/Button'
import { CartContext } from '@/context/CartContext'
import { UserDetailContext } from '@/context/UserDetailContext'
import { useGoogleLogin } from '@react-oauth/google'
import axios from 'axios'
import { ShoppingCart, Search, X, Loader2, Menu, Package } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from "framer-motion"

import React, { useContext, useEffect, useRef, useState, useCallback } from 'react'
import { toast } from 'react-toastify'
import { Product } from './PopularProducts'

const menu = [
  {
    id: 1,
    name: 'Home',
    path: '/'
  },
  {
    id: 2,
    name: 'Products',
    path: '/products'
  },
  {
    id: 3,
    name: 'About Us',
    path: '/about'
  },
  {
    id: 4,
    name: 'Contact Us',
    path: '/contact'
  }
]

export type User = {
  email: string,
  name: string,
  picture: string
}

function Header() {

  const [user, setUser] = useState<User>();
  const { userDetail, setUserDetail } = useContext(UserDetailContext)
  const { cart, setCart } = useContext(CartContext);
  const [openProfile, setOpenProfile] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouter()

  // Search state
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Product[]>([])
  const [showResults, setShowResults] = useState(false)
  const [searching, setSearching] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (typeof window !== undefined) {
      try {
        //@ts-ignore
        const tokenResponse = JSON.parse(localStorage?.getItem('tokenResponse') ?? '{}');
        if (tokenResponse) {
          GetUserProfile(tokenResponse?.access_token);
        }
      }
      catch (e) { }
    }
  }, [])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      setOpenProfile(false)
      setMobileMenuOpen(false)
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowResults(false)
      }
    }

    window.addEventListener("click", handleClickOutside)

    return () => {
      window.removeEventListener("click", handleClickOutside)
    }
  }, [openProfile])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }

    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  // Debounced search
  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value)

    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    if (!value.trim()) {
      setSearchResults([])
      setShowResults(false)
      setSearching(false)
      return
    }

    setSearching(true)
    debounceRef.current = setTimeout(async () => {
      try {
        const result = await axios.get(`/api/products?search=${encodeURIComponent(value.trim())}`)
        const data = result.data || []
        setSearchResults(data.slice(0, 5))
        setShowResults(true)
      } catch (e) {
        console.error('Search error:', e)
        setSearchResults([])
      } finally {
        setSearching(false)
      }
    }, 300)
  }, [])

  const handleSearchSubmit = (e: React.FormEvent | React.KeyboardEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      setShowResults(false)
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setShowResults(false)
      setSearchQuery('')
    } else if (e.key === 'Enter') {
      handleSearchSubmit(e)
    }
  }

  const clearSearch = () => {
    setSearchQuery('')
    setSearchResults([])
    setShowResults(false)
  }

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      console.log(tokenResponse);
      localStorage.setItem('tokenResponse', JSON.stringify(tokenResponse))
      await GetUserProfile(tokenResponse.access_token, true);
    },
    onError: errorResponse => console.log(errorResponse),
  });

  const GetUserProfile = async (access_token: string, showToast = false) => {
    try {
      const userInfo = await axios.get(
        'https://www.googleapis.com/oauth2/v3/userinfo',
        { headers: { Authorization: 'Bearer ' + access_token } },
      );

      console.log(userInfo);
      const dbUser = await SaveNewUser(userInfo?.data)
      if (dbUser) {
        setUser(dbUser) // Sync local state
        setUserDetail(dbUser) // Sync global context
        
        if (dbUser.role === 'admin') {
          router.push('/admin')
        }

        if (showToast) {
          toast.success(`Welcome back, ${dbUser.name} 👋`, {
            position: "top-right",
            autoClose: 2000,
          })
        }
      }
    }
    catch (e) {
      localStorage.setItem('tokenResponse', '')
    }
  }

  const SaveNewUser = async (user: User) => {
    try {
      const result = await axios.post('/api/users', {
        name: user.name,
        email: user.email,
        picture: user.picture
      });
      return result.data;
    } catch (e) {
      console.error('Error saving user:', e);
      return null;
    }
  }

  useEffect(() => {
    user && GetCartList();
  }, [user])

  const GetCartList = async () => {
    const result = await axios.get('/api/cart?email=' + user?.email);
    console.log(result.data);
    setCart(result.data);
  }

  const handleLogout = () => {
    localStorage.removeItem('tokenResponse')
    setUser(undefined)
    setUserDetail(null)
    setCart([])
    toast.success("Logged out successfully 👋")
    setOpenProfile(false)
    router.push('/')
  }

  return (
    <div
      className={`sticky top-3 rounded-3xl z-50 flex items-center justify-between gap-4 px-6 py-3 transition-all duration-300
        ${scrolled
          ? "backdrop-blur-xl bg-white/60 shadow-md border-b border-white/20"
          : "bg-transparent"
        }`}
    >
      <Link href='/'>
        <Image src={'/ss.png'} alt='Logo' width={48} height={48} className='object-contain h-15 w-auto' />
      </Link>

      {/* ✅ Desktop nav — My Orders shown only when logged in */}
      <ul className='hidden md:flex gap-5 items-center'>
        {menu.map((item) => (
          <li key={item.id}>
            <Link href={item.path} className='cursor-pointer font-bold hover:text-red-400 transition'>
              {item.name}
            </Link>
          </li>
        ))}
      </ul>

      <div className='flex gap-3 items-center'>
        {/* Search Bar */}
        <div ref={searchRef} className='relative' onClick={(e) => e.stopPropagation()}>
          <form onSubmit={handleSearchSubmit} className='relative'>
            <div className='flex items-center gap-2 bg-gray-100/80 backdrop-blur-sm rounded-full px-3 py-2 border border-transparent focus-within:border-primary/30 focus-within:bg-white/90 focus-within:shadow-lg transition-all duration-300 w-9 focus-within:w-[200px] md:w-[180px] md:focus-within:w-[260px] overflow-hidden'>
              <Search className='w-4 h-4 text-gray-400 shrink-0' />
              <input
                type='text'
                placeholder='Search products...'
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                onFocus={() => { if (searchResults.length > 0) setShowResults(true) }}
                className='bg-transparent outline-none text-sm w-full placeholder:text-gray-400'
              />
              {searching && (
                <Loader2 className='w-4 h-4 text-gray-400 animate-spin shrink-0' />
              )}
              {searchQuery && !searching && (
                <button type='button' onClick={clearSearch} className='shrink-0 hover:text-primary transition'>
                  <X className='w-4 h-4 text-gray-400 hover:text-gray-600' />
                </button>
              )}
            </div>
          </form>

          {/* Search Results Dropdown */}
          <AnimatePresence>
            {showResults && searchResults.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className='absolute top-full mt-2 left-0 right-0 w-[300px] backdrop-blur-2xl bg-white/90 shadow-2xl rounded-2xl border border-white/40 overflow-hidden z-[60]'
              >
                {searchResults.map((product) => (
                  <Link
                    key={product.documentId}
                    href={`/product/${product.documentId}`}
                    onClick={() => {
                      setShowResults(false)
                      setSearchQuery('')
                    }}
                    className='flex items-center gap-3 px-4 py-3 hover:bg-primary/5 transition-colors border-b border-gray-100/50 last:border-b-0'
                  >
                    {product.productImage?.[0]?.url && (
                      <Image
                        src={product.productImage[0].url}
                        alt={product.title}
                        width={40}
                        height={40}
                        className='w-10 h-10 object-contain rounded-lg bg-gray-50 p-1 shrink-0'
                      />
                    )}
                    <div className='flex-1 min-w-0'>
                      <p className='text-sm font-medium truncate'>{product.title}</p>
                      {product.pricing && (
                        <p className='text-xs text-muted-foreground'>₹{product.pricing}</p>
                      )}
                    </div>
                  </Link>
                ))}
                <Link
                  href={`/products?search=${encodeURIComponent(searchQuery)}`}
                  onClick={() => {
                    setShowResults(false)
                    setSearchQuery('')
                  }}
                  className='block text-center text-sm text-primary font-medium py-2.5 hover:bg-primary/5 transition-colors border-t border-gray-200/50'
                >
                  View all results →
                </Link>
              </motion.div>
            )}
          </AnimatePresence>

          {/* No results message */}
          <AnimatePresence>
            {showResults && searchQuery && !searching && searchResults.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className='absolute top-full mt-2 left-0 right-0 w-[260px] backdrop-blur-2xl bg-white/90 shadow-2xl rounded-2xl border border-white/40 z-[60] p-4 text-center'
              >
                <p className='text-sm text-muted-foreground'>No products found for &quot;{searchQuery}&quot;</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Cart & Auth — desktop */}
        <Link href={'/carts'} className='hidden md:flex gap-2 items-center'>
          <ShoppingCart /> <span className='p-1 bg-gray-100 px-2 rounded-4xl'>{cart?.length ?? 0}</span>
        </Link>

        <div className='hidden md:block'>
          {!user
            ? <Button onClick={() => googleLogin()}>Sign In/Sign up</Button>
            : (
              <div className="relative">
                <Image
                  src={user?.picture}
                  alt={user.name}
                  width={37}
                  height={38}
                  className="rounded-full cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation()
                    setOpenProfile(!openProfile)
                  }}
                />

                {/* ✅ Profile dropdown — with My Orders */}
                <AnimatePresence>
                  {openProfile && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="absolute right-0 mt-2 w-48 backdrop-blur-2xl bg-white/50 shadow-2xl rounded-2xl border border-white/30 z-50 overflow-hidden"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="px-4 py-2.5 border-b border-gray-200/50 text-sm font-medium text-gray-800">
                        {user?.name}
                      </div>

                      {userDetail?.role === 'admin' && (
                        <Link
                          href='/admin'
                          onClick={() => setOpenProfile(false)}
                          className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-primary font-bold hover:bg-white/40 transition border-b border-gray-200/50"
                        >
                          <Package className='w-4 h-4' />
                          Admin Dashboard
                        </Link>
                      )}

                      <Link
                        href='/my-orders'
                        onClick={() => setOpenProfile(false)}
                        className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-white/40 transition border-b border-gray-200/50"
                      >
                        <Package className='w-4 h-4' />
                        My Orders
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-white/40 rounded-b-2xl transition"
                      >
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          }
        </div>

        {/* Mobile menu toggle */}
        <button
          className='md:hidden flex items-center justify-center'
          onClick={(e) => {
            e.stopPropagation()
            setMobileMenuOpen(!mobileMenuOpen)
          }}
        >
          {mobileMenuOpen ? <X className='w-6 h-6' /> : <Menu className='w-6 h-6' />}
        </button>
      </div>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className='absolute top-full left-0 right-0 mt-2 mx-3 flex flex-col gap-1 md:hidden backdrop-blur-2xl bg-white/90 shadow-2xl rounded-2xl border border-white/40 z-[60] p-3'
            onClick={(e) => e.stopPropagation()}
          >
            {menu.map((item) => (
              <Link
                key={item.id}
                href={item.path}
                className='block px-4 py-2 font-bold hover:text-red-400 hover:bg-primary/5 rounded-xl transition'
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}

            {/* ✅ Admin Panel in mobile menu */}
            {userDetail?.role === 'admin' && (
              <Link
                href='/admin'
                className='flex items-center gap-2 px-4 py-2 font-bold text-primary hover:bg-primary/5 rounded-xl transition'
                onClick={() => setMobileMenuOpen(false)}
              >
                <Package className='w-4 h-4' />
                Admin Dashboard
              </Link>
            )}

            {/* ✅ My Orders in mobile menu — only when logged in */}
            {user && (
              <Link
                href='/my-orders'
                className='flex items-center gap-2 px-4 py-2 font-bold hover:text-red-400 hover:bg-primary/5 rounded-xl transition'
                onClick={() => setMobileMenuOpen(false)}
              >
                <Package className='w-4 h-4' />
                My Orders
              </Link>
            )}

            <div className='border-t border-gray-200/50 mt-1 pt-2 flex items-center justify-between px-2'>
              <Link href={'/carts'} className='flex gap-2 items-center px-2 py-1' onClick={() => setMobileMenuOpen(false)}>
                <ShoppingCart className='w-5 h-5' /> <span className='p-1 bg-gray-100 px-2 rounded-4xl'>{cart?.length ?? 0}</span>
              </Link>
              {!user
                ? <Button onClick={() => { googleLogin(); setMobileMenuOpen(false) }}>Sign In/Sign up</Button>
                : <div className='flex items-center gap-2'>
                  <span className='text-sm text-gray-700'>{user?.name}</span>
                  <button onClick={handleLogout} className='text-sm text-red-500 px-3 py-1 rounded-xl hover:bg-red-50 transition'>Logout</button>
                </div>
              }
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Header