import React from 'react';
import { GameState, GameStage } from '../../../types';
import Button from '../../Button';
import { Trophy, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../../../LanguageContext';

interface GameOverScreenProps {
  state: GameState;
  onRestart: () => void;
}

export const GameOverScreen: React.FC<GameOverScreenProps> = ({ state, onRestart }) => {
  const { t } = useLanguage();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-100 bg-grid-pattern p-4">
      <div className="bg-white/90 backdrop-blur-xl border border-white shadow-2xl rounded-3xl p-8 max-w-lg w-full text-center animate-fadeIn">
        <div className="mb-6 inline-flex p-6 bg-slate-50 rounded-full shadow-inner">
            {state.stage === GameStage.VICTORY ? <Trophy size={60} className="text-yellow-500" /> : <AlertTriangle size={60} className="text-rose-500" />}
        </div>
        <h2 className="text-4xl font-extrabold text-slate-900 mb-4 font-heading">{t('gameover.victory')}</h2>
        <p className="text-slate-600 mb-8 text-lg">{state.stage === GameStage.VICTORY ? `Congrats! ${state.companyName} is now a Unicorn!` : `${state.gameOverReason || t('gameover.reason')}`}</p>
        <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200"><div className="text-xs text-slate-500 uppercase font-bold">Final Users</div><div className="text-2xl font-bold text-slate-900">{state.users.toLocaleString()}</div></div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200"><div className="text-xs text-slate-500 uppercase font-bold">Equity Kept</div><div className="text-2xl font-bold text-yellow-600">{state.equity}%</div></div>
        </div>
        <Button onClick={onRestart} className="w-full py-4 text-lg shadow-xl" variant={state.stage === GameStage.VICTORY ? 'success' : 'primary'}>{t('gameover.restart')}</Button>
      </div>
    </div>
  );
};
