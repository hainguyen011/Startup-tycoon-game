import React, { useState } from 'react';
import { GameState } from '../../../types';
import Button from '../../Button';
import { Rocket, ShieldAlert, Package } from 'lucide-react';
import { useLanguage } from '../../../LanguageContext';

interface ProductsTabProps {
  state: GameState;
  onCreateProduct: (name: string, desc: string) => void;
  onAssignToModule: (empId: string, productId: string, moduleId: string | null) => void;
}

export const ProductsTab: React.FC<ProductsTabProps> = ({ state, onCreateProduct, onAssignToModule }) => {
  const { t } = useLanguage();
  const [isCreatingProduct, setIsCreatingProduct] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdDesc, setNewProdDesc] = useState('');

  const handleCreateProductSubmit = () => {
    if (newProdName && newProdDesc) {
      onCreateProduct(newProdName, newProdDesc);
      setIsCreatingProduct(false);
      setNewProdName('');
      setNewProdDesc('');
    }
  };

  return (
    <div className="animate-fadeIn space-y-6">
        <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold font-heading text-slate-800">{t('dashboard.products.title')}</h2>
            <Button onClick={() => setIsCreatingProduct(!isCreatingProduct)} variant="primary">
                {isCreatingProduct ? t('dashboard.actions.cancel') : t('dashboard.products.newProduct')}
            </Button>
        </div>

        {isCreatingProduct && (
            <div className="bg-white p-6 rounded-2xl border border-indigo-100 shadow-lg ring-4 ring-indigo-50 animate-slideUp">
                <h3 className="font-bold text-lg mb-4 text-indigo-700 flex items-center gap-2"><Rocket size={20}/> {t('dashboard.products.launchNewProduct')}</h3>
                <div className="space-y-4">
                    <input className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" placeholder={t('setup.productNamePlaceholder')} value={newProdName} onChange={e => setNewProdName(e.target.value)} />
                    <input className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" placeholder={t('setup.productDescPlaceholder')} value={newProdDesc} onChange={e => setNewProdDesc(e.target.value)} />
                    <Button onClick={handleCreateProductSubmit} className="w-full py-3" variant="primary">{t('dashboard.products.startDev')}</Button>
                </div>
            </div>
        )}

        <div className="grid grid-cols-1 gap-5">
            {state.products.map(p => (
                <div key={p.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-blue-500 to-indigo-600"></div>
                    <div className="flex flex-col md:flex-row justify-between md:items-start gap-4 mb-6 pl-4">
                        <div>
                            <h3 className="text-2xl font-bold text-slate-900 leading-tight">{p.name}</h3>
                            <span className="inline-block mt-2 px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-lg uppercase tracking-wide border border-blue-100">{p.stage}</span>
                        </div>
                        <div className="text-right">
                            <div className="text-3xl font-bold text-emerald-600 font-heading tracking-tight">${p.revenue.toLocaleString()}</div>
                            <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">{t('dashboard.products.monthlyRevenue')}</div>
                        </div>
                    </div>
                    
                    <div className="pl-4 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="col-span-1 md:col-span-1">
                            <div className="flex justify-between text-xs font-bold text-slate-500 mb-2"><span>{t('dashboard.products.devProgress')}</span><span>{p.developmentProgress}%</span></div>
                            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-blue-500 transition-all duration-700" style={{width: `${p.developmentProgress}%`}}></div></div>
                        </div>
                        <div className="flex justify-between items-center bg-slate-50 px-4 py-3 rounded-xl border border-slate-100">
                            <div className="text-xs font-bold text-slate-500 uppercase">{t('dashboard.stats.users')}</div>
                            <div className="font-bold text-slate-800 text-lg">{p.users.toLocaleString()}</div>
                        </div>
                        <div className="flex justify-between items-center bg-slate-50 px-4 py-3 rounded-xl border border-slate-100">
                            <div className="text-xs font-bold text-slate-500 uppercase">{t('dashboard.products.quality')}</div>
                            <div className={`font-bold text-lg ${p.quality > 80 ? 'text-emerald-600' : 'text-slate-800'}`}>{p.quality}/100</div>
                        </div>
                        <div className="flex justify-between items-center bg-rose-50 px-4 py-3 rounded-xl border border-rose-100">
                            <div className="text-xs font-bold text-rose-500 uppercase flex items-center gap-1"><ShieldAlert size={14}/> {t('dashboard.products.techDebt')}</div>
                            <div className={`font-bold text-lg ${p.techDebt > 60 ? 'text-rose-600' : 'text-slate-800'}`}>{p.techDebt}%</div>
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-slate-100">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <Package size={16} className="text-blue-500"/> {t('dashboard.products.modulesTitle')}
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {p.modules.map(mod => {
                                const assignedEmp = state.employees.find(e => e.id === mod.assignedEmployeeId);
                                return (
                                    <div key={mod.id} className="bg-slate-50 p-4 rounded-xl border border-slate-200 relative overflow-hidden">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="font-bold text-sm text-slate-800">{mod.name}</div>
                                            <div className="text-[10px] bg-blue-100 text-blue-700 font-bold px-1.5 py-0.5 rounded uppercase">{mod.requiredSkill}</div>
                                        </div>
                                        <div className="mb-3">
                                            <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1"><span>{t('dashboard.products.devProgress')}</span><span>{mod.progress}%</span></div>
                                            <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden"><div className="h-full bg-blue-500" style={{width: `${mod.progress}%`}}></div></div>
                                        </div>
                                        
                                        <select 
                                            className="w-full text-[10px] bg-white border border-slate-200 rounded-lg p-1.5 font-bold text-slate-700 outline-none"
                                            onChange={(e) => onAssignToModule(e.target.value, p.id, mod.id)}
                                            value={mod.assignedEmployeeId || ""}
                                        >
                                            <option value="">Unassigned</option>
                                            {state.employees.filter(e => e.assignedProductId === p.id).map(e => (
                                                <option key={e.id} value={e.id}>{e.name} ({e.skill})</option>
                                            ))}
                                        </select>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
};
