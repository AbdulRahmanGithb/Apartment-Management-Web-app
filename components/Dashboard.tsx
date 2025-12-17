
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../App';
import { IndianRupee, AlertCircle, Users, CheckCircle, ChevronLeft, ChevronRight, Zap, FileText, Calendar, Bell, Phone, Shield, Clock, MapPin, Megaphone, Trash2, Plus, X, Map, Share2 } from 'lucide-react';
import { UserRole, Notice, User } from '../types';
import { BUILDING_IMAGES } from '../constants';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { flats, payments, expenses, facilities, currentUser, notices, addNotice, deleteNotice } = useAppContext();
  const navigate = useNavigate();
  const [showNoticeModal, setShowNoticeModal] = useState(false);

  // Calculations
  const balance = payments.filter(p => p.status === 'PAID').reduce((acc, curr) => acc + curr.amount, 0) - expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const pendingPayments = payments.filter(p => p.status === 'PENDING').length;
  const occupiedFlats = flats.length;
  const activeFacilities = facilities.filter(f => f.status === 'OPERATIONAL').length;

  return (
    <div className="space-y-8">
      
      {/* Interactive Hero Section */}
      <HeroSection currentUser={currentUser} />

      {/* Stats Grid */}
      <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-800 px-1">At a Glance</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard 
              title="Society Balance" 
              value={`₹${balance.toLocaleString()}`} 
              icon={<IndianRupee className="text-white" size={24} />}
              bg="bg-blue-600"
            />
            <StatCard 
              title="Total Residents" 
              value={occupiedFlats.toString()} 
              icon={<Users className="text-white" size={24} />}
              bg="bg-slate-700"
            />
            <StatCard 
              title="Active Amenities" 
              value={`${activeFacilities}/${facilities.length}`} 
              icon={<CheckCircle className="text-white" size={24} />}
              bg="bg-green-600"
            />
            <StatCard 
              title="Pending Actions" 
              value={pendingPayments.toString()} 
              icon={<AlertCircle className="text-white" size={24} />}
              bg="bg-red-500"
            />
          </div>
      </div>

      {/* Community Features Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Notices & Activity */}
        <div className="lg:col-span-2 space-y-6">
            
            {/* Realistic Notice Board */}
            <div className="relative rounded-lg shadow-xl bg-[#dcb386] border-[12px] border-[#5d4037] p-6 overflow-hidden">
                {/* Cork texture effect via noise or pattern - simulated with inner shadow for now */}
                <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(0,0,0,0.2)] pointer-events-none"></div>
                
                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-8 bg-white/60 p-3 rounded-lg backdrop-blur-md border border-white/40 shadow-sm">
                        <h2 className="text-xl font-bold text-[#3e2723] flex items-center gap-2 font-serif tracking-wide">
                            <Megaphone size={22} className="text-[#3e2723]" /> Community Board
                        </h2>
                        {currentUser?.role === UserRole.ADMIN && (
                            <button 
                                onClick={() => setShowNoticeModal(true)}
                                className="text-xs bg-[#3e2723] text-[#dcb386] px-4 py-2 rounded shadow hover:bg-[#2d1b18] flex items-center gap-1 transition-colors font-bold uppercase tracking-wider"
                            >
                                <Plus size={14}/> Post New
                            </button>
                        )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-2">
                        {notices.length === 0 ? (
                            <div className="col-span-2 text-center py-12">
                                <p className="text-[#5d4037]/60 italic font-serif text-lg">The board is currently empty.</p>
                            </div>
                        ) : (
                            notices.map((notice, index) => (
                                <div 
                                    key={notice.id} 
                                    className={`relative p-5 pt-8 shadow-[3px_5px_15px_rgba(0,0,0,0.2)] transition-transform duration-300 hover:z-20 hover:scale-[1.02] ${
                                        // Varied paper colors
                                        notice.type === 'URGENT' ? 'bg-[#ffeff0]' : // Pinkish for urgent
                                        notice.type === 'EVENT' ? 'bg-[#f3e5f5]' : // Purple-ish for events
                                        'bg-[#fffdf5]' // Cream for info
                                    }`}
                                    style={{
                                        // Slight random rotation simulation using index
                                        transform: `rotate(${index % 3 === 0 ? '-1.5deg' : index % 3 === 1 ? '1.5deg' : '0.5deg'})`,
                                    }}
                                >
                                    {/* Push Pin */}
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 drop-shadow-md">
                                        {/* Pin Head */}
                                        <div className={`w-4 h-4 rounded-full border border-black/20 ${
                                             notice.type === 'URGENT' ? 'bg-red-600' :
                                             notice.type === 'EVENT' ? 'bg-purple-600' :
                                             'bg-blue-600'
                                        }`}></div>
                                        {/* Pin Needle (Visual trick) */}
                                        <div className="w-0.5 h-2 bg-slate-400 mx-auto -mt-1"></div>
                                    </div>

                                    {/* Content */}
                                    <div className="relative">
                                        <div className="flex justify-between items-start gap-2 mb-2">
                                            <h3 className={`font-bold text-lg font-serif leading-tight ${
                                                notice.type === 'URGENT' ? 'text-red-900' :
                                                notice.type === 'EVENT' ? 'text-purple-900' :
                                                'text-slate-800'
                                            }`}>
                                                {notice.type === 'URGENT' && <AlertCircle size={16} className="inline mr-1 -mt-0.5 text-red-600" />}
                                                {notice.title}
                                            </h3>
                                        </div>
                                        
                                        <p className="text-slate-700 text-sm font-medium font-sans leading-relaxed min-h-[60px]">
                                            {notice.message}
                                        </p>
                                        
                                        <div className="mt-4 pt-3 border-t border-black/5 flex justify-between items-end">
                                            <div>
                                                <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">Posted On</span>
                                                <span className="text-xs font-mono text-slate-600">{notice.date}</span>
                                            </div>
                                            <div className="text-right">
                                                 <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">By</span>
                                                 <span className="text-xs font-semibold text-slate-600 italic">{notice.postedBy}</span>
                                            </div>
                                        </div>

                                        {currentUser?.role === UserRole.ADMIN && (
                                            <button 
                                                onClick={() => deleteNotice(notice.id)}
                                                className="absolute -bottom-2 -right-2 p-2 text-slate-400 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100 hover:bg-red-50 rounded-full"
                                                title="Remove Notice"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Activity Feed */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <Bell size={20} className="text-blue-500" /> Recent Activity
                    </h2>
                    <button className="text-sm text-blue-600 font-medium hover:underline">View All</button>
                </div>
                
                <div className="space-y-0">
                    {/* Mock Activity Items */}
                    {[
                        { title: "New Document Uploaded", desc: "AGM Minutes 2023 added to Vault", time: "2 hours ago", icon: <FileText size={16}/>, color: "bg-blue-100 text-blue-600", border: "border-blue-100" },
                        { title: "Facility Update", desc: "Swimming Pool is now Operational", time: "5 hours ago", icon: <CheckCircle size={16}/>, color: "bg-green-100 text-green-600", border: "border-green-100" },
                        { title: "Security Alert", desc: "Visitor entry verification enabled at Main Gate", time: "1 day ago", icon: <Shield size={16}/>, color: "bg-amber-100 text-amber-600", border: "border-amber-100" },
                        { title: "Complaint Resolved", desc: "Gym AC Issue marked as Resolved", time: "1 day ago", icon: <CheckCircle size={16}/>, color: "bg-green-100 text-green-600", border: "border-green-100" },
                        { title: "Community Notice", desc: "Diwali Celebration Fund Collection Started", time: "2 days ago", icon: <Bell size={16}/>, color: "bg-purple-100 text-purple-600", border: "border-purple-100" },
                    ].map((item, i) => (
                        <div key={i} className="flex items-start gap-4 p-4 hover:bg-slate-50 rounded-lg transition-colors border-b border-slate-100 last:border-0 group">
                            <div className={`p-2.5 rounded-full ${item.color} mt-0.5 group-hover:scale-110 transition-transform`}>
                                {item.icon}
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <h4 className="font-semibold text-slate-800 text-sm">{item.title}</h4>
                                    <span className="text-xs text-slate-400 flex items-center gap-1"><Clock size={10} />{item.time}</span>
                                </div>
                                <p className="text-slate-600 text-sm mt-0.5">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Right Column: Emergency & Quick Info */}
        <div className="space-y-6">
            
            {/* Upcoming Events Widget */}
            <div className="bg-slate-800 p-6 rounded-xl shadow-md text-white relative overflow-hidden group">
                 <div className="absolute -top-6 -right-6 p-4 opacity-5 group-hover:opacity-10 transition-opacity transform rotate-12">
                    <Calendar size={140} />
                 </div>
                 <h2 className="text-lg font-bold mb-5 relative z-10 flex items-center gap-2">
                     <Calendar size={18} className="text-orange-400"/> Upcoming Events
                 </h2>
                 <div className="space-y-4 relative z-10">
                     <div className="flex gap-4 items-center p-3 bg-slate-700/50 rounded-lg border border-slate-600 backdrop-blur-sm">
                         <div className="bg-orange-500 p-2 rounded-lg text-center min-w-[3.5rem] shadow-lg">
                             <span className="block text-[10px] uppercase font-bold text-white/80 tracking-wider">Jan</span>
                             <span className="block text-xl font-bold leading-none mt-0.5">26</span>
                         </div>
                         <div>
                             <h4 className="font-bold text-sm">Republic Day</h4>
                             <p className="text-xs text-slate-300 mt-1 flex items-center gap-1">
                                 <MapPin size={10}/> Garden • 9 AM
                             </p>
                         </div>
                     </div>
                     <div className="flex gap-4 items-center p-3 bg-slate-700/50 rounded-lg border border-slate-600 backdrop-blur-sm">
                         <div className="bg-blue-500 p-2 rounded-lg text-center min-w-[3.5rem] shadow-lg">
                             <span className="block text-[10px] uppercase font-bold text-white/80 tracking-wider">Mar</span>
                             <span className="block text-xl font-bold leading-none mt-0.5">10</span>
                         </div>
                         <div>
                             <h4 className="font-bold text-sm">Ramzan Taraweeh</h4>
                             <p className="text-xs text-slate-300 mt-1 flex items-center gap-1">
                                 <MapPin size={10}/> Club House • 8 PM
                             </p>
                         </div>
                     </div>
                 </div>
            </div>

            {/* Location & Map Widget */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <Map size={20} className="text-indigo-500" /> Location
                    </h2>
                    <button 
                        onClick={() => {
                            navigator.clipboard.writeText("https://maps.google.com/?q=Jubilee+Hills,+Hyderabad");
                            alert("Location link copied to clipboard!");
                        }}
                        className="text-indigo-600 hover:bg-indigo-50 p-2 rounded-full transition-colors group"
                        title="Share Location"
                    >
                        <Share2 size={18} className="group-active:scale-90 transition-transform" />
                    </button>
                </div>
                <div className="rounded-lg overflow-hidden h-48 bg-slate-100 relative group border border-slate-100">
                    <iframe 
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d30450.15546252467!2d78.39129532677843!3d17.44476054817112!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb9158f201b205%3A0x11bbe7be7792411b!2sJubilee%20Hills%2C%20Hyderabad%2C%20Telangana!5e0!3m2!1sen!2sin!4v1709923847522!5m2!1sen!2sin" 
                        width="100%" 
                        height="100%" 
                        style={{border:0}} 
                        allowFullScreen={false} 
                        loading="lazy" 
                        referrerPolicy="no-referrer-when-downgrade"
                        className="grayscale group-hover:grayscale-0 transition-all duration-700 opacity-90 group-hover:opacity-100"
                    ></iframe>
                    <div className="absolute inset-0 bg-indigo-500/10 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity"></div>
                </div>
                <div className="mt-4 flex items-start gap-2.5 text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">
                    <MapPin size={16} className="mt-0.5 text-indigo-500 shrink-0"/>
                    <p className="leading-snug">Jubilee Hills, Hyderabad, Telangana 500033</p>
                </div>
            </div>

            {/* Emergency Contacts Widget */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                 <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Phone size={20} className="text-red-500" /> Emergency
                </h2>
                <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100 hover:bg-red-100 transition-colors group cursor-pointer">
                        <div>
                            <p className="font-bold text-slate-800 text-sm">Main Gate Security</p>
                            <p className="text-red-600 font-mono text-xs mt-0.5 font-semibold">+91 98765 00000</p>
                        </div>
                        <button className="bg-white p-2 rounded-full text-red-500 shadow-sm group-hover:bg-red-500 group-hover:text-white transition-all">
                            <Phone size={16} />
                        </button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-100 hover:bg-blue-100 transition-colors group cursor-pointer">
                        <div>
                            <p className="font-bold text-slate-800 text-sm">Building Manager</p>
                            <p className="text-blue-600 font-mono text-xs mt-0.5 font-semibold">+91 98765 11111</p>
                        </div>
                        <button className="bg-white p-2 rounded-full text-blue-500 shadow-sm group-hover:bg-blue-500 group-hover:text-white transition-all">
                            <Phone size={16} />
                        </button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-100 hover:bg-amber-100 transition-colors group cursor-pointer">
                        <div>
                            <p className="font-bold text-slate-800 text-sm">Electrician</p>
                            <p className="text-amber-600 font-mono text-xs mt-0.5 font-semibold">+91 98765 22222</p>
                        </div>
                        <button className="bg-white p-2 rounded-full text-amber-500 shadow-sm group-hover:bg-amber-500 group-hover:text-white transition-all">
                            <Phone size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {showNoticeModal && (
          <NoticeFormModal 
            onClose={() => setShowNoticeModal(false)}
            onSave={(n) => { addNotice(n); setShowNoticeModal(false); }}
            currentUser={currentUser?.name || 'Admin'}
          />
      )}
    </div>
  );
};

const NoticeFormModal = ({ onClose, onSave, currentUser }: { onClose: () => void, onSave: (n: Notice) => void, currentUser: string }) => {
    const [formData, setFormData] = useState({
        title: '',
        message: '',
        type: 'INFO' as 'INFO' | 'URGENT' | 'EVENT'
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            id: `n-${Date.now()}`,
            title: formData.title,
            message: formData.message,
            type: formData.type,
            date: new Date().toISOString().split('T')[0],
            postedBy: currentUser
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white w-full max-w-md rounded-xl p-6 shadow-xl animate-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg">Post New Notice</h3>
                    <button onClick={onClose}><X size={20} className="text-slate-400" /></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-3">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                        <input className="w-full border p-2 rounded" placeholder="e.g. Main Gate Closing" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Priority Type</label>
                        <select className="w-full border p-2 rounded" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as any})}>
                            <option value="INFO">General Info (Blue)</option>
                            <option value="URGENT">Urgent/Warning (Red)</option>
                            <option value="EVENT">Event/Activity (Purple)</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
                        <textarea className="w-full border p-2 rounded h-24" placeholder="Enter full details here..." value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} required />
                    </div>
                    <button type="submit" className="w-full bg-slate-900 text-white py-2 rounded font-medium mt-2 hover:bg-slate-800">
                        Post Notice
                    </button>
                </form>
            </div>
        </div>
    );
};

// --- Hero Section Component ---

const HeroSection = ({ currentUser }: { currentUser: User | null }) => {
  const [currentImage, setCurrentImage] = useState(0);
  const navigate = useNavigate();

  // Determine display name based on role
  const displayName = currentUser?.role === UserRole.ADMIN ? 'Owner' : 'Resident';

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % BUILDING_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImage((prev) => (prev + 1) % BUILDING_IMAGES.length);
  };
  
  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImage((prev) => (prev - 1 + BUILDING_IMAGES.length) % BUILDING_IMAGES.length);
  };

  return (
    <div className="relative h-[400px] w-full rounded-2xl overflow-hidden shadow-xl group border border-slate-200/50">
      {/* Background Images */}
      {BUILDING_IMAGES.map((img, index) => (
        <div 
          key={img.url}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentImage ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            backgroundImage: `url(${img.url})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      ))}

      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent" />

      {/* Content */}
      <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
        <div className="mb-8 animate-in slide-in-from-bottom-4 duration-700">
            <h1 className="text-4xl md:text-5xl font-bold mb-2 drop-shadow-lg">Welcome Home, {displayName}</h1>
            <p className="text-slate-200 text-lg max-w-xl drop-shadow-md flex items-center gap-2">
              <span className="bg-white/20 backdrop-blur-md px-2 py-1 rounded text-sm font-medium">28°C Sunny</span>
              <span>•</span>
              <span>{BUILDING_IMAGES[currentImage].title}</span>
            </p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-4 animate-in slide-in-from-bottom-8 duration-1000 delay-100">
           <button 
             onClick={() => navigate('/finance')}
             className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-lg"
           >
             <Zap size={20} className="text-yellow-400" />
             <span className="font-semibold">Pay Maintenance</span>
           </button>
           <button 
             onClick={() => navigate('/suggestions')}
             className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-lg"
           >
             <FileText size={20} className="text-blue-400" />
             <span className="font-semibold">Log Complaint</span>
           </button>
           <button 
             onClick={() => navigate('/facilities')}
             className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-lg"
           >
             <Calendar size={20} className="text-green-400" />
             <span className="font-semibold">Book Facility</span>
           </button>
        </div>
      </div>

      {/* Controls */}
      <button 
        onClick={prevImage}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 text-white hover:bg-black/50 opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm"
      >
        <ChevronLeft size={24} />
      </button>
      <button 
        onClick={nextImage}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 text-white hover:bg-black/50 opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm"
      >
        <ChevronRight size={24} />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-4 right-4 flex gap-2">
        {BUILDING_IMAGES.map((_, idx) => (
          <div 
            key={idx} 
            className={`h-1.5 rounded-full transition-all shadow-sm ${idx === currentImage ? 'bg-white w-6' : 'bg-white/40 w-2'}`} 
          />
        ))}
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, bg }: { title: string, value: string, icon: React.ReactNode, bg: string }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between hover:shadow-md transition-shadow group">
    <div>
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
    </div>
    <div className={`w-12 h-12 rounded-lg ${bg} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
      {icon}
    </div>
  </div>
);

export default Dashboard;
