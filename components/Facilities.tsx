import React, { useState, useEffect } from 'react';
import { useAppContext } from '../App';
import { Facility, UserRole } from '../types';
import { CheckCircle, AlertTriangle, XCircle, Wrench, Plus, Pencil, Trash2, X, Droplets, Power, Activity, Waves, Gauge, ArrowDown, ArrowUp } from 'lucide-react';

const Facilities: React.FC = () => {
  const { facilities, updateFacility, addFacility, deleteFacility, currentUser } = useAppContext();
  const isAdmin = currentUser?.role === UserRole.ADMIN;
  
  const [editingFacility, setEditingFacility] = useState<Facility | null>(null);
  const [showModal, setShowModal] = useState(false);

  const getStatusColor = (status: string) => {
    switch(status) {
        case 'OPERATIONAL': return 'bg-green-100 text-green-700 border-green-200';
        case 'UNDER_MAINTENANCE': return 'bg-amber-100 text-amber-700 border-amber-200';
        case 'CLOSED': return 'bg-red-100 text-red-700 border-red-200';
        default: return 'bg-slate-100';
    }
  };

  const getIcon = (status: string) => {
    switch(status) {
        case 'OPERATIONAL': return <CheckCircle size={20} />;
        case 'UNDER_MAINTENANCE': return <Wrench size={20} />;
        case 'CLOSED': return <XCircle size={20} />;
        default: return <AlertTriangle size={20} />;
    }
  };

  const handleDelete = (id: string) => {
      if(window.confirm('Delete this facility?')) deleteFacility(id);
  };

  return (
    <div className="space-y-8">
       <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Facilities & Amenities</h1>
            <p className="text-slate-500">Live status of society common areas and utilities.</p>
          </div>
          {isAdmin && (
              <button onClick={() => setShowModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium">
                  <Plus size={18} /> Add Facility
              </button>
          )}
        </div>

        {/* Water Management Section */}
        <WaterControlPanel isAdmin={isAdmin} />

        <h2 className="text-lg font-bold text-slate-800 pt-4">Common Areas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {facilities.map((facility) => (
                <div key={facility.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 relative overflow-hidden group">
                    {isAdmin && (
                        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => { setEditingFacility(facility); setShowModal(true); }} className="p-1.5 bg-slate-100 hover:bg-blue-100 text-blue-600 rounded-full"><Pencil size={14}/></button>
                            <button onClick={() => handleDelete(facility.id)} className="p-1.5 bg-slate-100 hover:bg-red-100 text-red-600 rounded-full"><Trash2 size={14}/></button>
                        </div>
                    )}
                    <div className="flex justify-between items-start mb-4">
                        <div className={`p-3 rounded-full ${getStatusColor(facility.status)} bg-opacity-20`}>
                            {getIcon(facility.status)}
                        </div>
                        <span className={`text-xs font-bold px-2 py-1 rounded border ${getStatusColor(facility.status)}`}>
                            {facility.status.replace('_', ' ')}
                        </span>
                    </div>
                    
                    <h3 className="text-lg font-bold text-slate-800 mb-1">{facility.name}</h3>
                    <p className="text-sm text-slate-500 mb-6">Last Serviced: {facility.lastServiced}</p>

                    {isAdmin && (
                        <div className="pt-4 border-t border-slate-100">
                            <p className="text-xs font-semibold text-slate-400 uppercase mb-2">Quick Status Update</p>
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => updateFacility({...facility, status: 'OPERATIONAL'})}
                                    className="flex-1 py-1 px-2 text-xs font-medium rounded bg-green-50 text-green-700 hover:bg-green-100 border border-green-200"
                                >
                                    Working
                                </button>
                                <button 
                                    onClick={() => updateFacility({...facility, status: 'UNDER_MAINTENANCE'})}
                                    className="flex-1 py-1 px-2 text-xs font-medium rounded bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200"
                                >
                                    Repair
                                </button>
                                <button 
                                    onClick={() => updateFacility({...facility, status: 'CLOSED'})}
                                    className="flex-1 py-1 px-2 text-xs font-medium rounded bg-red-50 text-red-700 hover:bg-red-100 border border-red-200"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>

        {showModal && (
            <FacilityFormModal 
                facility={editingFacility} 
                onClose={() => { setShowModal(false); setEditingFacility(null); }}
                onSave={(f) => {
                    if(editingFacility) updateFacility(f);
                    else addFacility(f);
                    setShowModal(false);
                    setEditingFacility(null);
                }}
            />
        )}
    </div>
  );
};

// --- Water Control Component ---

const WaterControlPanel = ({ isAdmin }: { isAdmin: boolean }) => {
    const [tankLevel, setTankLevel] = useState(65); // Percentage
    const [isMotorOn, setIsMotorOn] = useState(false);
    const [isReleasing, setIsReleasing] = useState(false); // Valve to flats
    const MAX_CAPACITY = 10000; // Liters

    // Simulation Loop
    useEffect(() => {
        const interval = setInterval(() => {
            setTankLevel((prev) => {
                let change = 0;
                
                // Motor adds water
                if (isMotorOn) change += 0.8;
                
                // Releasing drains water fast
                if (isReleasing) change -= 0.5;
                
                // Natural usage (slow drain)
                if (!isMotorOn && !isReleasing) change -= 0.05;

                let newLevel = prev + change;
                
                // Auto cut-off logic for motor
                if (newLevel >= 100 && isMotorOn) {
                    setIsMotorOn(false); // Auto stop
                    newLevel = 100;
                }
                
                // Dry run protection logic
                if (newLevel <= 0) {
                    setIsReleasing(false); // Stop releasing if empty
                    newLevel = 0;
                }

                return newLevel;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [isMotorOn, isReleasing]);

    const toggleMotor = () => {
        if(!isAdmin) { alert("Access Denied: Only Admins can operate the Main Motor."); return; }
        if(tankLevel >= 100 && !isMotorOn) { alert("Tank is already full!"); return; }
        setIsMotorOn(!isMotorOn);
    };

    const toggleRelease = () => {
        if(!isAdmin) { alert("Access Denied: Only Admins can operate distribution valves."); return; }
        if(tankLevel <= 0 && !isReleasing) { alert("Tank is empty! Cannot release water."); return; }
        setIsReleasing(!isReleasing);
    };

    return (
        <div className="bg-gradient-to-br from-blue-900 to-slate-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 p-10 opacity-5">
                <Waves size={300} />
            </div>

            <div className="flex flex-col lg:flex-row gap-8 relative z-10">
                {/* Visual Tank */}
                <div className="flex-shrink-0 flex gap-6 items-end">
                    <div className="w-32 h-48 bg-slate-800/50 rounded-xl border border-slate-600 relative overflow-hidden flex flex-col justify-end backdrop-blur-sm">
                        {/* Water Level Animation */}
                        <div 
                            className="bg-blue-500/80 w-full transition-all duration-1000 ease-in-out relative"
                            style={{ height: `${tankLevel}%` }}
                        >
                            <div className="absolute top-0 w-full h-2 bg-blue-400 opacity-50 animate-pulse" />
                            {/* Bubbles if filling */}
                            {isMotorOn && (
                                <div className="absolute inset-0 flex justify-around">
                                    <span className="w-1 h-1 bg-white/40 rounded-full animate-bounce delay-75"></span>
                                    <span className="w-2 h-2 bg-white/40 rounded-full animate-bounce delay-150"></span>
                                    <span className="w-1 h-1 bg-white/40 rounded-full animate-bounce delay-300"></span>
                                </div>
                            )}
                        </div>
                        {/* Level Text */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <span className="font-bold text-2xl drop-shadow-md">{Math.round(tankLevel)}%</span>
                        </div>
                    </div>
                    
                    <div className="space-y-4 pb-2">
                        <div>
                            <p className="text-slate-400 text-xs uppercase tracking-wider font-semibold">Current Volume</p>
                            <p className="text-2xl font-bold font-mono">{Math.round((tankLevel/100) * MAX_CAPACITY).toLocaleString()} L</p>
                        </div>
                        <div>
                            <p className="text-slate-400 text-xs uppercase tracking-wider font-semibold">Pressure</p>
                            <div className="flex items-center gap-2">
                                <Gauge size={18} className={tankLevel > 20 ? "text-green-400" : "text-red-400"} />
                                <span className="font-medium">{tankLevel > 20 ? '45 PSI (Normal)' : 'Low Pressure'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Controls & Status */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* Motor Control Card */}
                    <div className={`p-5 rounded-xl border transition-all ${isMotorOn ? 'bg-blue-600/20 border-blue-500/50' : 'bg-slate-800/50 border-slate-700'}`}>
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${isMotorOn ? 'bg-green-500 text-white shadow-[0_0_15px_rgba(34,197,94,0.5)]' : 'bg-slate-700 text-slate-400'}`}>
                                    <Power size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold">Main Motor</h3>
                                    <p className="text-xs text-slate-400">Borewell to Overhead Tank</p>
                                </div>
                            </div>
                            {isMotorOn && <Activity size={20} className="text-green-400 animate-pulse" />}
                        </div>
                        <div className="flex items-center justify-between mt-6">
                            <div className="text-xs font-mono text-slate-300">
                                Status: <span className={isMotorOn ? "text-green-400 font-bold" : "text-slate-500"}>{isMotorOn ? 'PUMPING' : 'IDLE'}</span>
                            </div>
                            <button 
                                onClick={toggleMotor}
                                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                                    isMotorOn 
                                    ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg' 
                                    : 'bg-green-600 hover:bg-green-700 text-white shadow-lg'
                                }`}
                            >
                                {isMotorOn ? 'STOP MOTOR' : 'START MOTOR'}
                            </button>
                        </div>
                    </div>

                    {/* Distribution Control Card */}
                    <div className={`p-5 rounded-xl border transition-all ${isReleasing ? 'bg-purple-600/20 border-purple-500/50' : 'bg-slate-800/50 border-slate-700'}`}>
                         <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${isReleasing ? 'bg-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.5)]' : 'bg-slate-700 text-slate-400'}`}>
                                    <Droplets size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold">Supply Valve</h3>
                                    <p className="text-xs text-slate-400">Overhead Tank to Flats</p>
                                </div>
                            </div>
                            {isReleasing && <Waves size={20} className="text-purple-400 animate-pulse" />}
                        </div>
                         <div className="flex items-center justify-between mt-6">
                            <div className="text-xs font-mono text-slate-300">
                                Flow: <span className={isReleasing ? "text-purple-400 font-bold" : "text-slate-500"}>{isReleasing ? 'RELEASING' : 'CLOSED'}</span>
                            </div>
                            <button 
                                onClick={toggleRelease}
                                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                                    isReleasing 
                                    ? 'bg-slate-600 hover:bg-slate-700 text-white' 
                                    : 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg'
                                }`}
                            >
                                {isReleasing ? 'CLOSE VALVE' : 'OPEN VALVE'}
                            </button>
                        </div>
                    </div>
                    
                    {/* Status Footer */}
                    <div className="md:col-span-2 bg-black/20 rounded-lg p-3 flex items-center justify-between text-xs text-slate-400">
                        <span className="flex items-center gap-2">
                             {tankLevel < 15 && <span className="flex items-center gap-1 text-red-400 font-bold animate-bounce"><AlertTriangle size={12}/> LOW WATER WARNING</span>}
                             {tankLevel >= 95 && <span className="flex items-center gap-1 text-yellow-400 font-bold"><AlertTriangle size={12}/> TANK NEAR FULL</span>}
                             {tankLevel >= 15 && tankLevel < 95 && <span className="flex items-center gap-1 text-green-400"><CheckCircle size={12}/> SYSTEM OPTIMAL</span>}
                        </span>
                        <span>Auto-Cutoff Enabled</span>
                    </div>

                </div>
            </div>
        </div>
    );
};

const FacilityFormModal = ({ facility, onClose, onSave }: { facility: Facility | null, onClose: () => void, onSave: (f: Facility) => void }) => {
    const [formData, setFormData] = useState<Facility>(facility || {
        id: `fac-${Date.now()}`,
        name: '',
        status: 'OPERATIONAL',
        lastServiced: new Date().toISOString().split('T')[0]
    });

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white w-full max-w-sm rounded-xl p-6 shadow-xl animate-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg">{facility ? 'Edit Facility' : 'New Facility'}</h3>
                    <button onClick={onClose}><X size={20} className="text-slate-400" /></button>
                </div>
                <div className="space-y-3">
                    <input className="w-full border p-2 rounded" placeholder="Facility Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                    <input className="w-full border p-2 rounded" type="date" placeholder="Last Serviced" value={formData.lastServiced} onChange={e => setFormData({...formData, lastServiced: e.target.value})} />
                    <select className="w-full border p-2 rounded" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as any})}>
                        <option value="OPERATIONAL">OPERATIONAL</option>
                        <option value="UNDER_MAINTENANCE">UNDER MAINTENANCE</option>
                        <option value="CLOSED">CLOSED</option>
                    </select>
                    <button onClick={() => onSave(formData)} className="w-full bg-blue-600 text-white py-2 rounded font-medium mt-2">Save</button>
                </div>
            </div>
        </div>
    );
};

export default Facilities;