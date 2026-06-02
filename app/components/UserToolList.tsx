'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { Tool } from '@/types';
import tools from '@/data/tools.json';

interface RecommendationList {
  id: string;
  name: string;
  toolIds: number[];
  createdAt: Date;
}

interface UserToolListProps {
  savedTools: Tool[];
}

export default function UserToolList({ savedTools }: UserToolListProps) {
  const [lists, setLists] = useState<RecommendationList[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [selectedTools, setSelectedTools] = useState<number[]>([]);
  const [sharingListId, setSharingListId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const savedLists = localStorage.getItem('user_recommendation_lists');
    if (savedLists) {
      try {
        const parsed = JSON.parse(savedLists);
        setLists(parsed.map((list: any) => ({
          ...list,
          createdAt: new Date(list.createdAt)
        })));
      } catch (e) {
        console.error('Failed to parse saved lists:', e);
      }
    }
  }, []);

  const saveLists = (newLists: RecommendationList[]) => {
    setLists(newLists);
    localStorage.setItem('user_recommendation_lists', JSON.stringify(newLists));
  };

  const handleCreateList = () => {
    if (!newListName.trim() || selectedTools.length === 0) return;

    const newList: RecommendationList = {
      id: Date.now().toString(),
      name: newListName.trim(),
      toolIds: [...selectedTools],
      createdAt: new Date()
    };

    saveLists([...lists, newList]);
    setShowCreateModal(false);
    setNewListName('');
    setSelectedTools([]);
  };

  const handleDeleteList = (listId: string) => {
    saveLists(lists.filter(l => l.id !== listId));
  };

  const handleShareList = (list: RecommendationList) => {
    setSharingListId(list.id);
    const url = `${window.location.origin}?list=${list.id}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        setSharingListId(null);
      }, 2000);
    });
  };

  const toggleToolSelection = (toolId: number) => {
    setSelectedTools(prev => 
      prev.includes(toolId) 
        ? prev.filter(id => id !== toolId) 
        : [...prev, toolId]
    );
  };

  return (
    <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-3xl p-8 mb-10">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
          📋 My Recommendation Lists
        </h3>
        {savedTools.length > 0 && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
          >
            + Create List
          </button>
        )}
      </div>

      {lists.length === 0 ? (
        <div className="text-center py-8 text-slate-500 dark:text-slate-400">
          <p className="text-lg mb-4">No recommendation lists yet!</p>
          {savedTools.length > 0 ? (
            <p className="text-sm">Create your first list from your saved tools above.</p>
          ) : (
            <p className="text-sm">Save some tools first, then create a recommendation list!</p>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {lists.map(list => {
            const listTools = list.toolIds.map(id => 
              (tools as Tool[]).find(t => t.id === id)
            ).filter(Boolean) as Tool[];
            
            return (
              <div 
                key={list.id}
                className="border border-slate-200 dark:border-slate-700 rounded-2xl p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white">
                      {list.name}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Created {list.createdAt.toLocaleDateString()} • {listTools.length} tools
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleShareList(list)}
                      className="text-sm px-3 py-1 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      {sharingListId === list.id && copied ? '✓ Copied!' : 'Share'}
                    </button>
                    <button
                      onClick={() => handleDeleteList(list.id)}
                      className="text-sm px-3 py-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {listTools.map(tool => (
                    <Link 
                      key={tool.id}
                      href={`/tools/${tool.id}`}
                      className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    >
                      {tool.name}
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create List Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 max-w-lg w-full mx-4 max-h-[80vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
              Create New Recommendation List
            </h3>
            
            <div className="mb-4">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                List Name
              </label>
              <input
                type="text"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-gray-800 text-slate-900 dark:text-white"
                placeholder="e.g. My Top 5 Writing Tools"
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Select Tools ({selectedTools.length} selected)
              </label>
              <div className="space-y-2">
                {savedTools.map(tool => (
                  <label 
                    key={tool.id} 
                    className="flex items-center gap-3 p-3 border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedTools.includes(tool.id)}
                      onChange={() => toggleToolSelection(tool.id)}
                      className="w-4 h-4 text-emerald-500"
                    />
                    <span className="text-slate-700 dark:text-slate-300">{tool.name}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateList}
                disabled={!newListName.trim() || selectedTools.length === 0}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl hover:shadow-lg disabled:opacity-50"
              >
                Create List
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
