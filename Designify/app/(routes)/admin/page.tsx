"use client"
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { 
    DollarSign, 
    Package, 
    ShoppingCart, 
    ArrowUpRight, 
    ArrowDownRight, 
    MoreVertical,
    Clock,
    User,
    CheckCircle2
} from 'lucide-react'
import { 
    AreaChart, 
    Area, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts'

function AdminDashboard() {
    const [stats, setStats] = useState<any>({
        totalRevenue: 0,
        totalOrders: 0,
        totalProducts: 0,
        recentOrders: [],
        monthlyRevenue: [],
        categoryDistribution: []
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        GetStats()
    }, [])

    const GetStats = async () => {
        try {
            const result = await axios.get('/api/admin/stats')
            setStats(result.data)
        } catch (e) {
            console.error('Stats error:', e)
        } finally {
            setLoading(false)
        }
    }

    const StatCard = ({ title, value, icon: Icon, trend, trendValue, isPositive }: any) => (
        <div className="bg-white p-7 rounded-[30px] border border-gray-100 shadow-sm flex flex-col gap-4 relative overflow-hidden group hover:shadow-xl hover:shadow-primary/5 transition-all">
            <div className="flex justify-between items-start relative z-10">
                <div className="p-3.5 rounded-2xl bg-gray-50 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                    <Icon size={24} />
                </div>
                {trend && (
                    <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg ${
                        isPositive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                    }`}>
                        {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                        {trendValue}%
                    </div>
                )}
            </div>
            <div className="relative z-10">
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest leading-none mb-2">{title}</p>
                <div className="flex items-baseline gap-2">
                   <h3 className="text-3xl font-black text-gray-900 tracking-tight">{value}</h3>
                   <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">vs last month</span>
                </div>
            </div>
            {/* Background Decoration */}
            <Icon size={120} className="absolute -bottom-6 -right-6 text-gray-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        </div>
    )

    return (
        <div className="flex flex-col gap-10 max-w-[1600px] mx-auto pb-12">
            {/* Greeting Header */}
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-sm font-black text-primary uppercase tracking-[0.3em] mb-2">Platform Overview</h2>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tighter">Business Dashboard</h1>
                </div>
                <div className="flex gap-3 bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100">
                    <button className="px-5 py-2.5 rounded-xl bg-gray-50 text-sm font-bold text-gray-600 hover:bg-gray-100 transition">Weekly</button>
                    <button className="px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-bold shadow-md shadow-primary/20">Monthly</button>
                    <button className="px-5 py-2.5 rounded-xl bg-gray-50 text-sm font-bold text-gray-600 hover:bg-gray-100 transition">Yearly</button>
                </div>
            </div>

            {/* Statistics Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-7">
                <StatCard title="Overall Revenue" value={`₹${stats.totalRevenue.toLocaleString()}`} icon={DollarSign} trend trendValue="24" isPositive />
                <StatCard title="Active Orders" value={stats.totalOrders} icon={ShoppingCart} trend trendValue="12" isPositive />
                <StatCard title="Total Inventory" value={stats.totalProducts} icon={Package} />
                <StatCard title="Store Visitors" value="1,248" icon={User} trend trendValue="8" isPositive={false} />
            </div>

            {/* Visualization Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Revenue Graph */}
                <div className="xl:col-span-2 bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm flex flex-col gap-6">
                    <div className="flex justify-between items-center px-2">
                        <div>
                            <h3 className="text-xl font-black text-gray-900 tracking-tight">Revenue Growth</h3>
                            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mt-1">2026 Performance Metrics</p>
                        </div>
                        <button className="p-3 hover:bg-gray-50 rounded-xl transition text-gray-400"><MoreVertical size={20} /></button>
                    </div>
                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={stats.monthlyRevenue}>
                                <defs>
                                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#4318FF" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#4318FF" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12, fontWeight: 700}} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12, fontWeight: 700}} tickFormatter={(value) => `₹${value}`} />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px' }}
                                    itemStyle={{ fontWeight: 800, color: '#4318FF' }}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="#4318FF" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Categories Pie */}
                <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm flex flex-col gap-8">
                    <div className="flex justify-between items-center px-2">
                         <h3 className="text-xl font-black text-gray-900 tracking-tight">Sales by Category</h3>
                         <button className="p-3 hover:bg-gray-50 rounded-xl transition text-gray-400"><MoreVertical size={20} /></button>
                    </div>
                    
                    <div className="h-[250px] relative">
                         <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={stats.categoryDistribution}
                                    innerRadius={70}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {stats.categoryDistribution.map((entry: any, index: number) => (
                                        <Cell key={`cell-${index}`} fill={['#4318FF', '#6AD2FF', '#EFF4FB', '#FFB547', '#FF5B5B'][index % 5]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                         </ResponsiveContainer>
                         <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Total Categories</p>
                             <p className="text-4xl font-black text-gray-900 leading-none">{stats.categoryDistribution.length}</p>
                         </div>
                    </div>

                    <div className="flex flex-col gap-4 mt-auto">
                        {stats.categoryDistribution.map((item: any, i: number) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: ['#4318FF', '#6AD2FF', '#EFF4FB', '#FFB547', '#FF5B5B'][i % 5] }}></div>
                                    <span className="text-sm font-bold text-gray-600 truncate max-w-[120px]">{item.name}</span>
                                </div>
                                <span className="font-black text-gray-900">{item.value} items</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Recent Orders Table */}
            <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-9 border-b border-gray-100 flex justify-between items-center">
                    <div>
                        <h3 className="text-2xl font-black text-gray-900 tracking-tight">Recent Sales Activity</h3>
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mt-1">Real-time order tracking</p>
                    </div>
                    <button className="px-6 py-3 bg-primary text-white rounded-2xl font-bold text-sm shadow-lg shadow-primary/20 hover:-translate-y-0.5 transition active:scale-95">Download CSV</button>
                </div>
                
                <div className="overflow-x-auto min-w-[800px]">
                    <table className="w-full text-left">
                        <thead className="bg-[#FAFBFE] text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">
                            <tr>
                                <th className="px-10 py-6 border-b border-gray-50">Transaction ID</th>
                                <th className="px-10 py-6 border-b border-gray-50">Customer</th>
                                <th className="px-10 py-6 border-b border-gray-50">Timeline</th>
                                <th className="px-10 py-6 border-b border-gray-50">Amount</th>
                                <th className="px-10 py-6 border-b border-gray-50">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {stats.recentOrders.length > 0 ? stats.recentOrders.map((order: any) => (
                                <tr key={order.id} className="group hover:bg-primary/5 transition-colors cursor-pointer">
                                    <td className="px-10 py-7">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2.5 bg-primary/10 text-primary rounded-xl">
                                                <ShoppingCart size={18} />
                                            </div>
                                            <span className="font-black text-gray-900 tracking-tight">#ORD-{order.id}</span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-7">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-gray-900 text-sm">{order.name}</span>
                                            <span className="text-xs text-gray-400 font-bold tracking-tight">{order.userEmail}</span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-7">
                                        <div className="flex items-center gap-2 text-gray-500 font-bold text-xs uppercase tracking-wider">
                                            <Clock size={14} className="text-gray-300" />
                                            {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                                        </div>
                                    </td>
                                    <td className="px-10 py-7">
                                        <span className="font-black text-gray-900 text-lg">₹{order.totalAmount}</span>
                                    </td>
                                    <td className="px-10 py-7">
                                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                                            order.status === 'delivered' 
                                            ? 'bg-green-50 text-green-600' 
                                            : 'bg-orange-50 text-orange-600'
                                        }`}>
                                            {order.status === 'delivered' ? <CheckCircle2 size={14} /> : <Clock size={14} />}
                                            {order.status}
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={5} className="px-10 py-20 text-center flex flex-col items-center justify-center gap-4 text-gray-300">
                                        <Package size={48} className="opacity-10" />
                                        <p className="font-black uppercase tracking-widest text-xs">No active transactions found</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default AdminDashboard
