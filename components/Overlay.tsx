import React from 'react';
import { TreeState } from '../types';
import { Sparkles, Box, Maximize2 } from 'lucide-react';

interface OverlayProps {
  currentState: TreeState;
  onToggleState: () => void;
}

export const Overlay: React.FC<OverlayProps> = ({ currentState, onToggleState }) => {
  const isTree = currentState === TreeState.TREE_SHAPE;

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6 md:p-12 z-10 text-white">
      {/* Header */}
      <header className="flex justify-between items-start animate-fade-in-down">
        <div>
          <h1 className="text-3xl md:text-5xl font-bold text-[#d4af37] tracking-wider drop-shadow-lg">
            ARIX
          </h1>
          <p className="text-xs md:text-sm text-emerald-100 tracking-[0.3em] uppercase mt-1 opacity-80">
            Signature Interactive
          </p>
        </div>
      </header>

      {/* Center Message (optional context) */}
      <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center transition-opacity duration-1000 ${isTree ? 'opacity-0' : 'opacity-100'}`}>
        <h2 className="text-4xl md:text-6xl font-serif italic text-transparent bg-clip-text bg-gradient-to-b from-[#f9e5bc] to-[#d4af37] opacity-40 select-none">
          Chaos
        </h2>
      </div>
      <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center transition-opacity duration-1000 ${isTree ? 'opacity-100' : 'opacity-0'}`}>
        <h2 className="text-4xl md:text-6xl font-serif italic text-transparent bg-clip-text bg-gradient-to-b from-[#f9e5bc] to-[#d4af37] opacity-40 select-none">
          Harmony
        </h2>
      </div>

      {/* Footer Controls */}
      <footer className="flex flex-col md:flex-row justify-between items-end gap-6 pointer-events-auto">
        
        <div className="max-w-md">
           <p className="text-emerald-200/60 text-xs md:text-sm font-light leading-relaxed">
             Experience the duality of the season. 
             <br/>From the raw nebula of possibility to the structured elegance of tradition.
           </p>
        </div>

        <button
          onClick={onToggleState}
          className="group relative px-8 py-4 bg-[#042e1f]/80 backdrop-blur-md border border-[#d4af37]/30 rounded-full transition-all duration-500 hover:bg-[#d4af37] hover:border-transparent hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(4,46,31,0.5)]"
        >
          <div className="flex items-center gap-3">
             {isTree ? (
                <Maximize2 className="w-5 h-5 text-[#d4af37] group-hover:text-[#042e1f] transition-colors" />
             ) : (
                <Box className="w-5 h-5 text-[#d4af37] group-hover:text-[#042e1f] transition-colors" />
             )}
             <span className="font-serif tracking-widest text-sm text-[#d4af37] group-hover:text-[#042e1f] font-semibold transition-colors">
               {isTree ? 'DISPERSE' : 'ASSEMBLE'}
             </span>
          </div>
          
          {/* Button Glow Effect */}
          <div className="absolute inset-0 rounded-full ring-2 ring-[#d4af37] opacity-0 group-hover:opacity-50 blur-md transition-opacity duration-500" />
        </button>
      </footer>
    </div>
  );
};