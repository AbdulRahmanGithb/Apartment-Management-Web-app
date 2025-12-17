
import React, { useState } from 'react';
import { useAppContext } from '../App';
import { UserRole } from '../types';
import { MessageSquare, Plus, Send, Trash2, ThumbsUp, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { BUILDING_IMAGES } from '../constants';

const Suggestions: React.FC = () => {
  const { suggestions, currentUser, addSuggestion, updateSuggestion, deleteSuggestion } = useAppContext();
  const [showForm, setShowForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const isAdmin = currentUser?.role === UserRole.ADMIN;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUser && newTitle && newDesc) {
      addSuggestion({
        id: `s-${Date.now()}`,
        userId: currentUser.id,
        userName: currentUser.name,
        title: newTitle,
        description: newDesc,
        date: new Date().toISOString().split('T')[0],
        status: 'OPEN',
        upvotes: 0
      });
      setNewTitle('');
      setNewDesc('');
      setShowForm(false);
    }
  };

  const handleVote = (id: string) => {
      const suggestion = suggestions.find(s => s.id === id);
      if(suggestion) {
          updateSuggestion({ ...suggestion, upvotes: suggestion.upvotes + 1 });
      }
  };

  const handleStatusChange = (id: string, newStatus: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED') => {
      const suggestion = suggestions.find(s => s.id === id);
      if(suggestion) {
          updateSuggestion({ ...suggestion, status: newStatus });
      }
  };

  const handleDelete = (id: string) => {
      if(window.confirm('Delete this suggestion?')) deleteSuggestion(id);
  };

  const getStatusColor = (status: string) => {
      switch(status) {
          case 'OPEN': return 'bg-blue-100 text-blue-700 border-blue-200';
          case 'IN_PROGRESS': return 'bg-amber-100 text-amber-700 border-amber-200';
          case 'RESOLVED': return 'bg-green-100 text-green-700 border-green-200';
          default: return 'bg-slate-100 text-slate-700';
      }
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] -m-4 md:-m-8 p-4 md:p-8">
      {/* Background Image Layer */}
      <div className="absolute inset-0 z-0 overflow-hidden">
          <div 
             className="absolute inset-0 bg-cover bg-center transform scale-110 hover:scale-100 transition-transform duration-[30s]"
             style={{ backgroundImage: `url(${BUILDING_IMAGES[3].url})` }}
          />
          <div className="absolute inset-0 bg-slate-50/90 backdrop-blur-[2px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
            <div>
            <h1 className="text-2xl font-bold text-slate-800">Suggestion Box</h1>
            <p className="text-slate-500">Community improvement portal.</p>
            </div>
            {currentUser?.role === UserRole.VIEWER && (
                <button 
                    onClick={() => setShowForm(!showForm)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors shadow-lg shadow-blue-500/30"
                >
                    {showForm ? 'Cancel' : <><Plus size={18} /> New Suggestion</>}
                </button>
            )}
        </div>

        {showForm && (
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-lg border border-blue-100 animate-in slide-in-from-top-4">
                <h3 className="font-semibold text-slate-800 mb-4">Submit a Suggestion</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                        <input 
                            type="text" 
                            value={newTitle}
                            onChange={e => setNewTitle(e.target.value)}
                            className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            placeholder="e.g., Gym Lighting"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                        <textarea 
                            value={newDesc}
                            onChange={e => setNewDesc(e.target.value)}
                            className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none h-24"
                            placeholder="Describe your suggestion..."
                            required
                        />
                    </div>
                    <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-medium flex justify-center items-center gap-2">
                        <Send size={18} /> Submit
                    </button>
                </div>
            </form>
        )}

        <div className="space-y-4">
            {suggestions.length === 0 && (
                <div className="text-center py-12 bg-white rounded-xl border-2 border-dashed border-slate-200">
                    <MessageSquare size={48} className="mx-auto text-slate-300 mb-2"/>
                    <p className="text-slate-500">No suggestions yet. Be the first!</p>
                </div>
            )}
            {suggestions.map((s) => (
                <div key={s.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 relative group transition-all hover:shadow-md">
                    
                    {isAdmin && (
                        <button 
                            onClick={() => handleDelete(s.id)} 
                            className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors p-2"
                            title="Delete Suggestion"
                        >
                            <Trash2 size={16} />
                        </button>
                    )}

                    <div className="flex flex-col md:flex-row gap-6">
                        {/* Voting Column */}
                        <div className="flex flex-col items-center justify-start pt-1 gap-1">
                            <button 
                                onClick={() => handleVote(s.id)}
                                className="p-2 rounded-lg bg-slate-50 hover:bg-blue-50 text-slate-500 hover:text-blue-600 transition-colors group/vote"
                            >
                                <ThumbsUp size={20} className="group-hover/vote:scale-110 transition-transform"/>
                            </button>
                            <span className="font-bold text-slate-700 text-sm">{s.upvotes}</span>
                        </div>

                        <div className="flex-1">
                            <div className="flex justify-between items-start mb-2 pr-8">
                                <div className="flex items-center gap-2">
                                    <h4 className="font-bold text-lg text-slate-800">{s.title}</h4>
                                </div>
                                
                                {isAdmin ? (
                                    <select 
                                        value={s.status}
                                        onChange={(e) => handleStatusChange(s.id, e.target.value as any)}
                                        className={`text-xs font-bold px-3 py-1.5 rounded border outline-none cursor-pointer ${getStatusColor(s.status)}`}
                                    >
                                        <option value="OPEN">OPEN</option>
                                        <option value="IN_PROGRESS">IN PROGRESS</option>
                                        <option value="RESOLVED">RESOLVED</option>
                                    </select>
                                ) : (
                                    <span className={`text-xs font-bold px-2 py-1 rounded border ${getStatusColor(s.status)}`}>
                                        {s.status.replace('_', ' ')}
                                    </span>
                                )}
                            </div>
                            
                            <p className="text-slate-600 mb-3 leading-relaxed">{s.description}</p>
                            
                            <div className="flex items-center gap-4 text-xs text-slate-400">
                                <span className="flex items-center gap-1 font-medium text-slate-500">
                                    <div className="w-5 h-5 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-[10px] text-white font-bold">
                                        {s.userName.charAt(0)}
                                    </div>
                                    {s.userName}
                                </span>
                                <span>•</span>
                                <span>{s.date}</span>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Suggestions;
