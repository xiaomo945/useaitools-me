'use client';

import React from 'react';
import { Tool } from '../utils/toolHelpers';

interface LongPressMenuProps {
  show: boolean;
  selectedTool: Tool | null;
  onClose: () => void;
  onSave: (toolId: number) => void;
  onCompare: (toolId: number) => void;
  onCopyLink: (tool: Tool) => void;
  onViewDetails: (toolId: number) => void;
}

const LongPressMenu: React.FC<LongPressMenuProps> = ({
  show,
  selectedTool,
  onClose,
  onSave,
  onCompare,
  onCopyLink,
  onViewDetails,
}) => {
  if (!show || !selectedTool) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50" 
        onClick={onClose}
      />
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <div className="bg-white dark:bg-gray-900 rounded-t-3xl shadow-2xl p-6 drawer-enter">
          <div className="w-12 h-1 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto mb-6" />
          <div className="text-center mb-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{selectedTool.name}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">{selectedTool.category} • {selectedTool.pricing}</p>
          </div>
          <div className="space-y-3">
            <button 
              onClick={() => onSave(selectedTool.id)}
              className="w-full flex items-center gap-4 px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <span className="text-xl">❤️</span>
              </div>
              <div className="text-left">
                <div className="font-semibold text-slate-900 dark:text-white">Save to Favorites</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Keep this tool handy for later</div>
              </div>
            </button>
            
            <button 
              onClick={() => onCompare(selectedTool.id)}
              className="w-full flex items-center gap-4 px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <span className="text-xl">📊</span>
              </div>
              <div className="text-left">
                <div className="font-semibold text-slate-900 dark:text-white">Add to Compare</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Compare with other tools</div>
              </div>
            </button>
            
            <button 
              onClick={() => onCopyLink(selectedTool)}
              className="w-full flex items-center gap-4 px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <span className="text-xl">🔗</span>
              </div>
              <div className="text-left">
                <div className="font-semibold text-slate-900 dark:text-white">Copy Tool Link</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Share this tool with others</div>
              </div>
            </button>
            
            <button 
              onClick={() => onViewDetails(selectedTool.id)}
              className="w-full flex items-center gap-4 px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <span className="text-xl">📋</span>
              </div>
              <div className="text-left">
                <div className="font-semibold text-slate-900 dark:text-white">View Details</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">See full tool information</div>
              </div>
            </button>
          </div>
          <button 
            onClick={onClose}
            className="w-full mt-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </>
  );
};

export default LongPressMenu;
