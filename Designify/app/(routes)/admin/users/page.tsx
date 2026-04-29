"use client"
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {
    User,
    Mail,
    Shield,
    UserCheck,
    Search,
    Loader2,
    ArrowUpDown,
    MoreHorizontal,
    Globe,
    Calendar
} from 'lucide-react'
import Image from 'next/image'
import { socket } from '@/lib/socket'

function AdminUsers() {
    const [users, setUsers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [sortBy, setSortBy] = useState('latest')
    const [onlineEmails, setOnlineEmails] = useState<string[]>([])

    useEffect(() => {
        socket.on('presence_update', (emails: string[]) => {
            setOnlineEmails(emails)
        })

        socket.emit('get_presence')

        return () => {
            socket.off('presence_update')
        }
    }, [])

    useEffect(() => {
        GetUsers()
    }, [])

    const GetUsers = async () => {
        try {
            const result = await axios.get('/api/users')
            setUsers(result.data)
        } catch (e) {
            console.error('Fetch users error:', e)
        } finally {
            setLoading(false)
        }
    }

    const filteredUsers = users.filter((u: any) => {
        const query = searchQuery.toLowerCase();
        return u.name.toLowerCase().includes(query) ||
            u.email.toLowerCase().includes(query) ||
            u.role.toLowerCase().includes(query);
    }).sort((a: any, b: any) => {
        if (sortBy === 'latest') return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        if (sortBy === 'oldest') return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        return 0;
    });

    return (
        <div className="flex flex-col gap-8 max-w-[1600px] mx-auto pb-12">
            {/* Header Section */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 px-2">
                <div>
                    <h2 className="text-sm font-black text-primary uppercase tracking-[0.3em] mb-2">Member Control</h2>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tighter">User Management</h1>
                </div>
                <div className="flex gap-4">
                    <div className="bg-white px-6 py-4 rounded-2xl border border-gray-100 flex items-center gap-3 shadow-sm">
                        <UserCheck size={20} className="text-green-500" />
                        <span className="text-sm font-black text-gray-900">{users.length} Active Members</span>
                    </div>
                </div>
            </header>

            {/* Quick Search Bar */}
            <div className="bg-white p-6 rounded-[35px] border border-gray-100 shadow-sm flex flex-col md:flex-row gap-6 items-center justify-between mx-2">
                <div className="flex items-center gap-4 bg-gray-50 px-6 py-3.5 rounded-2xl border border-gray-100 w-full md:w-[450px] group focus-within:bg-white focus-within:ring-4 ring-primary/5 transition-all">
                    <Search size={22} className="text-gray-400 group-focus-within:text-primary transition" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by name, email, or role..."
                        className="bg-transparent border-none outline-none text-sm font-bold w-full placeholder:text-gray-300"
                    />
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setSortBy(prev => prev === 'latest' ? 'oldest' : prev === 'oldest' ? 'name' : 'latest')}
                        className="flex items-center gap-2 px-5 py-3 bg-white border border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-primary transition"
                    >
                        <ArrowUpDown size={14} /> Sort by {sortBy}
                    </button>
                </div>
            </div>

            {/* User Table */}
            <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden mx-2">
                <div className="overflow-x-auto min-w-[900px]">
                    <table className="w-full text-left">
                        <thead className="bg-[#FAFBFE] text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">
                            <tr>
                                <th className="px-10 py-6 border-b border-gray-50">Profile Identity</th>
                                <th className="px-10 py-6 border-b border-gray-50">Email Communication</th>
                                <th className="px-10 py-6 border-b border-gray-50">Account Role</th>
                                <th className="px-10 py-6 border-b border-gray-50">Join Date</th>
                                <th className="px-10 py-6 border-b border-gray-50 text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-10 py-32 text-center text-gray-300">
                                        <Loader2 className="w-10 h-10 animate-spin mx-auto mb-4 opacity-20" />
                                        <p className="font-black uppercase tracking-widest text-xs">Syncing Member Directory...</p>
                                    </td>
                                </tr>
                            ) : filteredUsers.length > 0 ? filteredUsers.map((user: any) => (
                                <tr key={user.id} className="group hover:bg-primary/5 transition-colors">
                                    <td className="px-10 py-7">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden relative shadow-inner">
                                                {user.picture ? (
                                                    <Image src={user.picture} alt={user.name} fill className="object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center font-black text-gray-300">{user.name?.[0]}</div>
                                                )}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-black text-gray-900 text-lg tracking-tight leading-none mb-1">{user.name}</span>
                                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5"><Globe size={10} /> Verified ID</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-7">
                                        <div className="flex items-center gap-2 group/email">
                                            <Mail size={14} className="text-gray-300 group-hover/email:text-primary transition-colors" />
                                            <span className="font-bold text-gray-600 text-sm tracking-tight">{user.email}</span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-7">
                                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${user.role === 'admin'
                                                ? 'bg-purple-50 text-purple-600 border border-purple-100'
                                                : 'bg-blue-50 text-blue-600 border border-blue-100'
                                            }`}>
                                            <Shield size={12} className={user.role === 'admin' ? 'animate-pulse' : ''} />
                                            {user.role}
                                        </div>
                                    </td>
                                    <td className="px-10 py-7">
                                        <div className="flex flex-col text-gray-500 font-bold text-xs uppercase tracking-tight">
                                            <div className="flex items-center gap-2 text-gray-400 mb-1"><Calendar size={12} /> Creation</div>
                                            {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Historical User'}
                                        </div>
                                    </td>
                                    <td className="px-10 py-7 text-right">
                                        <span className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest ${onlineEmails.includes(user.email)
                                                ? 'bg-green-50 text-green-600 animate-pulse'
                                                : 'bg-gray-100 text-gray-400'
                                            }`}>
                                            {onlineEmails.includes(user.email) ? 'Online' : 'Offline'}
                                        </span>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={5} className="px-10 py-24 text-center text-gray-400 font-bold uppercase tracking-widest italic opacity-20">No members registered yet</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default AdminUsers
