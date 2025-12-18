
import React, { useState } from 'react';
import { User, MetricData, Transaction } from '../types';
import { Icons } from '../constants';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import UserManagement from './UserManagement';

const METRICS: MetricData[] = [
  { label: '總收益', value: '$128,430', change: '12%', isUp: true, icon: 'Revenue' },
  { label: '活躍用戶', value: '2,420', change: '5%', isUp: true, icon: 'Users' },
  { label: '訂單數', value: '452', change: '2%', isUp: false, icon: 'Orders' },
  { label: '轉換率', value: '3.42%', change: '0.5%', isUp: true, icon: 'Chart' },
];

const TRANSACTIONS: Transaction[] = [
  { id: 'TX-1001', customer: '張小明', amount: '$1,200', status: 'Completed', date: '2023-10-24' },
  { id: 'TX-1002', customer: '李大華', amount: '$450', status: 'Pending', date: '2023-10-23' },
  { id: 'TX-1003', customer: '王美玲', amount: '$2,800', status: 'Completed', date: '2023-10-22' },
  { id: 'TX-1004', customer: '趙四', amount: '$150', status: 'Canceled', date: '2023-10-21' },
];

const CHART_DATA = [
  { month: 'Jan', value: 3000 }, { month: 'Feb', value: 3500 }, { month: 'Mar', value: 3200 },
  { month: 'Apr', value: 4500 }, { month: 'May', value: 4200 }, { month: 'Jun', value: 5000 },
];

const Dashboard: React.FC<{ user: User | null; onLogout: () => void }> = ({ user, onLogout }) => {
  const [activeMenu, setActiveMenu] = useState('儀表板');

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-6 border-b border-slate-200 flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center text-white font-bold">E</div>
          <span className="font-bold text-slate-800 text-lg">ENT ADMIN</span>
        </div>
        <nav className="flex-1 mt-4 overflow-y-auto">
          {[
            { name: '儀表板', icon: Icons.Dashboard },
            { name: '用戶管理', icon: Icons.Users },
            { name: '系統設定', icon: Icons.Settings },
          ].map((item) => (
            <button
              key={item.name}
              onClick={() => setActiveMenu(item.name)}
              className={`w-full flex items-center gap-3 px-6 py-4 text-sm font-medium transition-colors ${
                activeMenu === item.name ? 'sidebar-item-active' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <item.icon />
              {item.name}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-200">
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Icons.Logout />
            登出系統
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8">
          <div className="flex items-center gap-4 text-slate-400">
            <span className="text-sm">主頁</span>
            <span>/</span>
            <span className="text-sm font-semibold text-slate-800">{activeMenu}</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative hidden md:block">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                <Icons.Search />
              </span>
              <input 
                type="text" 
                placeholder="搜尋數據..." 
                className="pl-10 pr-4 py-2 bg-slate-100 border-transparent rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none w-64 transition-all"
              />
            </div>
            <button className="text-slate-500 hover:text-blue-600 relative">
              <Icons.Bell />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-px bg-slate-200"></div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-bold text-slate-800 leading-none">{user?.name}</p>
                <p className="text-[11px] text-slate-500 mt-1">{user?.role}</p>
              </div>
              <img src={user?.avatar} className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200" alt="avatar" />
            </div>
          </div>
        </header>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-y-auto">
          {activeMenu === '用戶管理' ? (
            <UserManagement currentUser={user} />
          ) : (
            <div className="p-8">
              <div className="max-w-7xl mx-auto space-y-8">
                {/* Page Title */}
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">{activeMenu}</h1>
                  <p className="text-slate-500 text-sm mt-1">這是您目前的業務概覽與數據統計。</p>
                </div>

                {/* Metric Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {METRICS.map((m, i) => (
                    <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                      <div className="flex justify-between items-start">
                        <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{m.label}</p>
                        <div className={`flex items-center gap-1 text-xs font-bold ${m.isUp ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {m.isUp ? <Icons.ArrowUp /> : <Icons.ArrowDown />}
                          {m.change}
                        </div>
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 mt-2">{m.value}</h3>
                      <div className="mt-4 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-blue-600 h-full w-[70%]" />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Chart Card */}
                  <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="font-bold text-slate-800 mb-6">銷售趨勢分析</h3>
                    <div className="h-80 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={CHART_DATA}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                          <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                          <Tooltip 
                            contentStyle={{ border: 'none', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                          />
                          <Area type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={2} fillOpacity={1} fill="#eff6ff" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Transactions List */}
                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-slate-100">
                      <h3 className="font-bold text-slate-800">最近交易</h3>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                      <table className="w-full text-left">
                        <tbody className="divide-y divide-slate-100">
                          {TRANSACTIONS.map((tx) => (
                            <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                              <td className="px-6 py-4">
                                <p className="text-sm font-bold text-slate-900">{tx.customer}</p>
                                <p className="text-[11px] text-slate-400">{tx.id}</p>
                              </td>
                              <td className="px-6 py-4 text-sm font-medium text-slate-900 text-right">
                                {tx.amount}
                              </td>
                              <td className="px-6 py-4 text-right">
                                <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                                  tx.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                                  tx.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
                                }`}>
                                  {tx.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <button className="p-4 text-center text-xs font-bold text-blue-600 hover:bg-blue-50 transition-colors border-t border-slate-100">
                      查看全部交易
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
