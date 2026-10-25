import React, { useState } from 'react';
import { X, Database, Copy, Check, Server, ShieldCheck, RefreshCw, Code } from 'lucide-react';
import { getStoredSupabaseConfig, saveSupabaseConfig, clearSupabaseConfig, getSupabaseClient } from '../lib/supabase';
import { SUPABASE_SQL_SCHEMA } from '../lib/sqlExport';

interface SupabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseModal: React.FC<SupabaseModalProps> = ({ isOpen, onClose }) => {
  const currentConfig = getStoredSupabaseConfig();
  
  const [url, setUrl] = useState(currentConfig.url);
  const [anonKey, setAnonKey] = useState(currentConfig.anonKey);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'config' | 'schema'>('config');
  const [testStatus, setTestStatus] = useState<string | null>(null);
  const [testing, setTesting] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (url && anonKey) {
      saveSupabaseConfig(url, anonKey);
      setTestStatus('Supabase configuration saved successfully! Reloading connection...');
      setTimeout(() => {
        window.location.reload();
      }, 800);
    }
  };

  const handleClear = () => {
    clearSupabaseConfig();
    setUrl('');
    setAnonKey('');
    setTestStatus('Cleared Supabase credentials. Application is operating in local mock store mode.');
  };

  const handleCopySchema = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTestConnection = async () => {
    setTesting(true);
    setTestStatus(null);
    try {
      const client = getSupabaseClient();
      if (!client) {
        setTestStatus('Error: Please enter a valid URL and Anon Key first.');
        setTesting(false);
        return;
      }
      const { data, error } = await client.from('doctors').select('id').limit(1);
      if (error) {
        setTestStatus(`Supabase Error: ${error.message} (Note: Make sure to execute the SQL DDL schema in Supabase Editor first).`);
      } else {
        setTestStatus('✅ Connection Successful! Connected to Supabase Database backend.');
      }
    } catch (err: any) {
      setTestStatus(`Failed to connect: ${err?.message || 'Network error'}`);
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-[#1E293B] text-[#F8FAFC] w-full max-w-2xl rounded-2xl shadow-2xl border border-[#334155] overflow-hidden my-8">
        
        {/* Modal Header */}
        <div className="bg-[#0F172A] p-6 text-white border-b border-[#334155] relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-[#334155] hover:bg-[#475569] text-[#F8FAFC] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 mb-1">
            <Database className="w-5 h-5 text-[#38BDF8]" />
            <span className="text-xs uppercase tracking-widest font-bold text-[#38BDF8]">Backend Infrastructure</span>
          </div>
          <h3 className="text-xl font-bold text-[#F8FAFC]">Supabase Database & Auth Integration</h3>
          <p className="text-xs text-[#94A3B8] mt-1">
            Connect your own Supabase project or view the full PostgreSQL DDL schema for hackathon evaluation.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-[#334155] bg-[#0F172A] px-6 pt-3 gap-2">
          <button
            onClick={() => setActiveTab('config')}
            className={`pb-3 text-xs font-bold border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'config' ? 'border-[#0EA5E9] text-[#38BDF8]' : 'border-transparent text-[#94A3B8] hover:text-[#F8FAFC]'
            }`}
          >
            <Server className="w-3.5 h-3.5" /> Connection Settings
          </button>
          <button
            onClick={() => setActiveTab('schema')}
            className={`pb-3 text-xs font-bold border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'schema' ? 'border-[#0EA5E9] text-[#38BDF8]' : 'border-transparent text-[#94A3B8] hover:text-[#F8FAFC]'
            }`}
          >
            <Code className="w-3.5 h-3.5" /> Supabase SQL DDL Schema (7 Tables)
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6">
          
          {activeTab === 'config' && (
            <form onSubmit={handleSave} className="space-y-4">
              
              <div className="p-3 bg-[#0EA5E9]/10 border border-[#0EA5E9]/30 rounded-xl text-xs text-[#38BDF8]">
                <p className="font-bold flex items-center gap-1.5 text-[#38BDF8]">
                  <ShieldCheck className="w-4 h-4 text-[#0EA5E9]" /> Pre-Configured Hybrid Architecture
                </p>
                <p className="text-[11px] text-[#94A3B8] mt-0.5">
                  The app is fully functional right now with built-in reactive state & persistent localStorage. Enter your Supabase credentials to sync live with external PostgreSQL!
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#94A3B8] uppercase mb-1">VITE_SUPABASE_URL</label>
                <input
                  type="url"
                  placeholder="https://xyzcompany.supabase.co"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-[#334155] bg-[#0F172A] text-[#F8FAFC] focus:ring-2 focus:ring-[#0EA5E9] font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#94A3B8] uppercase mb-1">VITE_SUPABASE_ANON_KEY</label>
                <input
                  type="password"
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  value={anonKey}
                  onChange={(e) => setAnonKey(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-[#334155] bg-[#0F172A] text-[#F8FAFC] focus:ring-2 focus:ring-[#0EA5E9] font-mono"
                />
              </div>

              {testStatus && (
                <div className={`p-3 rounded-xl text-xs font-medium ${
                  testStatus.includes('✅') 
                    ? 'bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/30' 
                    : 'bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/30'
                }`}>
                  {testStatus}
                </div>
              )}

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#0EA5E9] hover:bg-[#0284C7] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Save & Reload
                </button>
                <button
                  type="button"
                  onClick={handleTestConnection}
                  disabled={testing}
                  className="px-4 py-2.5 bg-[#334155] hover:bg-[#475569] text-[#F8FAFC] text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin' : ''}`} />
                  Test Connection
                </button>
                {currentConfig.isConfigured && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="ml-auto px-4 py-2.5 bg-[#EF4444]/10 hover:bg-[#EF4444]/20 text-[#F87171] border border-[#EF4444]/30 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                  >
                    Clear Credentials
                  </button>
                )}
              </div>
            </form>
          )}

          {activeTab === 'schema' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-[#F8FAFC] uppercase">Required Database Tables</h4>
                  <p className="text-[11px] text-[#94A3B8]">
                    Includes: patients, doctors, appointments, tokens, beds, lab_reports, and bills.
                  </p>
                </div>
                <button
                  onClick={handleCopySchema}
                  className="px-3.5 py-1.5 bg-[#10B981] hover:bg-[#059669] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied to Clipboard!' : 'Copy SQL Script'}
                </button>
              </div>

              <div className="bg-[#0F172A] rounded-xl p-4 font-mono text-[11px] text-[#10B981] max-h-72 overflow-y-auto border border-[#334155] whitespace-pre">
                {SUPABASE_SQL_SCHEMA}
              </div>

              <p className="text-[11px] text-[#94A3B8]">
                💡 Tip: Open your Supabase Dashboard -&gt; SQL Editor -&gt; Paste the above script -&gt; Click "Run".
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
