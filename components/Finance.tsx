
import React, { useState } from 'react';
import { useAppContext } from '../App';
import { UserRole, FlatType, Payment, Expense } from '../types';
import { AlertOctagon, Check, TrendingDown, TrendingUp, Plus, Pencil, Trash2, X, Send, PieChart as PieChartIcon, Target, Wallet, ExternalLink, MapPin, Building2 } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { BUILDING_IMAGES } from '../constants';

const Finance: React.FC = () => {
  const { flats, payments, expenses, currentUser, addPayment, updatePayment, deletePayment, addExpense, updateExpense, deleteExpense } = useAppContext();
  const [view, setView] = useState<'overview' | 'defaulters'>('overview');
  
  // Modals
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [reminderSent, setReminderSent] = useState<string | null>(null);

  const isAdmin = currentUser?.role === UserRole.ADMIN;

  // Logic
  const pendingPayments = payments.filter(p => p.status === 'PENDING');
  const totalCollected = payments.filter(p => p.status === 'PAID').reduce((sum, p) => sum + p.amount, 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

  // Prepare Expense Data for Pie Chart
  const expenseData = expenses.reduce((acc, curr) => {
    const existing = acc.find(i => i.name === curr.category);
    if(existing) existing.value += curr.amount;
    else acc.push({ name: curr.category, value: curr.amount });
    return acc;
  }, [] as {name: string, value: number}[]);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  const handleDeletePayment = (id: string) => {
      if(window.confirm('Delete this payment record?')) deletePayment(id);
  };
  const handleDeleteExpense = (id: string) => {
      if(window.confirm('Delete this expense record?')) deleteExpense(id);
  };

  const handleSendReminder = (flatId: string) => {
    setReminderSent(flatId);
    // Mock API call simulation
    setTimeout(() => {
        alert(`Reminder sent successfully to Flat ${flatId}`);
        setReminderSent(null);
    }, 1000);
  };

  // Mock Market Ads Data
  const MARKET_ADS = [
      { 
          id: 1, 
          title: "Luxury 4 BHK Villa", 
          price: "₹8.5 Cr", 
          loc: "Jubilee Hills Rd 45", 
          img: "https://images.unsplash.com/photo-1600596542815-e32c8ecfe2ea?q=80&w=400&auto=format&fit=crop",
          link: "https://www.google.com/search?q=buy+luxury+villa+jubilee+hills"
      },
      { 
          id: 2, 
          title: "Premium 3 BHK Flat", 
          price: "₹2.2 Cr", 
          loc: "Banjara Hills", 
          img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=400&auto=format&fit=crop",
          link: "https://www.google.com/search?q=buy+3bhk+apartment+banjara+hills"
      },
      { 
          id: 3, 
          title: "Commercial Plot", 
          price: "₹15 Cr", 
          loc: "Hitech City", 
          img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=400&auto=format&fit=crop",
          link: "https://www.google.com/search?q=buy+commercial+plot+hitech+city"
      }
  ];

  return (
    <div className="relative min-h-[calc(100vh-4rem)] -m-4 md:-m-8 p-4 md:p-8">
      {/* Background Image Layer */}
      <div className="absolute inset-0 z-0 overflow-hidden">
          <div 
             className="absolute inset-0 bg-cover bg-center transform scale-105 hover:scale-100 transition-transform duration-[20s]"
             style={{ backgroundImage: `url(${BUILDING_IMAGES[2].url})` }}
          />
          <div className="absolute inset-0 bg-slate-50/90 backdrop-blur-[2px]" />
      </div>

      <div className="relative z-10 space-y-6">
        <div className="flex justify-between items-center">
            <div>
            <h1 className="text-2xl font-bold text-slate-800">Financial Management</h1>
            <p className="text-slate-500">Track income, expenses, and maintenance status.</p>
            </div>
            {isAdmin && (
                <div className="flex bg-slate-200 p-1 rounded-lg">
                    <button 
                        onClick={() => setView('overview')}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${view === 'overview' ? 'bg-white shadow text-blue-600' : 'text-slate-600'}`}
                    >
                        Overview
                    </button>
                    <button 
                        onClick={() => setView('defaulters')}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${view === 'defaulters' ? 'bg-white shadow text-red-600' : 'text-slate-600'}`}
                    >
                        Defaulters
                    </button>
                </div>
            )}
        </div>

        {view === 'overview' ? (
            <div className="space-y-6">
            
            {/* Section 1: Interesting Analytics & Goals */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Expense Breakdown Pie Chart */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 lg:col-span-2">
                        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <PieChartIcon className="text-indigo-500" size={20} /> Expense Breakdown
                        </h3>
                        <div className="h-56 w-full flex items-center justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie 
                                        data={expenseData} 
                                        cx="50%" 
                                        cy="50%" 
                                        innerRadius={60} 
                                        outerRadius={80} 
                                        paddingAngle={5} 
                                        dataKey="value"
                                    >
                                        {expenseData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip 
                                        formatter={(value: number) => `₹${value.toLocaleString()}`}
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                    />
                                    <Legend verticalAlign="middle" align="right" layout="vertical" iconType="circle" />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Society Savings Goal Widget */}
                    <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-6 rounded-xl shadow-lg text-white flex flex-col justify-between relative overflow-hidden group">
                        <div className="absolute top-0 right-0 -mt-6 -mr-6 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                        <div className="absolute bottom-0 left-0 -mb-6 -ml-6 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                        
                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h3 className="font-bold text-lg flex items-center gap-2"><Target size={20}/> Major Goal</h3>
                                    <p className="text-blue-100 text-sm">Solar Panel Installation</p>
                                </div>
                                <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                                    <Wallet size={20} className="text-white" />
                                </div>
                            </div>
                            
                            <div className="space-y-2 mb-6">
                                <div className="flex justify-between text-sm font-medium">
                                    <span>Collected</span>
                                    <span>65%</span>
                                </div>
                                <div className="w-full bg-black/20 rounded-full h-3 overflow-hidden">
                                    <div className="bg-green-400 h-full rounded-full w-[65%] shadow-[0_0_10px_rgba(74,222,128,0.5)] animate-pulse"></div>
                                </div>
                                <div className="flex justify-between text-xs text-blue-200 mt-1">
                                    <span>₹3,25,000</span>
                                    <span>Target: ₹5,00,000</span>
                                </div>
                            </div>
                        </div>

                        <button className="relative z-10 w-full bg-white/10 hover:bg-white/20 border border-white/20 transition-colors py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2">
                            View Fund Details
                        </button>
                    </div>
            </div>

            {/* Section 2: Property Market Watch (Google Ads Simulation) */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h3 className="font-bold text-slate-800 flex items-center gap-2">
                            <Building2 className="text-blue-600" size={20} /> Property Market Watch
                        </h3>
                        <p className="text-xs text-slate-500">Sponsored Listings from Google</p>
                    </div>
                    <span className="bg-slate-200 text-slate-500 text-[10px] px-2 py-0.5 rounded font-bold uppercase">Ad</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {MARKET_ADS.map((ad) => (
                        <a 
                            key={ad.id} 
                            href={ad.link} 
                            target="_blank" 
                            rel="noreferrer"
                            className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all group border border-slate-100 block"
                        >
                            <div className="h-32 bg-slate-200 relative overflow-hidden">
                                <img src={ad.img} alt={ad.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded font-bold">
                                    {ad.price}
                                </div>
                            </div>
                            <div className="p-3">
                                <h4 className="font-bold text-slate-800 text-sm mb-1 group-hover:text-blue-600 transition-colors flex items-center gap-1">
                                    {ad.title} <ExternalLink size={12} className="opacity-0 group-hover:opacity-100" />
                                </h4>
                                <p className="text-xs text-slate-500 flex items-center gap-1">
                                    <MapPin size={10} /> {ad.loc}
                                </p>
                            </div>
                        </a>
                    ))}
                </div>
                <div className="mt-3 text-center">
                    <a 
                        href="https://www.google.com/search?q=properties+for+sale+in+jubilee+hills" 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-xs text-blue-600 hover:underline font-medium"
                    >
                        View more properties on Google
                    </a>
                </div>
            </div>

            {/* Section 3: Maintenance Rates */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <h3 className="font-semibold text-slate-800 mb-4">Current Maintenance Rates</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {Object.values(FlatType).map(type => (
                            <div key={type} className="bg-slate-50 p-4 rounded-lg border border-slate-100 flex flex-col items-center">
                                <span className="text-sm text-slate-500 font-medium">{type}</span>
                                <span className="text-2xl font-bold text-blue-600">
                                    ₹{type === FlatType.BHK2 ? 500 : type === FlatType.BHK3 ? 750 : 1000}
                                </span>
                                <span className="text-xs text-slate-400">per month</span>
                            </div>
                        ))}
                    </div>
            </div>

            {/* Section 4: Transaction Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Incomes */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[400px]">
                        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-green-50">
                            <h3 className="font-semibold text-green-800 flex items-center gap-2">
                                <TrendingUp size={18} /> Payments
                            </h3>
                            <div className="flex items-center gap-3">
                                <span className="text-xs font-bold text-green-700 bg-green-200 px-2 py-1 rounded">
                                    Total: ₹{totalCollected.toLocaleString()}
                                </span>
                                {isAdmin && (
                                    <button onClick={() => setShowPaymentModal(true)} className="p-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors">
                                        <Plus size={16} />
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-slate-500 uppercase bg-slate-50 sticky top-0 z-10">
                                    <tr>
                                        <th className="px-4 py-3">Flat</th>
                                        <th className="px-4 py-3">Date</th>
                                        <th className="px-4 py-3 text-right">Amount</th>
                                        <th className="px-4 py-3 text-center">Status</th>
                                        {isAdmin && <th className="px-4 py-3 text-center">Actions</th>}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {payments.slice().reverse().map(p => (
                                        <tr key={p.id} className="hover:bg-slate-50">
                                            <td className="px-4 py-3 font-medium text-slate-700">{p.flatId}</td>
                                            <td className="px-4 py-3 text-slate-500">{p.date}</td>
                                            <td className="px-4 py-3 text-right font-mono">₹{p.amount}</td>
                                            <td className="px-4 py-3 text-center">
                                                <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                                                    p.status === 'PAID' ? 'bg-green-100 text-green-600' : 
                                                    p.status === 'PENDING' ? 'bg-amber-100 text-amber-600' : 'bg-red-100 text-red-600'
                                                }`}>
                                                    {p.status}
                                                </span>
                                            </td>
                                            {isAdmin && (
                                                <td className="px-4 py-3 flex justify-center gap-2">
                                                    <button onClick={() => { setEditingPayment(p); setShowPaymentModal(true); }} className="text-blue-500 hover:text-blue-700"><Pencil size={14}/></button>
                                                    <button onClick={() => handleDeletePayment(p.id)} className="text-red-500 hover:text-red-700"><Trash2 size={14}/></button>
                                                </td>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Recent Expenses */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[400px]">
                        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-red-50">
                            <h3 className="font-semibold text-red-800 flex items-center gap-2">
                                <TrendingDown size={18} /> Expenses
                            </h3>
                            <div className="flex items-center gap-3">
                                <span className="text-xs font-bold text-red-700 bg-red-200 px-2 py-1 rounded">
                                    Total: ₹{totalExpenses.toLocaleString()}
                                </span>
                                {isAdmin && (
                                    <button onClick={() => setShowExpenseModal(true)} className="p-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors">
                                        <Plus size={16} />
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-slate-500 uppercase bg-slate-50 sticky top-0 z-10">
                                    <tr>
                                        <th className="px-4 py-3">Category</th>
                                        <th className="px-4 py-3">Desc</th>
                                        <th className="px-4 py-3 text-right">Amount</th>
                                        {isAdmin && <th className="px-4 py-3 text-center">Actions</th>}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {expenses.map(e => (
                                        <tr key={e.id} className="hover:bg-slate-50">
                                            <td className="px-4 py-3 font-medium text-slate-700">{e.category}</td>
                                            <td className="px-4 py-3 text-slate-500 truncate max-w-[120px]">{e.description}</td>
                                            <td className="px-4 py-3 text-right font-mono text-red-600">-₹{e.amount}</td>
                                            {isAdmin && (
                                                <td className="px-4 py-3 flex justify-center gap-2">
                                                    <button onClick={() => { setEditingExpense(e); setShowExpenseModal(true); }} className="text-blue-500 hover:text-blue-700"><Pencil size={14}/></button>
                                                    <button onClick={() => handleDeleteExpense(e.id)} className="text-red-500 hover:text-red-700"><Trash2 size={14}/></button>
                                                </td>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
            </div>
            </div>
        ) : (
            <div className="bg-white rounded-xl shadow-sm border border-red-200 overflow-hidden">
                <div className="p-4 bg-red-50 border-b border-red-100 flex justify-between items-center">
                    <h3 className="font-bold text-red-800 flex items-center gap-2">
                        <AlertOctagon className="text-red-600" />
                        Defaulter List (Current Month)
                    </h3>
                </div>
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-slate-500 uppercase bg-slate-50">
                        <tr>
                            <th className="px-6 py-4">Flat No</th>
                            <th className="px-6 py-4">Owner Name</th>
                            <th className="px-6 py-4">Pending Amount</th>
                            <th className="px-6 py-4">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {pendingPayments.map(p => {
                            const flat = flats.find(f => f.id === p.flatId);
                            const isSending = reminderSent === p.flatId;
                            return (
                                <tr key={p.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4 font-bold text-slate-800">{p.flatId}</td>
                                    <td className="px-6 py-4 text-slate-600">{flat?.ownerName}</td>
                                    <td className="px-6 py-4 text-red-600 font-mono font-bold">₹{p.amount}</td>
                                    <td className="px-6 py-4">
                                        <button 
                                            onClick={() => handleSendReminder(p.flatId)}
                                            disabled={isSending}
                                            className={`flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full transition-all ${
                                                isSending 
                                                ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                                                : 'bg-red-100 text-red-600 hover:bg-red-200'
                                            }`}
                                        >
                                            <Send size={12} /> {isSending ? 'Sending...' : 'Send Reminder'}
                                        </button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
                {pendingPayments.length === 0 && (
                    <div className="p-8 text-center text-slate-500 flex flex-col items-center">
                        <Check className="text-green-500 mb-2" size={32} />
                        <p>All payments are clear!</p>
                    </div>
                )}
            </div>
        )}

        {/* Payment Form Modal */}
        {showPaymentModal && (
            <PaymentFormModal 
                payment={editingPayment} 
                onClose={() => { setShowPaymentModal(false); setEditingPayment(null); }} 
                onSave={(p) => { 
                    if(editingPayment) updatePayment(p); 
                    else addPayment(p); 
                    setShowPaymentModal(false); 
                    setEditingPayment(null); 
                }}
            />
        )}

        {/* Expense Form Modal */}
        {showExpenseModal && (
            <ExpenseFormModal 
                expense={editingExpense} 
                onClose={() => { setShowExpenseModal(false); setEditingExpense(null); }} 
                onSave={(e) => { 
                    if(editingExpense) updateExpense(e); 
                    else addExpense(e); 
                    setShowExpenseModal(false); 
                    setEditingExpense(null); 
                }}
            />
        )}
      </div>
    </div>
  );
};

const PaymentFormModal = ({ payment, onClose, onSave }: { payment: Payment | null, onClose: () => void, onSave: (p: Payment) => void }) => {
    const [formData, setFormData] = useState<Payment>(payment || {
        id: `pay-${Date.now()}`,
        flatId: 'A-101',
        amount: 500,
        date: new Date().toISOString().split('T')[0],
        status: 'PAID',
        month: new Date().toISOString().slice(0, 7)
    });

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white w-full max-w-sm rounded-xl p-6 shadow-xl animate-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg">{payment ? 'Edit Payment' : 'New Payment'}</h3>
                    <button onClick={onClose}><X size={20} className="text-slate-400" /></button>
                </div>
                <div className="space-y-3">
                    <input className="w-full border p-2 rounded" placeholder="Flat ID" value={formData.flatId} onChange={e => setFormData({...formData, flatId: e.target.value})} />
                    <input className="w-full border p-2 rounded" type="number" placeholder="Amount" value={formData.amount} onChange={e => setFormData({...formData, amount: Number(e.target.value)})} />
                    <input className="w-full border p-2 rounded" type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
                    <select className="w-full border p-2 rounded" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as any})}>
                        <option value="PAID">PAID</option>
                        <option value="PENDING">PENDING</option>
                        <option value="OVERDUE">OVERDUE</option>
                    </select>
                    <button onClick={() => onSave(formData)} className="w-full bg-blue-600 text-white py-2 rounded font-medium mt-2">Save</button>
                </div>
            </div>
        </div>
    );
};

const ExpenseFormModal = ({ expense, onClose, onSave }: { expense: Expense | null, onClose: () => void, onSave: (e: Expense) => void }) => {
    const [formData, setFormData] = useState<Expense>(expense || {
        id: `exp-${Date.now()}`,
        category: 'Maintenance',
        amount: 0,
        date: new Date().toISOString().split('T')[0],
        description: ''
    });

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white w-full max-w-sm rounded-xl p-6 shadow-xl animate-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg">{expense ? 'Edit Expense' : 'New Expense'}</h3>
                    <button onClick={onClose}><X size={20} className="text-slate-400" /></button>
                </div>
                <div className="space-y-3">
                    <input className="w-full border p-2 rounded" placeholder="Category" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} />
                    <input className="w-full border p-2 rounded" type="number" placeholder="Amount" value={formData.amount} onChange={e => setFormData({...formData, amount: Number(e.target.value)})} />
                    <input className="w-full border p-2 rounded" type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
                    <textarea className="w-full border p-2 rounded h-20" placeholder="Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                    <button onClick={() => onSave(formData)} className="w-full bg-blue-600 text-white py-2 rounded font-medium mt-2">Save</button>
                </div>
            </div>
        </div>
    );
};

export default Finance;
