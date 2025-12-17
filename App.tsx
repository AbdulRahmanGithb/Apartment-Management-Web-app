
import React, { useState, createContext, useContext, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  IndianRupee, 
  Wrench, 
  MessageSquare, 
  LogOut, 
  Menu, 
  X,
  ShieldCheck,
  Bot,
  Building,
  RefreshCw,
  Smartphone
} from 'lucide-react';
import { 
  MOCK_USERS, 
  MOCK_FLATS, 
  MOCK_PAYMENTS, 
  MOCK_EXPENSES, 
  MOCK_FACILITIES, 
  MOCK_DOCUMENTS, 
  MOCK_SUGGESTIONS,
  MOCK_NOTICES,
  MOCK_ELECTRICITY_BILLS
} from './constants';
import { User, UserRole, Flat, Payment, Expense, Facility, DocumentItem, Suggestion, Notice, ElectricityBill } from './types';
import { askGeminiAssistant } from './services/geminiService';

// --- Pages Imports ---
import DashboardPage from './components/Dashboard';
import DocumentVaultPage from './components/DocumentVault';
import FinancePage from './components/Finance';
import FacilitiesPage from './components/Facilities';
import SuggestionsPage from './components/Suggestions';
import LoginPage from './components/Login';
import FlatsPage from './components/Flats';
import PaymentGatewayPage from './components/PaymentGateway';

// --- Global Context ---
interface AppContextType {
  currentUser: User | null;
  login: (userId: string) => void;
  logout: () => void;
  toggleUserRole: () => void;
  
  flats: Flat[];
  addFlat: (flat: Flat) => void;
  updateFlat: (flat: Flat) => void;
  deleteFlat: (id: string) => void;

  payments: Payment[];
  addPayment: (payment: Payment) => void;
  updatePayment: (payment: Payment) => void;
  deletePayment: (id: string) => void;

  expenses: Expense[];
  addExpense: (expense: Expense) => void;
  updateExpense: (expense: Expense) => void;
  deleteExpense: (id: string) => void;

  facilities: Facility[];
  addFacility: (facility: Facility) => void;
  updateFacility: (facility: Facility) => void;
  deleteFacility: (id: string) => void;

  documents: DocumentItem[];
  deleteDocument: (id: string) => void;
  
  suggestions: Suggestion[];
  addSuggestion: (s: Suggestion) => void;
  updateSuggestion: (s: Suggestion) => void;
  deleteSuggestion: (id: string) => void;

  notices: Notice[];
  addNotice: (n: Notice) => void;
  deleteNotice: (id: string) => void;

  electricityBills: ElectricityBill[];
  
  isAiChatOpen: boolean;
  toggleAiChat: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppContext must be used within AppProvider");
  return context;
};

