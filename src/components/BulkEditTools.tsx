import React from 'react';
import { Edit3, Layers, Zap } from 'lucide-react';

export default function BulkEditTools() {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="bg-white/5 border border-white/10 p-8 rounded-3xl space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <Edit3 className="w-6 h-6 text-red-500" />
          <h3 className="text-xl font-bold">Bulk Edit Tools</h3>
        </div>
        <p className="text-gray-400">
          Save time by editing your channel and individual videos all at once.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-white/5 rounded-xl border border-white/5 flex items-center gap-3">
            <Layers className="w-5 h-5 text-red-500" />
            <span>Bulk Tag Update</span>
          </div>
          <div className="p-4 bg-white/5 rounded-xl border border-white/5 flex items-center gap-3">
            <Zap className="w-5 h-5 text-red-500" />
            <span>Bulk Description Edit</span>
          </div>
        </div>
      </div>
    </div>
  );
}
