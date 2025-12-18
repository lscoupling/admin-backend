
import React, { useState, useEffect } from 'react';
import { getDesignGuidance } from '../geminiService';
import { Icons } from '../constants';

interface Props {
  onStart: () => void;
}

const SpecDiscussion: React.FC<Props> = ({ onStart }) => {
  const [loading, setLoading] = useState(true);
  const [guidance, setGuidance] = useState<string>('');

  useEffect(() => {
    const fetchSpecs = async () => {
      try {
        const result = await getDesignGuidance('Login Page and Admin Dashboard');
        setGuidance(result || 'AI 暫時無法提供完整建議，但系統已準備就緒。');
      } catch (e) {
        setGuidance('正在載入本地緩存的設計規範...');
      } finally {
        setLoading(false);
      }
    };
    fetchSpecs();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 md:py-20 relative z-10">
      <div className="flex flex-col items-center mb-10">
        <div className="w-16 h-16 bg-gradient-to-tr from-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-xl ring-1 ring-white/20">
          <Icons.Brain className="text-white w-8 h-8" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-center text-white mb-4 tracking-tight font-display">
          Nexus <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">系統設計規範</span>
        </h1>
        <p className="text-slate-400 text-center text-base max-w-xl font-medium">
          基於「便當盒佈局」與「極光視覺」的現代化管理介面方案。
        </p>
      </div>

      <div className="glass p-8 md:p-10 mb-10 relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-purple-500 to-indigo-500"></div>
        
        {loading ? (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-4 h-4 rounded-full bg-purple-500 animate-ping"></div>
              <span className="text-purple-400 font-bold tracking-widest text-sm uppercase">AI 架構師正在生成建議...</span>
            </div>
            <div className="h-4 bg-white/5 rounded-full w-3/4 animate-pulse"></div>
            <div className="h-4 bg-white/5 rounded-full w-5/6 animate-pulse"></div>
            <div className="h-32 bg-white/5 rounded-2xl w-full animate-pulse"></div>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
              <Icons.Info className="text-purple-400" size={20} />
              <span className="font-display">架構核心方案</span>
            </h2>
            <div className="prose prose-invert max-w-none text-slate-300 leading-relaxed text-base font-light mb-8">
              {guidance}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                <h4 className="text-purple-400 font-bold text-sm mb-2 uppercase tracking-tighter">視覺風格</h4>
                <p className="text-slate-400 text-sm">Aurora Mesh Gradients + Glassmorphism</p>
              </div>
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                <h4 className="text-indigo-400 font-bold text-sm mb-2 uppercase tracking-tighter">佈局邏輯</h4>
                <p className="text-slate-400 text-sm">Bento-Grid Responsive Design System</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pb-20">
        <button
          onClick={onStart}
          className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full font-bold text-lg hover:scale-105 transition-all active:scale-95 shadow-lg shadow-purple-500/20 flex items-center justify-center gap-3"
        >
          {loading ? '直接跳過並實作' : '確認規範並實作'}
          <Icons.ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default SpecDiscussion;
