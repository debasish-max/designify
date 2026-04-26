"use client"
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { 
    Search, 
    Package, 
    MapPin, 
    Phone, 
    User as UserIcon, 
    Calendar, 
    Filter, 
    ArrowUpDown, 
    MoreHorizontal,
    Navigation,
    CreditCard,
    CheckCircle2,
    Clock,
    Truck
} from 'lucide-react'
import { toast } from 'react-toastify'

function AdminOrders() {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('all')

    useEffect(() => {
        GetOrders()
    }, [])

    const GetOrders = async () => {
        try {
            const result = await axios.get('/api/admin/orders')
            setOrders(result.data)
        } catch (e) {
            toast.error("Failed to load orders")
        } finally {
            setLoading(false)
        }
    }

    const OrderCard = ({ order }: any) => (
        <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 group">
            {/* Header / ID Section */}
            <div className="p-8 bg-gray-50/50 border-b border-gray-100 flex flex-wrap justify-between items-center group-hover:bg-primary/5 transition-colors">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm border border-gray-100/50 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                        <Package size={24} />
                    </div>
                    <div>
                        <span className="text-[10px] font-black text-primary bg-primary/10 px-3 py-1 rounded-full tracking-widest uppercase mb-1 inline-block">Order Group</span>
                        <h3 className="text-xl font-black text-gray-900 tracking-tighter">ORD-{order.id.toString().padStart(6, '0')}</h3>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <div className="text-right hidden sm:block">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Placement Date</p>
                        <p className="text-sm font-bold text-gray-900 flex items-center gap-2 justify-end">
                            <Calendar size={14} className="text-primary" /> {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                    <button className="p-4 hover:bg-white rounded-2xl transition text-gray-400 hover:text-primary border border-transparent hover:border-gray-100 shadow-sm">
                        <MoreHorizontal size={20} />
                    </button>
                </div>
            </div>
            
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {/* Customer Details */}
                <div className="flex flex-col gap-5">
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                        <div className="w-1 h-3 bg-primary rounded-full"></div> Customer Intelligence
                    </h4>
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-4">
                            <div className="p-2.5 bg-gray-50 rounded-xl text-gray-400 group-hover:text-primary transition-colors">
                                <UserIcon size={20} />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-black text-gray-900 text-lg tracking-tight leading-none mb-1">{order.name}</span>
                                <span className="text-xs font-bold text-gray-400 tracking-tight">{order.userEmail}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="p-2.5 bg-gray-50 rounded-xl text-gray-400 mt-1">
                                <Phone size={20} />
                            </div>
                            <span className="font-bold text-gray-700 text-sm tracking-tight">{order.phone}</span>
                        </div>
                    </div>
                </div>

                {/* Logistics Info */}
                <div className="flex flex-col gap-5">
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                        <div className="w-1 h-3 bg-green-400 rounded-full"></div> Logistics & Shipping
                    </h4>
                    <div className="flex items-start gap-4 p-5 bg-gray-50/50 rounded-2xl border border-gray-100/50">
                        <div className="p-2.5 bg-white rounded-xl text-green-500 shadow-sm">
                            <MapPin size={22} />
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-sm font-black text-gray-900 tracking-tight leading-snug">{order.address}</span>
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-white border border-gray-100 px-2 py-0.5 rounded-md self-start mt-1">Zip: {order.zip}</span>
                        </div>
                    </div>
                </div>

                {/* Financial Summary */}
                <div className="flex flex-col gap-5">
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                        <div className="w-1 h-3 bg-orange-400 rounded-full"></div> Revenue Summary
                    </h4>
                    <div className="bg-[#1B254B] p-6 rounded-[30px] flex flex-col gap-5 shadow-xl shadow-gray-200">
                        <div className="flex justify-between items-start">
                            <div className="p-3 bg-white/10 rounded-2xl text-white/50 backdrop-blur-md">
                                <CreditCard size={24} />
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">{order.paymentMethod}</p>
                                <p className={`inline-flex items-center gap-1.5 px-3 py-1 mt-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                                    order.status === 'delivered' ? 'bg-green-500/20 text-green-400' : 'bg-orange-500/20 text-orange-400'
                                }`}>
                                    {order.status === 'delivered' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                                    {order.status}
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <p className="text-white/40 text-[10px] font-black uppercase tracking-widest leading-none mb-1">Total Receivable</p>
                            <h5 className="text-3xl font-black text-white tracking-tighter leading-none">₹{order.totalAmount.toLocaleString()}</h5>
                        </div>
                    </div>
                </div>
            </div>

            {/* Expansion / Analytics Footer */}
            <div className="px-8 py-5 bg-gray-50/10 border-t border-gray-100 flex justify-between items-center group-hover:bg-primary/5 transition-colors">
                <div className="flex items-center gap-8">
                     <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                         <Truck size={14} className="text-blue-500" /> Standard Delivery
                     </div>
                     <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest border-l border-gray-200 pl-8">
                         <CreditCard size={14} className="text-purple-500" /> Transaction ID: {order.paymentId || 'N/A'}
                     </div>
                </div>
                <button className="flex items-center gap-2 text-xs font-black text-primary uppercase tracking-widest hover:translate-x-1 transition-transform">
                    Advanced Details <Navigation size={14} />
                </button>
            </div>
        </div>
    )

    return (
        <div className="flex flex-col gap-8 max-w-[1600px] mx-auto pb-12">
            {/* Header Section */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 px-2">
                <div>
                    <h2 className="text-sm font-black text-primary uppercase tracking-[0.3em] mb-2">Order Intelligence</h2>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tighter">Customer Transactions</h1>
                </div>
                <div className="flex gap-4">
                    <button className="flex items-center gap-3 px-6 py-4 bg-white border border-gray-100 rounded-2xl text-sm font-black tracking-tight text-gray-600 hover:shadow-lg hover:shadow-gray-100 transition duration-300">
                        <Filter size={20} /> Advanced Filters
                    </button>
                    <button className="flex items-center gap-3 px-8 py-4 bg-primary text-white rounded-2xl text-sm font-black shadow-xl shadow-primary/20 hover:-translate-y-1 transition duration-300">
                        Export Activity
                    </button>
                </div>
            </header>

            {/* Quick Search & Sort */}
            <div className="bg-white p-6 rounded-[35px] border border-gray-100 shadow-sm flex flex-col md:flex-row gap-6 items-center justify-between mx-2">
                <div className="flex items-center gap-4 bg-gray-50 px-6 py-3.5 rounded-2xl border border-gray-100 w-full md:w-[450px] group focus-within:bg-white focus-within:ring-4 ring-primary/5 transition-all">
                    <Search size={22} className="text-gray-400 group-focus-within:text-primary transition" />
                    <input type="text" placeholder="Search by Order ID, Customer Name, or Email..." className="bg-transparent border-none outline-none text-sm font-bold w-full placeholder:text-gray-300" />
                </div>
                <div className="flex items-center gap-6 w-full md:w-auto">
                    <div className="flex items-center gap-3">
                         <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Status:</span>
                         <select 
                            value={filter} 
                            onChange={(e) => setFilter(e.target.value)}
                            className="bg-gray-50 border border-gray-100 px-4 py-2.5 rounded-xl text-sm font-bold text-gray-700 outline-none focus:ring-2 ring-primary/20"
                         >
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="delivered">Delivered</option>
                         </select>
                    </div>
                </div>
            </div>

            {/* Order Grid / List */}
            <div className="flex flex-col gap-8 px-2 mt-4 transition-all duration-500">
                {loading ? (
                    <div className="flex flex-col items-center justify-center p-32 text-gray-400 bg-white rounded-[40px] border border-dashed border-gray-200">
                        <Package size={64} className="animate-bounce mb-6 opacity-5" />
                        <p className="font-black uppercase tracking-[0.2em] text-sm">Aggregating Transaction Flows...</p>
                    </div>
                ) : orders.length > 0 ? (
                    orders.map((order: any) => <OrderCard key={order.id} order={order} />)
                ) : (
                    <div className="flex flex-col items-center justify-center p-32 text-gray-400 bg-white rounded-[40px] border border-dashed border-gray-200">
                        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-8">
                             <Package size={48} className="opacity-10" />
                        </div>
                        <h3 className="font-black text-2xl text-gray-900 tracking-tight mb-2">No Transaction History</h3>
                        <p className="font-bold text-sm text-gray-400 uppercase tracking-widest">Awaiting first customer purchase</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default AdminOrders
