"use client"
import React, { useContext, useEffect } from 'react'
import { UserDetailContext } from '@/context/UserDetailContext'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { 
    LayoutDashboard, 
    ShoppingBag, 
    ShoppingCart, 
    User, 
    ArrowLeft, 
    Layers, 
    Settings, 
    ChevronRight,
    Bell,
    Search as SearchIcon
} from 'lucide-react'
import Image from 'next/image'

function AdminLayout({ children }: { children: React.ReactNode }) {
    const { userDetail } = useContext(UserDetailContext)
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        const allowedAdmins = ['hazarikadebasish182@gmail.com'];
        if (userDetail && userDetail.role !== 'admin' && !allowedAdmins.includes(userDetail.email)) {
            router.push('/')
        }
    }, [userDetail, router])

    if (!userDetail) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gray-50 text-gray-500 animate-pulse">
                <ShoppingBag size={48} className="mb-4 opacity-20" />
                <p className="font-medium tracking-wide uppercase text-xs">Loading Admin Panel...</p>
            </div>
        )
    }

    if (userDetail.role !== 'admin') return null

    const NavItem = ({ href, icon: Icon, label }: any) => {
        const isActive = pathname === href
        return (
            <Link 
                href={href} 
                className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${
                    isActive 
                    ? 'bg-primary text-white shadow-lg shadow-primary/25' 
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
            >
                <div className="flex items-center gap-3">
                    <Icon size={20} className={isActive ? 'text-white' : 'group-hover:text-primary'} />
                    <span className="font-semibold text-sm">{label}</span>
                </div>
                <ChevronRight size={14} className={`opacity-0 transition-opacity ${isActive ? 'opacity-50' : 'group-hover:opacity-100'}`} />
            </Link>
        )
    }

    const SectionHeader = ({ label }: { label: string }) => (
        <h4 className="px-4 mt-6 mb-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">
            {label}
        </h4>
    )

    return (
        <div className="flex h-screen bg-[#F4F7FE]">
            {/* Sidebar */}
            <aside className="w-72 bg-white border-r border-gray-100 flex flex-col p-6 overflow-y-auto no-scrollbar">
                {/* Logo */}
                <div className="flex items-center gap-3 px-2 mb-8">
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                        <ShoppingBag className="text-white" size={24} />
                    </div>
                    <div>
                        <h1 className="font-black text-xl tracking-tight text-gray-900 leading-none">Designify</h1>
                        <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Admin Hub</span>
                    </div>
                </div>

                {/* Profile Widget */}
                <div className="bg-gray-50 rounded-2xl p-4 mb-8 flex items-center gap-3 border border-gray-100">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 border-2 border-white overflow-hidden relative shadow-sm">
                         {userDetail.picture ? (
                            <Image src={userDetail.picture} alt="Admin" fill className="object-cover" />
                         ) : (
                             <div className="w-full h-full flex items-center justify-center text-primary font-bold">
                                 {userDetail.name?.[0]}
                             </div>
                         )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm text-gray-900 truncate tracking-tight">{userDetail.name}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Store Manager</p>
                    </div>
                    <button className="p-2 hover:bg-white rounded-lg transition text-gray-400 hover:text-primary shadow-sm border border-transparent hover:border-gray-100">
                        <Settings size={16} />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex flex-col gap-1.5 flex-1">
                    <SectionHeader label="Main Dashboard" />
                    <NavItem href="/admin" icon={LayoutDashboard} label="Dashboard" />
                    
                    <SectionHeader label="Inventory Management" />
                    <NavItem href="/admin/products" icon={ShoppingBag} label="Products" />
                    <NavItem href="/admin/categories" icon={Layers} label="Categories" />
                    
                    <SectionHeader label="Sales & Support" />
                    <NavItem href="/admin/orders" icon={ShoppingCart} label="Orders" />
                    <NavItem href="/admin/users" icon={User} label="User Management" />
                </nav>

                {/* Footer Controls */}
                <div className="mt-8 pt-6 border-t border-gray-100">
                    <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 hover:text-red-600 transition group text-gray-500 font-bold text-sm">
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> 
                        <span>Exit Admin</span>
                    </Link>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Top Navbar */}
                <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 px-8 flex items-center justify-between sticky top-0 z-10">
                    <div className="flex items-center gap-4 bg-gray-100/50 px-4 py-2.5 rounded-2xl border border-gray-100 w-96 group focus-within:bg-white transition-all focus-within:border-primary focus-within:ring-4 ring-primary/5">
                        <SearchIcon size={18} className="text-gray-400 group-focus-within:text-primary transition" />
                        <input 
                            type="text" 
                            placeholder="Search everything..." 
                            className="bg-transparent border-none outline-none text-sm w-full font-medium placeholder:text-gray-400"
                        />
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="p-3 text-gray-400 hover:bg-gray-100 rounded-xl transition relative">
                            <Bell size={20} />
                            <span className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>
                        <div className="w-px h-8 bg-gray-100 ml-2"></div>
                        <div className="flex items-center gap-3 pl-2">
                             <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold text-gray-900 tracking-tight">{userDetail.name}</p>
                                <p className="text-[10px] font-bold text-green-500 uppercase tracking-widest flex items-center justify-end gap-1">
                                    <span className="w-1 h-1 bg-green-500 rounded-full animate-pulse"></span> Online
                                </p>
                             </div>
                             <div className="w-10 h-10 rounded-xl bg-gray-100 border border-gray-100 overflow-hidden relative shadow-sm ml-2">
                                {userDetail.picture ? (
                                    <Image src={userDetail.picture} alt="Profile" fill className="object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-primary font-bold text-xs">
                                        {userDetail.name?.[0]}
                                    </div>
                                )}
                             </div>
                        </div>
                    </div>
                </header>

                {/* Scrollable Content Container */}
                <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    {children}
                </main>
            </div>
        </div>
    )
}

export default AdminLayout
