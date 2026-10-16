import React, { useState } from 'react';
import {
  History,
  Trash2,
  RotateCcw,
  Search,
  Download,
  Calendar,
  CheckCircle2,
  XCircle,
  FileDown,
  ExternalLink,
} from 'lucide-react';
import { HistoryItem } from '../types/index.js';

interface DownloadHistoryProps {
  history: HistoryItem[];
  onRemoveItem: (id: string) => void;
  onClearAll: () => void;
  onRedownload: (item: HistoryItem) => void;
}

export const DownloadHistory: React.FC<DownloadHistoryProps> = ({
  history,
  onRemoveItem,
  onClearAll,
  onRedownload,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'failed'>('all');

  const filteredHistory = history.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.platform.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const exportHistoryJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(history, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `ultravid_history_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const formatDate = (timestamp: number) => {
    const d = new Date(timestamp);
    return d.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (history.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto p-12 text-center rounded-2xl bg-[#0f1523]/80 border border-white/5 backdrop-blur-xl">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-800/80 flex items-center justify-center text-slate-500 mb-4 border border-white/5">
          <History className="w-7 h-7" />
        </div>
        <h3 className="text-base font-semibold text-white">No Download History</h3>
        <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
          Your downloaded media items are safely logged locally in your browser storage. Zero personal data is stored on our servers.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      {/* Header with Search and Clear controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-2xl bg-[#0f1523]/90 border border-white/5">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search downloads by title or platform..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-900 text-white rounded-lg border border-white/10 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Filter buttons & Export / Clear actions */}
        <div className="flex items-center gap-2">
          {/* Segmented status filter */}
          <div className="flex items-center gap-1 p-0.5 bg-slate-900 rounded-lg border border-white/5 text-xs">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                statusFilter === 'all' ? 'bg-blue-600 text-white font-medium' : 'text-slate-400 hover:text-white'
              }`}
            >
              All ({history.length})
            </button>
            <button
              onClick={() => setStatusFilter('completed')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                statusFilter === 'completed' ? 'bg-blue-600 text-white font-medium' : 'text-slate-400 hover:text-white'
              }`}
            >
              Done
            </button>
          </div>

          <button
            onClick={exportHistoryJson}
            title="Export history JSON"
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-white/5 transition-colors"
          >
            <FileDown className="w-4 h-4" />
          </button>

          <button
            onClick={onClearAll}
            title="Clear all history"
            className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* History items */}
      <div className="space-y-2">
        {filteredHistory.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500 rounded-xl border border-white/5 bg-[#0f1523]/50">
            No downloads match your search criteria.
          </div>
        ) : (
          filteredHistory.map((item) => (
            <div
              key={item.id}
              className="p-3.5 sm:p-4 rounded-xl bg-[#0f1523]/90 border border-white/5 hover:border-white/10 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative w-14 h-10 rounded-lg overflow-hidden bg-slate-900 border border-white/5 shrink-0">
                  <img
                    src={item.thumbnailUrl}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80';
                    }}
                  />
                </div>

                <div className="min-w-0">
                  <h4 className="text-xs sm:text-sm font-semibold text-white truncate max-w-md group-hover:text-blue-300 transition-colors">
                    {item.title}
                  </h4>
                  <div className="flex flex-wrap items-center gap-2 mt-0.5 text-[11px] text-slate-400">
                    <span className="font-semibold text-blue-400">{item.qualityLabel}</span>
                    <span>·</span>
                    <span className="font-mono text-slate-300 uppercase">{item.extension}</span>
                    <span>·</span>
                    <span className="font-mono">{item.fileSizeFormatted}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1 text-slate-500">
                      <Calendar className="w-3 h-3" />
                      {formatDate(item.downloadedAt)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status and Action Buttons */}
              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                {item.status === 'completed' ? (
                  <span className="text-[11px] font-medium text-emerald-400 flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    <CheckCircle2 className="w-3 h-3" />
                    Completed
                  </span>
                ) : (
                  <span className="text-[11px] font-medium text-rose-400 flex items-center gap-1 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
                    <XCircle className="w-3 h-3" />
                    Failed
                  </span>
                )}

                <button
                  type="button"
                  onClick={() => onRedownload(item)}
                  title="Re-download video"
                  className="p-1.5 rounded-lg text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/5 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => onRemoveItem(item.id)}
                  title="Remove from history"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 bg-white/5 hover:bg-rose-500/10 border border-white/5 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
