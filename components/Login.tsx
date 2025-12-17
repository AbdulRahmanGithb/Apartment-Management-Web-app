
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../App';
import { MOCK_USERS, BUILDING_IMAGES } from '../constants';
import { Building, UserCircle2, KeyRound } from 'lucide-react';
import { UserRole } from '../types';

const Login: React.FC = () => {
  const { login } = useAppContext();
  const navigate = useNavigate();

  const handleLogin = (userId: string) => {
    login(userId);
    navigate('/');
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0"
        style={{
            backgroundImage: `url(${BUILDING_IMAGES[0].url})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(4px) brightness(0.6)'
        }}
      />

      <div className="bg-white/95 backdrop-blur-sm p-8 rounded-2xl shadow-2xl w-full max-w-md z-10 border border-white/20">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg shadow-blue-500/30">
            <Building size={32} />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Skyline Heights</h1>
          <p className="text-slate-500">Jubilee Hills, Hyderabad</p>
        </div>

        <div className="space-y-4">
          <p className="text-sm font-medium text-slate-600 uppercase tracking-wider mb-2 text-center">Select User Type</p>
          
          {MOCK_USERS.map(user => {
            const isOwner = user.role === UserRole.ADMIN;
            const displayName = isOwner ? 'Owner' : 'Resident';
            const displayDesc = isOwner ? 'Admin & Management Access' : 'Resident Dashboard Access';
            const Icon = isOwner ? KeyRound : UserCircle2;

            return (
              <button
                key={user.id}
                onClick={() => handleLogin(user.id)}
                className="w-full flex items-center justify-between p-4 border border-slate-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all group bg-white"
              >
                <div className="flex items-center gap-4">
                   <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isOwner ? 'bg-purple-100 text-purple-600 group-hover:bg-purple-200' : 'bg-green-100 text-green-600 group-hover:bg-green-200'}`}>
                      <Icon size={20} />
                   </div>
                   <div className="text-left">
                    <p className="font-bold text-lg text-slate-800 group-hover:text-blue-700">{displayName}</p>
                    <p className="text-xs text-slate-500">{displayDesc}</p>
                  </div>
                </div>
                <div className="text-slate-300 group-hover:text-blue-600 transition-colors">
                  →
                </div>
              </button>
            );
          })}
        </div>
        
        <div className="mt-8 pt-6 border-t border-slate-200 text-center">
          <p className="text-xs text-slate-400">Secure Access • Role Based Control • Watermarked Vault</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
