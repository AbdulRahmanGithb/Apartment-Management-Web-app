
import React, { useState, useRef, useEffect } from 'react';
import { useAppContext } from '../App';
import { Lock, Eye, Shield, AlertTriangle, FileText, ChevronLeft, ChevronRight, Clock, Trash2 } from 'lucide-react';
import { DocumentItem, UserRole } from '../types';

const DocumentVault: React.FC = () => {
  const { documents, currentUser, deleteDocument } = useAppContext();
  const [selectedDoc, setSelectedDoc] = useState<DocumentItem | null>(null);

  const handleDelete = (e: React.MouseEvent, id: string) => {
      e.stopPropagation();
      if(window.confirm('Are you sure you want to permanently delete this document? This action cannot be undone.')) {
          deleteDocument(id);
      }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Shield className="text-blue-600" />
          Secure Document Vault
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Documents are watermarked and protected. Downloading and printing are disabled.
        </p>
      </div>

      {!selectedDoc ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.length === 0 ? (
             <div className="col-span-full text-center py-20 text-slate-400 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
                 <FileText size={48} className="mx-auto mb-2 opacity-50"/>
                 <p>No documents found in the vault.</p>
             </div>
          ) : (
             documents.map((doc) => (
            <div 
              key={doc.id}
              onClick={() => setSelectedDoc(doc)}
              className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all cursor-pointer overflow-hidden group flex flex-col h-full relative"
            >
              {/* Image Preview */}
              <div className="h-48 bg-slate-100 relative overflow-hidden border-b border-slate-100">
                 <img 
                    src={doc.pages[0]} 
                    alt={doc.title}
                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500 filter grayscale-[20%] group-hover:grayscale-0"
                 />
                 <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                 
                 {/* Badge */}
                 <div className="absolute top-3 left-3">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-md shadow-sm border ${
                        doc.category === 'LEGAL' ? 'bg-purple-100 text-purple-700 border-purple-200' : 
                        doc.category === 'FINANCIAL' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-orange-100 text-orange-700 border-orange-200'
                    }`}>
                        {doc.category}
                    </span>
                 </div>
                 
                 {/* Admin Delete Action */}
                 {currentUser?.role === UserRole.ADMIN && (
                    <button 
                        onClick={(e) => handleDelete(e, doc.id)}
                        className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm text-slate-400 hover:text-red-600 rounded-full shadow-sm hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100 z-10"
                        title="Delete Document"
                    >
                        <Trash2 size={16} />
                    </button>
                 )}
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-slate-800 line-clamp-2 leading-tight mb-2 group-hover:text-blue-600 transition-colors">{doc.title}</h3>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-4">
                      <Clock size={12} /> Uploaded: {doc.uploadDate}
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                   <span className="text-xs font-semibold text-slate-500">{doc.pages.length} Page{doc.pages.length > 1 ? 's' : ''}</span>
                   <div className="flex items-center gap-1 text-xs text-blue-600 font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                      <Eye size={12} /> View
                   </div>
                </div>
              </div>
            </div>
          )))}
        </div>
      ) : (
        <SecureViewer doc={selectedDoc} onClose={() => setSelectedDoc(null)} userIp="192.168.1.XX" userId={currentUser?.id || 'Unknown'} />
      )}
    </div>
  );
};

// --- Secure Canvas Viewer ---

interface SecureViewerProps {
  doc: DocumentItem;
  onClose: () => void;
  userIp: string;
  userId: string;
}

const SecureViewer: React.FC<SecureViewerProps> = ({ doc, onClose, userIp, userId }) => {
  const [pageIndex, setPageIndex] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const drawSecureImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = doc.pages[pageIndex];

    img.onload = () => {
      // Set canvas dimensions
      canvas.width = img.width;
      canvas.height = img.height;

      // Draw Image
      ctx.drawImage(img, 0, 0);

      // --- Security Layer: Watermarking ---
      ctx.globalAlpha = 0.15; // Semi-transparent
      ctx.font = 'bold 48px Arial';
      ctx.fillStyle = 'red';
      ctx.textAlign = 'center';
      
      const text = `VIEWER: ${userId} | IP: ${userIp} | ${new Date().toLocaleDateString()}`;
      
      // Diagonal Pattern
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(-Math.PI / 4);
      
      // Draw multiple lines
      for (let i = -1000; i < 1000; i += 150) {
        ctx.fillText(text, 0, i);
      }
      
      // Reset transform
      ctx.rotate(Math.PI / 4);
      ctx.translate(-canvas.width / 2, -canvas.height / 2);
    };
  };

  useEffect(() => {
    drawSecureImage();
    
    // Disable right click context menu on the container
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    const container = containerRef.current;
    if (container) {
      container.addEventListener('contextmenu', handleContextMenu);
    }
    return () => {
        if(container) container.removeEventListener('contextmenu', handleContextMenu);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageIndex, doc]);

  return (
    <div className="flex-1 flex flex-col bg-slate-900 rounded-xl overflow-hidden relative" ref={containerRef}>
      {/* Viewer Header */}
      <div className="bg-slate-800 p-4 flex justify-between items-center text-white border-b border-slate-700">
        <div>
          <h2 className="font-semibold">{doc.title}</h2>
          <p className="text-xs text-slate-400">Page {pageIndex + 1} of {doc.pages.length}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-red-400 text-xs uppercase font-bold tracking-wider animate-pulse">
            <Lock size={12} /> Protected View
          </div>
          <button onClick={onClose} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded text-sm transition-colors">
            Close Viewer
          </button>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 overflow-auto flex justify-center p-8 bg-slate-900 relative">
        <canvas ref={canvasRef} className="shadow-2xl max-w-full h-auto" />
        
        {/* Transparent Overlay to block drag/save */}
        <div className="absolute inset-0 z-10" />
      </div>

      {/* Controls */}
      <div className="bg-slate-800 p-4 flex justify-center items-center gap-6 border-t border-slate-700">
        <button 
          onClick={() => setPageIndex(p => Math.max(0, p - 1))}
          disabled={pageIndex === 0}
          className="p-2 rounded-full bg-slate-700 text-white hover:bg-blue-600 disabled:opacity-30 disabled:hover:bg-slate-700 transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        <span className="text-white font-mono">
           {pageIndex + 1} / {doc.pages.length}
        </span>
        <button 
          onClick={() => setPageIndex(p => Math.min(doc.pages.length - 1, p + 1))}
          disabled={pageIndex === doc.pages.length - 1}
          className="p-2 rounded-full bg-slate-700 text-white hover:bg-blue-600 disabled:opacity-30 disabled:hover:bg-slate-700 transition-colors"
        >
          <ChevronRight size={24} />
        </button>
      </div>
      
      {/* Security Warning */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-black/70 text-white text-xs px-4 py-2 rounded-full pointer-events-none z-20">
        ID: {userId} • IP: {userIp} • Do Not Share
      </div>
    </div>
  );
};

export default DocumentVault;
