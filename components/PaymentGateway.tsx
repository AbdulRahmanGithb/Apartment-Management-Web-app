
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../App';
import { UserRole } from '../types';
import { CheckCircle, Smartphone, CreditCard, ArrowRight, Wallet, ShieldCheck, Loader2, Building, History, QrCode, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PaymentGateway: React.FC = () => {
  const { currentUser, payments, updatePayment, flats } = useAppContext();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);
  const [step, setStep] = useState<'SUMMARY' | 'SCAN' | 'SUCCESS'>('SUMMARY');
  
  // State to track which flat is being paid for. 
  // Default to user's flat if resident, or first flat if admin/other.
  const [selectedFlatId, setSelectedFlatId] = useState<string>('');

  useEffect(() => {
      // Only set initial value if not already set
      if (!selectedFlatId) {
          if (currentUser?.flatId) {
              setSelectedFlatId(currentUser.flatId);
          } else if (flats.length > 0) {
              setSelectedFlatId(flats[0].id);
          }
      }
  }, [currentUser, flats, selectedFlatId]);

  // Derived calculations based on selection
  const selectedFlat = flats.find(f => f.id === selectedFlatId);
  const pendingPayments = payments.filter(p => p.flatId === selectedFlatId && (p.status === 'PENDING' || p.status === 'OVERDUE'));
  const totalDue = pendingPayments.reduce((acc, curr) => acc + curr.amount, 0);

  const handlePay = () => {
    setProcessing(true);
    // Simulate API delay
    setTimeout(() => {
        setProcessing(false);
        setStep('SUCCESS');
        
        // Update payments to PAID
        pendingPayments.forEach(p => {
            updatePayment({ ...p, status: 'PAID' });
        });
    }, 2500);
  };

  if (!selectedFlatId && flats.length === 0) {
    return (
        <div className="flex items-center justify-center h-full text-slate-400">
            <p>Loading payment details...</p>
        </div>
    );
  }

  return (
    <div className="min-h-full flex flex-col items-center justify-center p-4 md:p-8 bg-slate-50 relative overflow-hidden">
      
      {/* GPay Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-64 bg-[#1a73e8] rounded-b-[3rem] shadow-lg z-0" />
      
      <div className="relative z-10 w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col min-h-[600px] border border-slate-100">
        
        {/* Header */}
        <div className="bg-[#1a73e8] p-6 text-white text-center pb-12">
            <div className="flex items-center justify-center gap-2 mb-4 opacity-90">
                <span className="font-bold text-2xl tracking-tight">GPay</span>
            </div>
            {step === 'SUMMARY' && (
                <div className="animate-in fade-in zoom-in duration-500">
                     <p className="text-blue-100 text-sm font-medium uppercase tracking-wider mb-1">Total Payable</p>
                     <h1 className="text-5xl font-bold">₹{totalDue.toLocaleString()}</h1>
                </div>
            )}
        </div>

        {/* Content Body */}
        <div className="flex-1 -mt-6 bg-white rounded-t-3xl p-6 flex flex-col">
            
            {step === 'SUMMARY' && (
                <div className="flex-1 flex flex-col animate-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100 mb-6 relative group">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 shrink-0">
                            <Building size={24} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-bold text-slate-800 truncate">Skyline Heights</p>
                            <div className="flex items-center gap-2 mt-1 relative">
                                <span className="text-xs text-slate-500 shrink-0">Flat:</span>
                                <div className="relative flex-1">
                                    <select 
                                        value={selectedFlatId} 
                                        onChange={(e) => setSelectedFlatId(e.target.value)}
                                        className="appearance-none w-full bg-white border border-slate-300 text-slate-700 text-sm font-medium rounded-md py-1 pl-2 pr-6 outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-sm hover:border-blue-400 transition-colors"
                                    >
                                        {flats.map(f => (
                                            <option key={f.id} value={f.id}>
                                                {f.id} {f.ownerName ? `- ${f.ownerName.split(' ')[0]}` : ''}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 mb-8 flex-1 overflow-y-auto max-h-60 custom-scrollbar">
                         <h3 className="font-bold text-slate-700 text-sm flex justify-between items-center">
                            Bill Details
                            <span className="text-xs font-normal text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                                {selectedFlatId}
                            </span>
                         </h3>
                         {pendingPayments.length === 0 ? (
                             <div className="text-center py-8 text-slate-400 flex flex-col items-center gap-2">
                                 <CheckCircle size={48} className="text-green-500 mb-2" />
                                 <p>No pending dues for {selectedFlatId}!</p>
                             </div>
                         ) : (
                             pendingPayments.map(p => (
                                 <div key={p.id} className="flex justify-between items-center p-3 hover:bg-slate-50 rounded-lg transition-colors border-b border-slate-50 last:border-0">
                                     <div className="flex items-center gap-3">
                                         <div className="bg-orange-100 p-2 rounded text-orange-600">
                                            <History size={16} />
                                         </div>
                                         <div>
                                             <p className="font-medium text-slate-800 text-sm">{p.month}</p>
                                             <p className="text-xs text-slate-500">Due: {p.date}</p>
                                         </div>
                                     </div>
                                     <span className="font-bold text-slate-800">₹{p.amount}</span>
                                 </div>
                             ))
                         )}
                    </div>

                    {totalDue > 0 && (
                        <button 
                            onClick={() => setStep('SCAN')}
                            className="w-full bg-[#1a73e8] hover:bg-[#1557b0] text-white py-4 rounded-full font-bold text-lg shadow-lg shadow-blue-500/30 transition-all active:scale-95 flex items-center justify-center gap-2"
                        >
                            Proceed to Pay
                        </button>
                    )}
                    {totalDue === 0 && (
                        <button 
                            onClick={() => navigate('/')}
                            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-4 rounded-full font-bold text-lg transition-all"
                        >
                            Back to Dashboard
                        </button>
                    )}
                </div>
            )}

            {step === 'SCAN' && (
                <div className="flex-1 flex flex-col items-center justify-center text-center animate-in zoom-in duration-300">
                    {!processing ? (
                        <>
                            <div className="w-64 h-64 bg-slate-900 rounded-2xl p-4 shadow-2xl mb-6 relative group cursor-pointer" onClick={handlePay}>
                                <div className="absolute inset-0 border-2 border-[#1a73e8]/50 rounded-2xl animate-pulse"></div>
                                <div className="bg-white h-full w-full rounded-xl flex items-center justify-center overflow-hidden">
                                     {/* Simulated QR */}
                                     <QrCode size={180} className="text-slate-800" />
                                </div>
                                <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl">
                                    <span className="text-white font-bold">Click to Simulate Scan</span>
                                </div>
                            </div>
                            <p className="text-slate-600 font-medium mb-8">Scan QR or Tap below to Pay for <span className="font-bold text-slate-900">{selectedFlatId}</span></p>
                            
                            <div className="w-full space-y-3">
                                <button 
                                    onClick={handlePay}
                                    className="w-full bg-[#1a73e8] text-white py-4 rounded-full font-bold text-lg shadow-lg flex items-center justify-center gap-2"
                                >
                                    <Smartphone size={20} /> Pay ₹{totalDue.toLocaleString()}
                                </button>
                                <button 
                                    onClick={() => setStep('SUMMARY')}
                                    className="w-full text-slate-500 py-2 text-sm hover:text-slate-800"
                                >
                                    Cancel
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-20 h-20 border-4 border-blue-100 border-t-[#1a73e8] rounded-full animate-spin"></div>
                            <h3 className="text-xl font-bold text-slate-800">Processing Payment...</h3>
                            <p className="text-slate-500 text-sm">Securely connecting to bank</p>
                        </div>
                    )}
                </div>
            )}

            {step === 'SUCCESS' && (
                <div className="flex-1 flex flex-col items-center justify-center text-center animate-in zoom-in duration-500">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-6 shadow-green-200 shadow-xl">
                        <CheckCircle size={48} className="animate-bounce" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">Payment Successful!</h2>
                    <p className="text-slate-500 mb-2 max-w-[250px]">Transaction ID: GP-{Math.floor(Math.random()*1000000000)}</p>
                    <p className="text-slate-800 font-bold mb-8">Amount: ₹{totalDue.toLocaleString()}</p>
                    
                    <button 
                        onClick={() => { setStep('SUMMARY'); navigate('/finance'); }}
                        className="w-full bg-slate-900 text-white py-4 rounded-full font-bold shadow-lg"
                    >
                        Done
                    </button>
                </div>
            )}
        </div>

        {/* Footer Branding */}
        <div className="bg-slate-50 p-4 text-center border-t border-slate-100">
            <p className="text-xs text-slate-400 flex items-center justify-center gap-1">
                <ShieldCheck size={12} /> Secured by Google Pay
            </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentGateway;