// --- Main App Component ---

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);
  
  // State for data
  const [flats, setFlats] = useState<Flat[]>(MOCK_FLATS);
  const [payments, setPayments] = useState<Payment[]>(MOCK_PAYMENTS);
  const [expenses, setExpenses] = useState<Expense[]>(MOCK_EXPENSES);
  const [facilities, setFacilities] = useState<Facility[]>(MOCK_FACILITIES);
  const [documents, setDocuments] = useState<DocumentItem[]>(MOCK_DOCUMENTS);
  const [suggestions, setSuggestions] = useState<Suggestion[]>(MOCK_SUGGESTIONS);
  const [notices, setNotices] = useState<Notice[]>(MOCK_NOTICES);
  const [electricityBills, setElectricityBills] = useState<ElectricityBill[]>(MOCK_ELECTRICITY_BILLS);

  const login = (userId: string) => {
    const user = MOCK_USERS.find(u => u.id === userId);
    if (user) setCurrentUser(user);
  };

  const logout = () => setCurrentUser(null);

  const toggleUserRole = () => {
    if (currentUser) {
      setCurrentUser(prev => prev ? ({
        ...prev,
        role: prev.role === UserRole.ADMIN ? UserRole.VIEWER : UserRole.ADMIN
      }) : null);
    }
  };

  // CRUD Functions
  const addFlat = (flat: Flat) => setFlats(prev => [...prev, flat]);
  const updateFlat = (flat: Flat) => setFlats(prev => prev.map(f => f.id === flat.id ? flat : f));
  const deleteFlat = (id: string) => setFlats(prev => prev.filter(f => f.id !== id));

  const addPayment = (payment: Payment) => setPayments(prev => [...prev, payment]);
  const updatePayment = (payment: Payment) => setPayments(prev => prev.map(p => p.id === payment.id ? payment : p));
  const deletePayment = (id: string) => setPayments(prev => prev.filter(p => p.id !== id));

  const addExpense = (expense: Expense) => setExpenses(prev => [...prev, expense]);
  const updateExpense = (expense: Expense) => setExpenses(prev => prev.map(e => e.id === expense.id ? expense : e));
  const deleteExpense = (id: string) => setExpenses(prev => prev.filter(e => e.id !== id));

  const addFacility = (facility: Facility) => setFacilities(prev => [...prev, facility]);
  const updateFacility = (facility: Facility) => setFacilities(prev => prev.map(f => f.id === facility.id ? facility : f));
  const deleteFacility = (id: string) => setFacilities(prev => prev.filter(f => f.id !== id));

  const deleteDocument = (id: string) => setDocuments(prev => prev.filter(d => d.id !== id));

  const addSuggestion = (s: Suggestion) => setSuggestions(prev => [s, ...prev]);
  const updateSuggestion = (s: Suggestion) => setSuggestions(prev => prev.map(item => item.id === s.id ? s : item));
  const deleteSuggestion = (id: string) => setSuggestions(prev => prev.filter(s => s.id !== id));

  const addNotice = (n: Notice) => setNotices(prev => [n, ...prev]);
  const deleteNotice = (id: string) => setNotices(prev => prev.filter(n => n.id !== id));

  const toggleAiChat = () => setIsAiChatOpen(!isAiChatOpen);

  return (
    <AppContext.Provider value={{
      currentUser, login, logout, toggleUserRole,
      flats, addFlat, updateFlat, deleteFlat,
      payments, addPayment, updatePayment, deletePayment,
      expenses, addExpense, updateExpense, deleteExpense,
      facilities, addFacility, updateFacility, deleteFacility,
      documents, deleteDocument,
      suggestions, addSuggestion, updateSuggestion, deleteSuggestion,
      notices, addNotice, deleteNotice,
      electricityBills,
      isAiChatOpen, toggleAiChat
    }}>
      <HashRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/*" element={
            currentUser ? <Layout /> : <Navigate to="/login" replace />
          } />
        </Routes>
      </HashRouter>
    </AppContext.Provider>
  );
};

// --- Layout Component ---

const Layout: React.FC = () => {
  const { currentUser, logout, toggleAiChat, isAiChatOpen, toggleUserRole, payments } = useAppContext();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { label: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { label: 'GPay Quick Pay', path: '/gpay', icon: <Smartphone size={20} /> },
    { label: 'Flats', path: '/flats', icon: <Building size={20} /> },
    { label: 'Document Vault', path: '/documents', icon: <ShieldCheck size={20} /> },
    { label: 'Finance', path: '/finance', icon: <IndianRupee size={20} /> },
    { label: 'Facilities', path: '/facilities', icon: <Wrench size={20} /> },
    { label: 'Suggestions', path: '/suggestions', icon: <MessageSquare size={20} /> },
  ];

  // Calculate pending payments for quick view in sidebar
  const userFlatId = currentUser?.flatId;
  const myPending = payments.filter(p => p.flatId === userFlatId && (p.status === 'PENDING' || p.status === 'OVERDUE'));
  const totalDue = myPending.reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-slate-900 text-white transform transition-transform duration-200 ease-in-out lg:relative lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <div className="flex items-center gap-2 font-bold text-xl">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">S</div>
            Skyline
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                location.pathname === item.path 
                  ? 'bg-blue-600 text-white' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-slate-800">
           {/* Sidebar Payment Widget */}
           {totalDue > 0 && (
              <div className="mb-4 p-4 bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl text-white shadow-lg relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                   <Smartphone size={60} />
                </div>
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="bg-white/20 p-1.5 rounded-full"><Smartphone size={14} /></div>
                      <span className="font-bold text-xs uppercase tracking-wider">GPay Due</span>
                    </div>
                    <p className="text-xl font-bold mb-2">₹{totalDue.toLocaleString()}</p>
                    <Link to="/gpay" className="block w-full bg-white text-blue-600 text-center py-1.5 rounded-lg text-xs font-bold hover:bg-blue-50 transition-colors shadow-sm">
                      Pay Now
                    </Link>
                </div>
              </div>
           )}

          <div className="flex items-center gap-3 px-4 py-3 mb-2 bg-slate-800/50 rounded-lg">
            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-sm font-bold border border-slate-600">
              {currentUser?.name.charAt(0)}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium truncate">{currentUser?.name}</p>
              <button 
                onClick={toggleUserRole}
                className="text-xs text-slate-400 hover:text-blue-400 flex items-center gap-1 transition-colors mt-0.5 group"
                title="Click to switch role"
              >
                {currentUser?.role}
                <RefreshCw size={10} className="group-hover:rotate-180 transition-transform duration-500" />
              </button>
            </div>
          </div>
          <button 
            onClick={logout}
            className="flex items-center gap-3 px-4 py-2 w-full text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <header className="flex items-center justify-between p-4 bg-white border-b border-slate-200 lg:hidden">
          <button onClick={() => setSidebarOpen(true)} className="text-slate-600">
            <Menu size={24} />
          </button>
          <span className="font-semibold text-slate-700">Skyline Heights</span>
          <div className="w-6" /> {/* Spacer */}
        </header>

        <div className="flex-1 overflow-auto p-4 md:p-8">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/flats" element={<FlatsPage />} />
            <Route path="/documents" element={<DocumentVaultPage />} />
            <Route path="/finance" element={<FinancePage />} />
            <Route path="/facilities" element={<FacilitiesPage />} />
            <Route path="/suggestions" element={<SuggestionsPage />} />
            <Route path="/gpay" element={<PaymentGatewayPage />} />
          </Routes>
        </div>
        
        {/* AI Assistant FAB */}
        {currentUser?.role === UserRole.ADMIN && (
           <div className="fixed bottom-6 right-6 z-40">
              <button 
                onClick={toggleAiChat}
                className="bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-full shadow-lg transition-all hover:scale-105 flex items-center gap-2"
              >
                <Bot size={24} />
                <span className="hidden md:inline font-medium">AI Assistant</span>
              </button>
           </div>
        )}

        {/* AI Chat Window */}
        {isAiChatOpen && <AiChatWindow />}

      </main>
    </div>
  );
};

