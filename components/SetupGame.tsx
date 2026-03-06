import React, { useState } from 'react';
import { Industry, LLMProvider } from '../types';
import Button from './Button';
import { Rocket, Briefcase, Cpu, Heart, ShoppingBag, GraduationCap, Lightbulb, Key, Globe, AlertTriangle, Settings, ChevronDown, User, Box } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { getLLMConfig } from '../services/gemini';
import { useEffect } from 'react';

interface SetupGameProps {
  onStart: (name: string, industry: Industry, productName: string, productDesc: string, ceo: { name: string, gender: string, interests: string[] }, apiKey?: string, provider?: LLMProvider) => void;
  isLoading: boolean;
  error?: string | null;
}

const SetupGame: React.FC<SetupGameProps> = ({ onStart, isLoading, error }) => {
  const { language, setLanguage, t } = useLanguage();
  const [activeSetupTab, setActiveSetupTab] = useState<'company' | 'ceo'>('company');
  
  // Company Info
  const [name, setName] = useState('');
  const [productName, setProductName] = useState('');
  const [productDesc, setProductDesc] = useState('');
  
  // CEO Info
  const [ceoName, setCeoName] = useState('');
  const [ceoGender, setCeoGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [ceoInterests, setCeoInterests] = useState('');

  const [userApiKey, setUserApiKey] = useState('');
  const [industry, setIndustry] = useState<Industry>(Industry.TECH);
  const [provider, setProvider] = useState<LLMProvider>('gemini');

  // Load saved API key on mount
  useEffect(() => {
    const config = getLLMConfig();
    if (config.apiKey) {
      setUserApiKey(config.apiKey);
    }
  }, []);

  const industries = [
    { value: Industry.TECH, label: t('setup.industries.tech.label'), icon: <Cpu size={18} />, desc: t('setup.industries.tech.desc') },
    { value: Industry.HEALTH, label: t('setup.industries.health.label'), icon: <Heart size={18} />, desc: t('setup.industries.health.desc') },
    { value: Industry.AI, label: t('setup.industries.ai.label'), icon: <Rocket size={18} />, desc: t('setup.industries.ai.desc') },
    { value: Industry.EDTECH, label: t('setup.industries.edtech.label'), icon: <GraduationCap size={18} />, desc: t('setup.industries.edtech.desc') },
    { value: Industry.FMCG, label: t('setup.industries.fmcg.label'), icon: <ShoppingBag size={18} />, desc: t('setup.industries.fmcg.desc') },
  ];

  const providers: {id: LLMProvider, name: string}[] = [
      { id: 'gemini', name: 'Google Gemini' },
      { id: 'openai', name: 'OpenAI (GPT)' },
      { id: 'deepseek', name: 'DeepSeek' }
  ];

  return (
    <div className="w-full h-full md:h-auto md:max-h-[90vh] max-w-5xl mx-auto bg-white md:rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row relative">
      
      {/* Mobile Language Toggle (Absolute) */}
      <div className="absolute top-4 right-4 z-30 md:hidden">
        <button 
          onClick={() => setLanguage(language === 'vi' ? 'en' : 'vi')}
          className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200"
        >
          <Globe size={12} /> {language === 'vi' ? 'VN' : 'EN'}
        </button>
      </div>

      {/* LEFT COLUMN: Identity & Story */}
      <div className="w-full md:w-5/12 bg-slate-50 p-6 md:p-8 flex flex-col border-b md:border-b-0 md:border-r border-slate-200 overflow-y-auto custom-scrollbar">
          {/* Header */}
          <div className="mb-8">
              <h2 className="text-2xl font-extrabold text-slate-900 mb-1 font-heading tracking-tight flex items-center gap-4">
                  <img src="/assets/logo.jpg" alt="ST Logo" className="w-20 h-20 rounded-xl shadow-sm border border-slate-100 p-1" />
                  <div>
                    {t('setup.title')}
                  <p className="text-slate-500 text-xs leading-relaxed font-medium">{t('setup.subtitle')}</p>
                  </div>
           
              </h2>
          </div>

          {/* TABS SELECTOR */}
          <div className="flex bg-slate-200/50 p-1 rounded-2xl mb-8 gap-1">
              <button 
                onClick={() => setActiveSetupTab('company')}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${activeSetupTab === 'company' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                  <Briefcase size={14}/> {t('setup.tabs.company')}
              </button>
              <button 
                onClick={() => setActiveSetupTab('ceo')}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${activeSetupTab === 'ceo' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                  <User size={14}/> {t('setup.tabs.ceo')}
              </button>
          </div>

          <div className="space-y-5 flex-1 transition-all duration-300">
              {activeSetupTab === 'company' ? (
                  <div className="space-y-5 animate-fadeIn">
                      <div>
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                              <Box size={14}/> {t('setup.companyName')}
                          </label>
                          <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder={t('setup.companyPlaceholder')}
                            className="w-full bg-white border border-slate-200 text-slate-900 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none font-medium shadow-sm"
                          />
                      </div>

                      <div>
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                              <Lightbulb size={14}/> {t('setup.productName')}
                          </label>
                          <input
                            type="text"
                            value={productName}
                            onChange={(e) => setProductName(e.target.value)}
                            placeholder={t('setup.productNamePlaceholder')}
                            className="w-full bg-white border border-slate-200 text-slate-900 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none font-medium shadow-sm"
                          />
                      </div>

                      <div>
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                              <Rocket size={14}/> {t('setup.productDesc')}
                          </label>
                          <textarea
                              value={productDesc}
                              onChange={(e) => setProductDesc(e.target.value)}
                              placeholder={t('setup.productDescPlaceholder')}
                              className="w-full bg-white border border-slate-200 text-slate-900 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none h-24 resize-none shadow-sm text-sm"
                          />
                      </div>
                  </div>
              ) : (
                  <div className="space-y-5 animate-fadeIn">
                       <div>
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                              <User size={14}/> {t('setup.ceo.name')}
                          </label>
                          <input
                            type="text"
                            value={ceoName}
                            onChange={(e) => setCeoName(e.target.value)}
                            placeholder={t('setup.ceo.namePlaceholder')}
                            className="w-full bg-white border border-slate-200 text-slate-900 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none font-medium shadow-sm"
                          />
                      </div>

                      <div>
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                              <Globe size={14}/> {t('setup.ceo.gender')}
                          </label>
                          <div className="flex gap-2">
                              {(['Male', 'Female', 'Other'] as const).map(g => (
                                  <button
                                    key={g}
                                    type="button"
                                    onClick={() => setCeoGender(g)}
                                    className={`flex-1 py-2 rounded-xl text-xs font-bold border-2 transition-all ${ceoGender === g ? 'bg-blue-50 border-blue-600 text-blue-600' : 'bg-white border-slate-100 text-slate-500 hover:border-slate-200'}`}
                                  >
                                      {t(`setup.ceo.genders.${g.toLowerCase() as 'male' | 'female' | 'other'}`)}
                                  </button>
                              ))}
                          </div>
                      </div>

                      <div>
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                              <Heart size={14}/> {t('setup.ceo.interests')}
                          </label>
                          <textarea
                              value={ceoInterests}
                              onChange={(e) => setCeoInterests(e.target.value)}
                              placeholder={t('setup.ceo.interestsPlaceholder')}
                              className="w-full bg-white border border-slate-200 text-slate-900 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none h-24 resize-none shadow-sm text-sm"
                          />
                      </div>
                  </div>
              )}
          </div>
          
          <div className="hidden md:flex mt-6 items-center gap-2 text-xs text-slate-400 font-medium">
              <Globe size={14} />
              <button onClick={() => setLanguage('vi')} className={`hover:text-blue-600 ${language==='vi'?'text-blue-600 font-bold':''}`}>Tiếng Việt</button>
              <span>/</span>
              <button onClick={() => setLanguage('en')} className={`hover:text-blue-600 ${language==='en'?'text-blue-600 font-bold':''}`}>English</button>
          </div>
      </div>

      {/* RIGHT COLUMN: Strategy & Config */}
      <div className="w-full md:w-7/12 p-6 md:p-8 flex flex-col bg-white overflow-y-auto custom-scrollbar">
          
          {/* Industry Grid */}
          <div className="mb-6 md:mb-8">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">{t('setup.industry')}</label>
              <div className="grid grid-cols-2 gap-3">
                {industries.map((ind) => (
                  <button
                    key={ind.value}
                    onClick={() => setIndustry(ind.value)}
                    className={`flex flex-col p-3 rounded-xl border-2 transition-all text-left relative overflow-hidden ${
                      industry === ind.value
                        ? 'bg-blue-50 border-blue-600 shadow-md'
                        : 'bg-white border-slate-100 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                        <div className={`p-1.5 rounded-lg ${industry === ind.value ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                          {ind.icon}
                        </div>
                        {industry === ind.value && <div className="w-2 h-2 rounded-full bg-blue-600"></div>}
                    </div>
                    <div className={`font-bold text-sm ${industry === ind.value ? 'text-blue-900' : 'text-slate-700'}`}>
                      {ind.label}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate">{ind.desc}</div>
                  </button>
                ))}
              </div>
          </div>

          {/* AI Settings */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 mb-6">
              <div className="flex items-center gap-2 mb-3">
                  <Settings size={14} className="text-slate-400"/>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t('setup.aiConfig')}</span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                  <div className="relative">
                      <select 
                          value={provider} 
                          onChange={(e) => setProvider(e.target.value as LLMProvider)}
                          className="w-full bg-white border border-slate-200 text-slate-900 rounded-lg px-3 py-2 text-sm font-medium appearance-none outline-none focus:border-blue-500"
                      >
                          {providers.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                      </select>
                      <ChevronDown size={14} className="absolute right-3 top-3 text-slate-400 pointer-events-none"/>
                  </div>
                  <input 
                      type="password"
                      value={userApiKey}
                      onChange={(e) => setUserApiKey(e.target.value)}
                      placeholder={t('setup.apiKeyPlaceholder')}
                      className="w-full bg-white border border-slate-200 text-slate-900 rounded-lg px-3 py-2 text-sm font-mono outline-none focus:border-blue-500 placeholder:text-slate-400"
                  />
              </div>
              <p className="text-[10px] text-slate-400 leading-tight">
                  {provider === 'gemini' ? t('setup.apiKeyNote') : t('setup.apiKeyRequired')}
              </p>
          </div>

          {/* Error Message */}
          {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-bold flex items-center gap-2 animate-slideUp">
                  <AlertTriangle size={16} />
                  <span>{error}</span>
              </div>
          )}

          {/* Action Footer */}
          <div className="mt-auto pt-2">
              <Button 
                onClick={() => onStart(
                    name, 
                    industry, 
                    productName, 
                    productDesc, 
                    { 
                        name: ceoName || 'CEO', 
                        gender: ceoGender, 
                        interests: ceoInterests.split(',').map(i => i.trim()).filter(i => i !== '') 
                    },
                    userApiKey, 
                    provider
                )} 
                disabled={!name.trim() || !productName.trim() || !productDesc.trim() || !ceoName.trim()} 
                isLoading={isLoading}
                className="w-full py-4 text-lg shadow-blue-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                <Rocket size={20} /> {t('setup.startBtn')}
              </Button>
          </div>
      </div>
    </div>
  );
};

export default SetupGame;