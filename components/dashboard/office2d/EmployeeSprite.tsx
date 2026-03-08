import React from 'react';
import { Employee } from '../../../types';

interface EmployeeSpriteProps {
    employee: Employee;
    x: number;
    y: number;
    onClick: () => void;
    status: string;
    hideLabel?: boolean;
    socialMessage?: { text: string; icon: string } | null;
    onlyBubble?: boolean;
    renderMode?: 'all' | 'body' | 'hands';
}

export const EmployeeSprite: React.FC<EmployeeSpriteProps> = ({
    employee, x, y, onClick, status, hideLabel, socialMessage, onlyBubble, renderMode = 'all'
}) => {
    // Determine visuals based on status
    const isWorking = ['coding_backend', 'designing_ui', 'querying_db', 'contract_work'].includes(status);
    const isBurnout = status === 'burnout';
    const isCoffee = status === 'coffee_time';
    
    // Status icons
    const statusIcons: Record<string, string> = {
        coding_backend: "💻",
        designing_ui: "🎨",
        querying_db: "🗄️",
        contract_work: "📑",
        coffee_time: "☕",
        burnout: "🤯",
        idle: "💤"
    };

    const isStressed = employee.stress > 80 || isBurnout;
    const baseColor = isStressed ? '#e74c3c' : '#e67e22';

    // Calculate dynamic width for the bubble
    const bubbleWidth = socialMessage ? Math.min(150, Math.max(90, (socialMessage.text.length * 4.5) + 50)) : 0;
    const halfWidth = bubbleWidth / 2;
    const bubbleHeight = 44;
    const halfHeight = bubbleHeight / 2;

    return (
        <g
            transform={`translate(${x}, ${y})`}
            onClick={(e) => { e.stopPropagation(); onClick(); }}
            className="cursor-pointer group"
        >
            {!onlyBubble && (
                <>
                    {/* Sprite Shadow */}
                    <ellipse cx="0" cy="5" rx="20" ry="10" fill="black" opacity="0.1" />

                    {/* CHARACTER SPRITE */}
                    <g className={`
                        ${isWorking ? 'animate-bounce-slow' : 'animate-idle-sway'}
                        ${isBurnout ? 'animate-shake' : ''}
                    `}>
                        {/* Body - Render if mode is 'all' or 'body' */}
                        {(renderMode === 'all' || renderMode === 'body') && (
                            <>
                                <path
                                    d="M -22 0 Q -22 -46 0 -50 Q 22 -46 22 0 Z"
                                    fill={baseColor}
                                    stroke="#2c3e50"
                                    strokeWidth="3.2"
                                />
                                <circle
                                    cx="0" cy="-68" r="19"
                                    fill={baseColor}
                                    stroke="#2c3e50"
                                    strokeWidth="3.2"
                                />
                            </>
                        )}

                        {/* Typing Hands - Render if mode is 'all' or 'hands' */}
                        {(renderMode === 'all' || renderMode === 'hands') && isWorking && (
                            <g className="animate-typing-hands">
                                {/* Left Hand - Positioned on keyboard */}
                                <circle cx="-34" cy="-28" r="5.5" fill="#f39c12" stroke="#2c3e50" strokeWidth="2.5" />
                                {/* Right Hand - Positioned on keyboard */}
                                <circle cx="-14" cy="-20" r="5.5" fill="#f39c12" stroke="#2c3e50" strokeWidth="2.5" />
                            </g>
                        )}
                    </g>

                    {/* STATUS INDICATOR (When not in convo) - Only on body layer */}
                    {(renderMode === 'all' || renderMode === 'body') && !socialMessage && (
                        <g transform="translate(25, -85)" className="animate-bubble-pop">
                            <circle r="12" fill="white" stroke="#2c3e50" strokeWidth="2" />
                            <text y="4" textAnchor="middle" fontSize="12">{statusIcons[status]}</text>
                        </g>
                    )}
                </>
            )}

            {/* SOCIAL SPEECH BUBBLE (TOP LAYER OVERLAY) */}
            {(onlyBubble && socialMessage) && (
                <g transform={`translate(0, -145)`} className="animate-bubble-pop">
                    {/* Shadow */}
                    <path
                        d={`M ${-halfWidth} ${-halfHeight} H ${halfWidth} A 8 8 0 0 1 ${halfWidth + 8} ${-halfHeight + 8} V ${halfHeight - 8} A 8 8 0 0 1 ${halfWidth} ${halfHeight} H 10 L 0 ${halfHeight + 10} L -10 ${halfHeight} H ${-halfWidth} A 8 8 0 0 1 ${-halfWidth - 8} ${halfHeight - 8} V ${-halfHeight + 8} A 8 8 0 0 1 ${-halfWidth} ${-halfHeight} Z`}
                        fill="black" opacity="0.08" transform="translate(2, 2)"
                    />
                    {/* Main Bubble */}
                    <path
                        d={`M ${-halfWidth} ${-halfHeight} H ${halfWidth} A 8 8 0 0 1 ${halfWidth + 8} ${-halfHeight + 8} V ${halfHeight - 8} A 8 8 0 0 1 ${halfWidth} ${halfHeight} H 10 L 0 ${halfHeight + 10} L -10 ${halfHeight} H ${-halfWidth} A 8 8 0 0 1 ${-halfWidth - 8} ${halfHeight - 8} V ${-halfHeight + 8} A 8 8 0 0 1 ${-halfWidth} ${-halfHeight} Z`}
                        fill="white" stroke="#2c3e50" strokeWidth="2.5"
                    />
                    <foreignObject x={-halfWidth} y={-halfHeight + 5} width={bubbleWidth} height={bubbleHeight - 4}>
                        <div className="flex flex-row items-center justify-center h-full px-3 text-center">

                            <span className="text-[9.5px] font-bold text-[#2c3e50] leading-[1.2] whitespace-normal">
                                {socialMessage.icon} {socialMessage.text}
                            </span>
                        </div>
                    </foreignObject>
                </g>
            )}



            {/* Label - Attached to the body layer */}
            {(!hideLabel && !onlyBubble) && (
                <foreignObject x="-50" y={socialMessage ? "-190" : "-130"} width="100" height="40" className="transition-all duration-300 overflow-visible pointer-events-none">
                    <div className="flex flex-col items-center">
                        <div className={`px-2 py-0.5 bg-[#2c3e50] text-white text-[9px] font-bold rounded-md border-b-2 border-orange-500 shadow-lg transition-transform group-hover:scale-110`}>
                            {employee?.name?.split(' ').pop()?.toUpperCase() || "STAFF"}
                        </div>
                    </div>
                </foreignObject>
            )}

            {/* Inline Styles for specific animations */}
            <style>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-2px); }
        }
        @keyframes idle-sway {
          0%, 100% { transform: rotate(-1deg); }
          50% { transform: rotate(1deg); }
        }
        @keyframes typing-hands {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        @keyframes bubble-pop {
          from { opacity: 0; transform: translateY(10px) scale(0.6); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-2px) rotate(-1deg); }
          75% { transform: translateX(2px) rotate(1deg); }
        }
        .animate-bounce-slow { animation: bounce-slow 0.4s infinite; }
        .animate-idle-sway { animation: idle-sway 3s ease-in-out infinite; }
        .animate-typing-hands { animation: typing-hands 0.15s infinite; }
        .animate-bubble-pop { animation: bubble-pop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
        .animate-shake { animation: shake 0.2s infinite; }
      `}</style>
        </g>
    );
};