const AiChatWindow = () => {
    const { toggleAiChat, expenses, payments, flats } = useAppContext();
    const [messages, setMessages] = useState<{role: 'user' | 'ai', text: string}[]>([
        { role: 'ai', text: "Hello Admin. I have access to the society's financial and operational data. How can I help you today?" }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSend = async () => {
        if(!input.trim()) return;
        const userMsg = input;
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setInput("");
        setLoading(true);

        const response = await askGeminiAssistant(userMsg, { expenses, payments, flats });
        
        setMessages(prev => [...prev, { role: 'ai', text: response }]);
        setLoading(false);
    };

    return (
        <div className="fixed bottom-24 right-6 w-96 bg-white rounded-xl shadow-2xl border border-slate-200 z-40 flex flex-col max-h-[500px]">
            <div className="p-4 bg-indigo-600 text-white rounded-t-xl flex justify-between items-center">
                <h3 className="font-semibold flex items-center gap-2"><Bot size={18}/> Assistant</h3>
                <button onClick={toggleAiChat}><X size={18}/></button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 h-80">
                {messages.map((m, i) => (
                    <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] p-3 rounded-lg text-sm ${
                            m.role === 'user' ? 'bg-indigo-100 text-indigo-900' : 'bg-slate-100 text-slate-800'
                        }`}>
                            {m.text}
                        </div>
                    </div>
                ))}
                {loading && <div className="text-xs text-slate-500 italic">Thinking...</div>}
            </div>
            <div className="p-3 border-t border-slate-200 flex gap-2">
                <input 
                    className="flex-1 border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Ask about defaulters, expenses..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                />
                <button 
                    onClick={handleSend}
                    disabled={loading}
                    className="bg-indigo-600 text-white p-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
                >
                    <MessageSquare size={18} />
                </button>
            </div>
        </div>
    );
}

export default App;
