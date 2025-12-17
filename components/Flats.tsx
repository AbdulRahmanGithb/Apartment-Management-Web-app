
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useAppContext } from '../App';
import { Flat, Payment, FlatType, UserRole, ElectricityBill } from '../types';
import { BUILDING_IMAGES } from '../constants';
import { 
  Home, 
  UserCheck, 
  Ruler, 
  Layers, 
  X, 
  Phone, 
  Mail, 
  Car, 
  Users, 
  History,
  CheckCircle,
  AlertCircle,
  Clock,
  Pencil,
  Trash2,
  Plus,
  Zap,
  Activity,
  ArrowUp,
  Search,
  Filter,
  LayoutGrid,
  Rows,
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  FileText,
  Eye,
  Lock
} from 'lucide-react';

const Flats: React.FC = () => {
  const { flats, payments, electricityBills, currentUser, addFlat, updateFlat, deleteFlat } = useAppContext();
  
  // Interaction State
  const [selectedFlat, setSelectedFlat] = useState<Flat | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewMode, setViewMode] = useState<'BUILDING' | 'GRID'>('BUILDING');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('ALL');
  const [collapsedFloors, setCollapsedFloors] = useState<Set<string>>(new Set());
  
  // Document Viewer State (Lifted for global access)
  const [viewingDoc, setViewingDoc] = useState<{title: string, url: string} | null>(null);

  const isAdmin = currentUser?.role === UserRole.ADMIN;

  // Filter Logic
  const filteredFlats = useMemo(() => {
    return flats.filter(flat => {
      const matchesSearch = 
        flat.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
        flat.ownerName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = filterType === 'ALL' || flat.type === filterType;
      return matchesSearch && matchesType;
    });
  }, [flats, searchQuery, filterType]);

  // Grouping for Building View
  const floors = useMemo(() => {
    return filteredFlats.reduce((acc, flat) => {
      const floorNum = flat.id.split('-')[1].charAt(0);
      const floorKey = `Floor ${floorNum}`;
      if (!acc[floorKey]) acc[floorKey] = [];
      acc[floorKey].push(flat);
      return acc;
    }, {} as Record<string, Flat[]>);
  }, [filteredFlats]);

  const floorKeys = Object.keys(floors).sort((a, b) => {
    const numA = parseInt(a.split(' ')[1]) || 0;
    const numB = parseInt(b.split(' ')[1]) || 0;
    return numB - numA; 
  });

  // Stats
  const totalResidents = flats.length; // Assuming full occupancy based on mock
  const totalPending = payments.filter(p => p.status === 'PENDING').length;
  
  const toggleFloor = (floor: string) => {
      const newSet = new Set(collapsedFloors);
      if (newSet.has(floor)) newSet.delete(floor);
      else newSet.add(floor);
      setCollapsedFloors(newSet);
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
      e.stopPropagation();
      if(window.confirm('Are you sure you want to delete this flat?')) {
          deleteFlat(id);
      }
  };

  const handleEditClick = (e: React.MouseEvent, flat: Flat) => {
      e.stopPropagation();
      setSelectedFlat(flat);
      setIsEditing(true);
  };
  
  const handleViewBill = (e: React.MouseEvent, flat: Flat) => {
      e.stopPropagation();
      setViewingDoc({
          title: `Electricity Bill - ${flat.id}`,
          url: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=1000&auto=format&fit=crop" // Realistic document image
      });
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] -m-4 md:-m-8 p-4 md:p-8 overflow-hidden flex flex-col">
      {/* Immersive Background */}
      <div 
        className="absolute inset-0 z-0"
        style={{
            backgroundImage: `url(${BUILDING_IMAGES[0].url})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center 30%',
            filter: 'brightness(0.2) blur(3px)'
        }}
      />
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-slate-900 via-slate-900/90 to-slate-900/70" />

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto w-full space-y-8 pb-12">
        
        {/* Header & Stats */}
        <div className="flex flex-col gap-6">
            <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-white/10 pb-6">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                        <BuildingIcon /> Skyline Tower
                    </h1>
                    <p className="text-slate-400 mt-1 font-light text-sm">Interactive Digital Twin & Resident Directory</p>
                </div>
                
                {/* Stats Cards */}
                <div className="flex gap-4 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-3 min-w-[120px]">
                        <p className="text-xs text-slate-400 uppercase font-bold">Total Units</p>
                        <p className="text-xl font-bold text-white">{totalResidents}</p>
                    </div>
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-3 min-w-[120px]">
                        <p className="text-xs text-slate-400 uppercase font-bold">Occupancy</p>
                        <p className="text-xl font-bold text-green-400">100%</p>
                    </div>
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-3 min-w-[120px]">
                        <p className="text-xs text-slate-400 uppercase font-bold">Pending Dues</p>
                        <p className={`text-xl font-bold ${totalPending > 0 ? 'text-amber-400' : 'text-white'}`}>{totalPending}</p>
                    </div>
                </div>
            </div>

            {/* Toolbar */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-4 rounded-xl flex flex-col md:flex-row gap-4 items-center justify-between shadow-2xl">
                <div className="flex flex-1 gap-4 w-full md:w-auto">
                    {/* Search */}
                    <div className="relative flex-1 md:max-w-xs">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input 
                            type="text" 
                            placeholder="Search resident or flat..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-slate-900/50 border border-slate-700 rounded-lg py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors placeholder:text-slate-500"
                        />
                    </div>

                    {/* Filter */}
                    <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                            <Filter size={16} />
                        </div>
                        <select 
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="bg-slate-900/50 border border-slate-700 rounded-lg py-2 pl-10 pr-8 text-sm text-white focus:outline-none focus:border-blue-500 appearance-none cursor-pointer hover:bg-slate-800 transition-colors"
                        >
                            <option value="ALL">All Types</option>
                            <option value={FlatType.BHK2}>2 BHK</option>
                            <option value={FlatType.BHK3}>3 BHK</option>
                            <option value={FlatType.BHK4}>4 BHK</option>
                        </select>
                    </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                    {/* View Toggle */}
                    <div className="bg-slate-900/50 p-1 rounded-lg border border-slate-700 flex">
                        <button 
                            onClick={() => setViewMode('BUILDING')}
                            className={`p-2 rounded ${viewMode === 'BUILDING' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
                            title="Building View"
                        >
                            <Rows size={18} />
                        </button>
                        <button 
                            onClick={() => setViewMode('GRID')}
                            className={`p-2 rounded ${viewMode === 'GRID' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
                            title="Grid View"
                        >
                            <LayoutGrid size={18} />
                        </button>
                    </div>

                    {isAdmin && (
                        <button 
                            onClick={() => setShowAddModal(true)}
                            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-semibold transition-all shadow-lg shadow-blue-900/50 whitespace-nowrap"
                        >
                            <Plus size={18} /> <span className="hidden sm:inline">Add Unit</span>
                        </button>
                    )}
                </div>
            </div>
        </div>

        {viewMode === 'BUILDING' ? (
            <div className="flex gap-8">
                 {/* Visual Elevator Shaft */}
                 <div className="hidden lg:flex flex-col w-12 bg-slate-800/40 backdrop-blur-sm rounded-full border border-white/5 items-center py-4 relative overflow-hidden">
                      <div className="w-px h-full bg-slate-700/50 absolute top-0 left-1/2 -translate-x-1/2" />
                      <div className="w-1.5 h-full bg-slate-700/30 absolute top-0 left-1/3" />
                      <div className="w-1.5 h-full bg-slate-700/30 absolute top-0 right-1/3" />
                      
                      {/* Elevator Car Animation */}
                      <div className="w-8 h-12 bg-blue-600/20 border border-blue-500/50 rounded shadow-[0_0_20px_rgba(37,99,235,0.3)] absolute top-[20%] animate-pulse flex items-center justify-center">
                          <div className="w-4 h-6 border-t border-b border-blue-400/30" />
                      </div>
                 </div>

                 {/* Building Stack */}
                 <div className="flex-1 space-y-8">
                    {floorKeys.length === 0 ? (
                        <div className="text-center py-20 text-slate-500 bg-white/5 rounded-xl border border-white/5">
                            <Search size={48} className="mx-auto mb-4 opacity-50" />
                            <p>No flats found matching your filters.</p>
                        </div>
                    ) : (
                        floorKeys.map((floorName) => {
                            const floorFlats = floors[floorName];
                            const floorNum = floorName.split(' ')[1];
                            const isCollapsed = collapsedFloors.has(floorName);
                            
                            return (
                                <div key={floorName} className="relative group/floor">
                                    {/* Interactive Floor Header */}
                                    <button 
                                        onClick={() => toggleFloor(floorName)}
                                        className="w-full flex items-center gap-4 mb-4 group-hover/floor:opacity-100 opacity-70 transition-opacity"
                                    >
                                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                                        <div className="flex items-center gap-2 text-white/60 font-mono text-sm uppercase tracking-[0.2em] font-bold border border-white/10 px-4 py-1.5 rounded-full bg-slate-900/80 backdrop-blur hover:bg-slate-800 hover:border-blue-500/50 transition-all">
                                            Floor {floorNum.padStart(2, '0')}
                                            {isCollapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
                                        </div>
                                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                                    </button>

                                    {/* Flats Grid */}
                                    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-2 md:px-0 transition-all duration-500 ease-in-out ${isCollapsed ? 'max-h-0 opacity-0 overflow-hidden' : 'max-h-[500px] opacity-100'}`}>
                                        {floorFlats.map((flat) => (
                                        <div 
                                            key={flat.id} 
                                            onClick={() => { setSelectedFlat(flat); setIsEditing(false); }}
                                            className="group relative bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-5 hover:bg-white/10 transition-all duration-300 cursor-pointer overflow-hidden hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] flex flex-col h-full justify-between"
                                        >
                                            {/* Hover Actions Overlay */}
                                            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 z-10">
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); setSelectedFlat(flat); setIsEditing(false); }}
                                                    className="p-3 bg-white text-slate-900 rounded-full hover:scale-110 transition-transform shadow-lg"
                                                    title="View Details"
                                                >
                                                    <Activity size={20} />
                                                </button>
                                                <button 
                                                    onClick={(e) => handleViewBill(e, flat)}
                                                    className="p-3 bg-yellow-400 text-slate-900 rounded-full hover:scale-110 transition-transform shadow-lg"
                                                    title="View Electricity Bill"
                                                >
                                                    <FileText size={20} />
                                                </button>
                                                {isAdmin && (
                                                    <>
                                                        <button 
                                                            onClick={(e) => handleEditClick(e, flat)}
                                                            className="p-3 bg-blue-600 text-white rounded-full hover:scale-110 transition-transform shadow-lg"
                                                            title="Edit"
                                                        >
                                                            <Pencil size={20} />
                                                        </button>
                                                        <button 
                                                            onClick={(e) => handleDelete(e, flat.id)}
                                                            className="p-3 bg-red-600 text-white rounded-full hover:scale-110 transition-transform shadow-lg"
                                                            title="Delete"
                                                        >
                                                            <Trash2 size={20} />
                                                        </button>
                                                    </>
                                                )}
                                            </div>

                                            {/* Active Glow Line */}
                                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500 opacity-50 group-hover:opacity-100 transition-opacity" />

                                            <div className="flex items-start justify-between mb-4">
                                                <div>
                                                    <h3 className="text-2xl font-bold text-white tracking-wide">{flat.id}</h3>
                                                    <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                                                        flat.type === FlatType.BHK4 ? 'bg-purple-500/20 text-purple-300' :
                                                        flat.type === FlatType.BHK3 ? 'bg-blue-500/20 text-blue-300' :
                                                        'bg-slate-500/20 text-slate-300'
                                                    }`}>
                                                        {flat.type}
                                                    </span>
                                                </div>
                                                <div className="p-2 bg-white/5 rounded-lg text-white/60 group-hover:text-yellow-400 group-hover:bg-white/10 transition-colors">
                                                    <Home size={20} />
                                                </div>
                                            </div>
                                            
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-3 text-slate-400 text-sm bg-white/5 p-2 rounded-lg">
                                                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-white/5">
                                                        <Users size={14} className="text-slate-300" />
                                                    </div>
                                                    <span className="truncate text-slate-200 font-medium">{flat.ownerName}</span>
                                                </div>
                                                
                                                <div className="flex items-center justify-between text-slate-400 text-xs px-1">
                                                    <span className="flex items-center gap-1"><Ruler size={12} /> {flat.sqFt} sqft</span>
                                                    <span className="flex items-center gap-1 text-green-400"><Zap size={12} /> Active</span>
                                                </div>
                                            </div>
                                        </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })
                    )}
                 </div>
            </div>
        ) : (
            // Grid View
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredFlats.map((flat) => (
                    <div 
                        key={flat.id}
                        onClick={() => { setSelectedFlat(flat); setIsEditing(false); }}
                        className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
                    >
                        <div className="h-2 bg-slate-900 group-hover:bg-blue-600 transition-colors" />
                        <div className="p-5">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-xl font-bold text-slate-800">{flat.id}</h3>
                                <span className="text-xs font-semibold bg-slate-100 px-2 py-1 rounded text-slate-600">{flat.type}</span>
                            </div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                                    {flat.ownerName.charAt(0)}
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-900">{flat.ownerName}</p>
                                    <p className="text-xs text-slate-500">Owner</p>
                                </div>
                            </div>
                            <div className="pt-4 border-t border-slate-100 flex justify-between items-center text-sm text-slate-500">
                                <span className="flex items-center gap-1"><Ruler size={14} /> {flat.sqFt} sqft</span>
                                <div className="flex gap-2">
                                     <button onClick={(e) => handleViewBill(e, flat)} className="text-slate-400 hover:text-yellow-600 transition-colors" title="View Bill"><FileText size={16}/></button>
                                     {isAdmin && (
                                        <>
                                            <button onClick={(e) => handleEditClick(e, flat)} className="hover:text-blue-600"><Pencil size={16}/></button>
                                            <button onClick={(e) => handleDelete(e, flat.id)} className="hover:text-red-600"><Trash2 size={16}/></button>
                                        </>
                                     )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )}

        {/* Lobby Decoration in Building View */}
        {viewMode === 'BUILDING' && floorKeys.length > 0 && (
            <div className="mt-12 border-t border-white/10 pt-8 flex justify-center animate-in fade-in slide-in-from-bottom-4">
                 <div className="text-center">
                     <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/5 border border-white/10 text-white/50 text-sm font-mono shadow-lg backdrop-blur-sm">
                        <ArrowUp size={14} className="animate-bounce" /> LOBBY & RECEPTION
                     </div>
                 </div>
            </div>
        )}

      </div>

      {/* Detail Modal */}
      {selectedFlat && !isEditing && (
        <FlatDetailModal 
            flat={selectedFlat} 
            payments={payments.filter(p => p.flatId === selectedFlat.id)}
            electricityBill={electricityBills.find(b => b.flatId === selectedFlat.id) || null}
            onClose={() => setSelectedFlat(null)} 
            onViewDoc={(doc) => setViewingDoc(doc)}
        />
      )}

      {/* Edit Form Modal */}
      {(isEditing && selectedFlat) && (
          <FlatFormModal 
            flat={selectedFlat} 
            onClose={() => { setIsEditing(false); setSelectedFlat(null); }}
            onSave={(updatedFlat) => { updateFlat(updatedFlat); setIsEditing(false); setSelectedFlat(null); }}
          />
      )}

      {/* Add Form Modal */}
      {showAddModal && (
          <FlatFormModal 
            flat={null} 
            onClose={() => setShowAddModal(false)}
            onSave={(newFlat) => { addFlat(newFlat); setShowAddModal(false); }}
          />
      )}

      {/* Global Secure Document Viewer Overlay */}
      {viewingDoc && (
        <div className="fixed inset-0 z-[60] bg-black/90 flex flex-col items-center justify-center p-4 animate-in fade-in duration-200">
             <div className="w-full max-w-4xl flex justify-between items-center text-white mb-4">
                 <h3 className="font-bold flex items-center gap-2"><Lock size={16} className="text-red-500" /> Protected View: {viewingDoc.title}</h3>
                 <button onClick={() => setViewingDoc(null)} className="hover:text-red-400"><X size={24}/></button>
             </div>
             <div className="bg-slate-800 p-1 rounded-lg shadow-2xl overflow-hidden max-h-[80vh] overflow-y-auto w-full flex justify-center">
                <WatermarkedImage src={viewingDoc.url} watermarkText={`CONFIDENTIAL - ${currentUser?.id || 'GUEST'}`} />
             </div>
        </div>
      )}
    </div>
  );
};

// SVG Icon for the Header
const BuildingIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
        <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
        <line x1="9" y1="22" x2="9" y2="22.01"></line>
        <line x1="15" y1="22" x2="15" y2="22.01"></line>
        <line x1="12" y1="22" x2="12" y2="22.01"></line>
        <line x1="12" y1="2" x2="12" y2="22"></line>
        <line x1="4" y1="10" x2="20" y2="10"></line>
        <line x1="4" y1="14" x2="20" y2="14"></line>
        <line x1="4" y1="18" x2="20" y2="18"></line>
        <line x1="4" y1="6" x2="20" y2="6"></line>
    </svg>
);

const FlatFormModal = ({ flat, onClose, onSave }: { flat: Flat | null, onClose: () => void, onSave: (f: Flat) => void }) => {
    const [formData, setFormData] = useState<Flat>(flat || {
        id: '',
        ownerName: '',
        type: FlatType.BHK2,
        sqFt: 1200,
        maintenanceRate: 500
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'sqFt' || name === 'maintenanceRate' ? Number(value) : value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="bg-slate-900 text-white p-4 flex justify-between items-center">
                    <h3 className="font-bold">{flat ? 'Edit Flat' : 'Add New Flat'}</h3>
                    <button onClick={onClose}><X size={20}/></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Flat Number (ID)</label>
                        <input name="id" value={formData.id} onChange={handleChange} className="w-full border p-2 rounded" placeholder="e.g. A-101" required disabled={!!flat} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Owner Name</label>
                        <input name="ownerName" value={formData.ownerName} onChange={handleChange} className="w-full border p-2 rounded" placeholder="Full Name" required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                            <select name="type" value={formData.type} onChange={handleChange} className="w-full border p-2 rounded">
                                {Object.values(FlatType).map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Sq Ft</label>
                            <input type="number" name="sqFt" value={formData.sqFt} onChange={handleChange} className="w-full border p-2 rounded" required />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Maintenance Rate (₹)</label>
                        <input type="number" name="maintenanceRate" value={formData.maintenanceRate} onChange={handleChange} className="w-full border p-2 rounded" required />
                    </div>
                    <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-medium mt-2">
                        Save Details
                    </button>
                </form>
            </div>
        </div>
    );
};

// Helper component for watermark
const WatermarkedImage = ({ src, watermarkText }: { src: string, watermarkText: string }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = src;
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            
            // Watermark
            ctx.globalAlpha = 0.15;
            ctx.font = 'bold 48px Arial';
            ctx.fillStyle = 'red';
            ctx.textAlign = 'center';
            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.rotate(-Math.PI / 4);
             for (let i = -1000; i < 1000; i += 200) {
                ctx.fillText(watermarkText, 0, i);
            }
        };
    }, [src, watermarkText]);

    return <canvas ref={canvasRef} className="max-w-full h-auto shadow-2xl" />;
}

const FlatDetailModal = ({ flat, payments, electricityBill, onClose, onViewDoc }: { flat: Flat, payments: Payment[], electricityBill: ElectricityBill | null, onClose: () => void, onViewDoc: (doc: {title: string, url: string}) => void }) => {
    const { currentUser } = useAppContext();

    // Derived Calculations
    const totalDue = payments.filter(p => p.status === 'PENDING' || p.status === 'OVERDUE').reduce((sum, p) => sum + p.amount, 0);

    // Mock Extended Data
    const mockData = {
        phone: "+91 98765 43210",
        email: flat.ownerName.toLowerCase().replace(' ', '.') + "@example.com"
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
                {/* Modal Header */}
                <div className="bg-slate-900 text-white p-6 flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h2 className="text-2xl font-bold">{flat.id}</h2>
                            <span className="bg-blue-600 text-xs px-2 py-1 rounded font-bold uppercase tracking-wider">{flat.type}</span>
                        </div>
                        <p className="text-slate-400 flex items-center gap-2 text-sm"><UserCheck size={14}/> {flat.ownerName}</p>
                    </div>
                    <button onClick={onClose} className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"><X size={20} /></button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Column 1: Info & Contact */}
                        <div className="space-y-6">
                            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2 text-sm uppercase tracking-wide">
                                    <Home size={16} className="text-blue-500" /> Property Details
                                </h3>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between border-b border-slate-50 pb-2">
                                        <span className="text-slate-500">Area</span>
                                        <span className="font-medium text-slate-800">{flat.sqFt} sq. ft.</span>
                                    </div>
                                    <div className="flex justify-between border-b border-slate-50 pb-2">
                                        <span className="text-slate-500">Maintenance</span>
                                        <span className="font-medium text-slate-800">₹{flat.maintenanceRate}/mo</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Parking Slot</span>
                                        <span className="font-medium text-slate-800 flex items-center gap-1"><Car size={14} /> P-{flat.id.split('-')[1]}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2 text-sm uppercase tracking-wide">
                                    <Phone size={16} className="text-green-500" /> Contact Info
                                </h3>
                                <div className="space-y-3 text-sm">
                                    <div className="flex items-center gap-3 text-slate-600">
                                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center"><Phone size={14}/></div>
                                        <span>{mockData.phone}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-slate-600">
                                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center"><Mail size={14}/></div>
                                        <span className="truncate">{mockData.email}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Column 2: Financial Status */}
                        <div className="md:col-span-2 space-y-6">
                             {/* Stats Row */}
                             <div className="grid grid-cols-2 gap-4">
                                 <div className={`p-4 rounded-xl border ${totalDue > 0 ? 'bg-red-50 border-red-100' : 'bg-green-50 border-green-100'}`}>
                                     <p className="text-xs font-bold uppercase tracking-wider mb-1 opacity-60">Maintenance Dues</p>
                                     <p className={`text-2xl font-bold ${totalDue > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                         {totalDue > 0 ? `₹${totalDue}` : 'Cleared'}
                                     </p>
                                 </div>
                                 <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm relative group">
                                     <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button 
                                            onClick={() => onViewDoc({title: `Electricity Bill - Oct 2023`, url: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=1000&auto=format&fit=crop"})} 
                                            className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded hover:bg-blue-200 flex items-center gap-1"
                                        >
                                            <Eye size={12}/> View
                                        </button>
                                     </div>
                                     <p className="text-xs font-bold uppercase tracking-wider mb-1 opacity-60 text-slate-500">Electricity (Oct)</p>
                                     <div className="flex items-end justify-between">
                                         <p className="text-2xl font-bold text-slate-800">₹{electricityBill?.amount || 0}</p>
                                         <span className={`text-xs px-2 py-1 rounded font-bold ${electricityBill?.status === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                            {electricityBill?.status || 'N/A'}
                                         </span>
                                     </div>
                                 </div>
                             </div>

                             {/* Payment History */}
                             <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                                 <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                                     <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2"><History size={16}/> Payment History</h3>
                                 </div>
                                 <table className="w-full text-sm text-left">
                                     <thead className="text-xs text-slate-500 uppercase bg-slate-50">
                                         <tr>
                                             <th className="px-4 py-2">Month</th>
                                             <th className="px-4 py-2">Date</th>
                                             <th className="px-4 py-2">Amount</th>
                                             <th className="px-4 py-2">Status</th>
                                         </tr>
                                     </thead>
                                     <tbody className="divide-y divide-slate-100">
                                         {payments.length === 0 ? (
                                             <tr><td colSpan={4} className="px-4 py-4 text-center text-slate-400">No payment records found</td></tr>
                                         ) : (
                                             payments.map(p => (
                                                 <tr key={p.id} className="hover:bg-slate-50">
                                                     <td className="px-4 py-2 font-medium">{p.month}</td>
                                                     <td className="px-4 py-2 text-slate-500">{p.date}</td>
                                                     <td className="px-4 py-2">₹{p.amount}</td>
                                                     <td className="px-4 py-2">
                                                         <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                                                             p.status === 'PAID' ? 'bg-green-500' : p.status === 'PENDING' ? 'bg-amber-500' : 'bg-red-500'
                                                         }`}></span>
                                                         {p.status}
                                                     </td>
                                                 </tr>
                                             ))
                                         )}
                                     </tbody>
                                 </table>
                             </div>

                             {/* Documents Preview (Mock) */}
                             {currentUser?.role === UserRole.ADMIN && (
                                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                                     <h3 className="font-bold text-slate-800 text-sm mb-4 flex items-center gap-2"><FileText size={16}/> Owner Documents</h3>
                                     <div className="flex gap-4">
                                         {['Deed', 'ID Proof', 'Electricity Bill'].map((doc, i) => (
                                             <div 
                                                key={i} 
                                                onClick={() => onViewDoc({
                                                    title: `${doc} - ${flat.ownerName}`, 
                                                    url: doc === 'Electricity Bill' 
                                                        ? "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=1000&auto=format&fit=crop"
                                                        : "https://images.unsplash.com/photo-1618044733300-9472054094ee?q=80&w=1000&auto=format&fit=crop"
                                                })}
                                                className="w-24 h-32 bg-slate-100 border border-slate-200 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-slate-200 transition-colors group relative overflow-hidden"
                                             >
                                                 <FileText className="text-slate-400 mb-2 group-hover:scale-110 transition-transform"/>
                                                 <span className="text-xs text-slate-500 font-medium text-center px-1">{doc}</span>
                                                 <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                     <Eye className="text-white" size={20} />
                                                 </div>
                                             </div>
                                         ))}
                                     </div>
                                </div>
                             )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Flats;
