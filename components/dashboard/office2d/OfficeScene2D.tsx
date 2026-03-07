import React, { useState, useEffect, useMemo } from 'react';
import { GameState, Employee } from '../../../types';
import { EmployeeSprite } from './EmployeeSprite';
import { IsometricFurniture } from './IsometricFurniture';

interface OfficeScene2DProps {
    state: GameState;
    onEmployeeClick: (empId: string) => void;
    isModalOpen?: boolean;
}

// Isometric Constants
const TILE_WIDTH = 120;
const TILE_HEIGHT = 60;

/**
 * Converts Grid coordinates to Screen coordinates
 */
export const toScreen = (x: number, y: number) => {
    return {
        x: (x - y) * (TILE_WIDTH / 2),
        y: (x + y) * (TILE_HEIGHT / 2)
    };
};

export const OfficeScene2D: React.FC<OfficeScene2DProps> = ({ state, onEmployeeClick, isModalOpen }) => {
    const [zoom, setZoom] = useState(1);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    const officeFacility = state.facilities.find(f => f.id === 'office');
    const level = officeFacility ? officeFacility.level : 1;

    // ENVIRONMENT THEMES based on Level
    const theme = useMemo(() => {
        if (level === 1) return { bg: '#fdf2e9', grid: '#edbd95', label: 'GARAGE STARTUP', floor: '#f5e6d3' };
        if (level === 2) return { bg: '#eef2f3', grid: '#b2bec3', label: 'INCUBATOR HUB', floor: '#dfe6e9' };
        if (level === 3) return { bg: '#dfe6e9', grid: '#74b9ff', label: 'MODERN STUDIO', floor: '#f1f2f6' };
        if (level >= 4) return { bg: '#2f3542', grid: '#70a1ff', label: 'CORPORATE HQ', floor: '#57606f' };
        return { bg: '#fdf2e9', grid: '#edbd95', label: 'OFFICE', floor: '#f5e6d3' };
    }, [level]);

    // Social Conversation Logic
    const [activeConvo, setActiveConvo] = useState<{
        participants: string[];
        currentSpeaker: string;
        message: string;
        icon?: string;
    } | null>(null);

    const convoPool = [
        [
            { text: "Này, ông thử cái framework mới chưa?", icon: "🚀" },
            { text: "Cái Java-Skynet á? Deploy xong thấy nó tự code luôn...", icon: "🤖" }
        ],
        [
            { text: "Deadline tới mông rồi mà sếp vẫn đòi thêm tính năng.", icon: "😰" },
            { text: "Tính năng 'Tự động nghỉ việc' á? Tui mới commit xong nè.", icon: "💡" }
        ],
        [
            { text: "Nghe nói công ty sắp có máy cà phê mới.", icon: "☕" },
            { text: "Loại pha bằng AI á? Uống xong thấy code như thần.", icon: "⚡" }
        ],
        [
            { text: "Máy ông sao kêu to vậy?", icon: "🔊" },
            { text: "Đang train AI tìm người yêu... Chắc cháy máy mất.", icon: "🔥" }
        ],
        [
            { text: "Lương tháng này ông định làm gì?", icon: "💰" },
            { text: "Mua thêm RAM, chứ Chrome nó ăn hết thanh xuân của tui rồi.", icon: "🐏" }
        ]
    ];

    useEffect(() => {
        const triggerSocial = setInterval(() => {
            if (activeConvo || state.employees.length < 2) return;

            if (Math.random() > 0.7) {
                const idx1 = Math.floor(Math.random() * state.employees.length);
                let idx2 = Math.floor(Math.random() * state.employees.length);
                while (idx2 === idx1) idx2 = Math.floor(Math.random() * state.employees.length);

                const e1 = state.employees[idx1];
                const e2 = state.employees[idx2];
                const scriptSet = convoPool[Math.floor(Math.random() * convoPool.length)];

                setActiveConvo({
                    participants: [e1.id, e2.id],
                    currentSpeaker: e1.id,
                    message: scriptSet[0].text,
                    icon: scriptSet[0].icon
                });

                setTimeout(() => {
                    setActiveConvo(prev => prev ? {
                        ...prev,
                        currentSpeaker: e2.id,
                        message: scriptSet[1].text,
                        icon: scriptSet[1].icon
                    } : null);
                    setTimeout(() => setActiveConvo(null), 9000);
                }, 8000);
            }
        }, 15000);
        return () => clearInterval(triggerSocial);
    }, [state.employees, activeConvo]);

    // Grid size scales with level: 6x6 -> 10x10 -> 14x14 -> 18x18
    const gridSize = 6 + (level * 4);

    const handleMouseDown = (e: React.MouseEvent) => {
        if (e.button !== 0) return;
        setIsDragging(true);
        setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;
        setOffset({
            x: e.clientX - dragStart.x,
            y: e.clientY - dragStart.y
        });
    };

    const handleMouseUp = () => setIsDragging(false);

    const handleWheel = (e: React.WheelEvent) => {
        const delta = e.deltaY > 0 ? -0.15 : 0.15;
        setZoom(prev => Math.min(Math.max(prev + delta, 0.3), 3.0));
    };

    // Slot-based placement: Employees take specific slots in the grid
    const sortedElements = useMemo(() => {
        const elements: any[] = [];

        // Fixed slots for desks based on a spiral or ordered pattern
        const getSlotPos = (index: number) => {
            const rowWidth = Math.floor(gridSize / 3);
            const gridX = (index % rowWidth) * 3 + 2;
            const gridY = Math.floor(index / rowWidth) * 3 + 2;
            return { gridX, gridY };
        };

        state.employees.forEach((emp, i) => {
            const { gridX, gridY } = getSlotPos(i);

            // 1. Back Layer: Chair & Monitor
            elements.push({
                type: 'furniture-back',
                id: `desk-back-${emp.id}`,
                gridX: gridX + 0.3,
                gridY: gridY - 0.2,
                depth: gridX + gridY - 0.2
            });

            // 2. Middle Layer: Employee
            elements.push({
                type: 'employee',
                id: emp.id,
                gridX: gridX + 0.3,
                gridY: gridY - 0.2,
                data: emp,
                depth: gridX + gridY
            });

            // 3. Front Layer: Desk Surface
            elements.push({
                type: 'furniture-front',
                id: `desk-front-${emp.id}`,
                gridX,
                gridY,
                depth: gridX + gridY + 0.1
            });

            // 4. TOP LAYER: Social Bubble (Always on top of furniture)
            if (activeConvo?.participants.includes(emp.id) && activeConvo.currentSpeaker === emp.id) {
                elements.push({
                    type: 'social-bubble',
                    id: `bubble-${emp.id}`,
                    gridX: gridX + 0.3,
                    gridY: gridY - 0.2,
                    data: { text: activeConvo.message, icon: activeConvo.icon },
                    depth: 1000 + gridX + gridY // Extremely high depth
                });
            }
        });

        return elements.sort((a, b) => a.depth - b.depth);
    }, [state.employees, gridSize, activeConvo]);

    return (
        <div
            className="w-full h-full relative overflow-hidden bg-slate-900"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
        >
            <div
                className="w-full h-full cursor-grab active:cursor-grabbing transition-colors duration-700"
                style={{ backgroundColor: theme.bg }}
            >
                <div
                    className="absolute inset-0 flex items-center justify-center p-20 select-none"
                    style={{
                        transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
                        transformOrigin: 'center center'
                    }}
                >
                    <svg
                        viewBox={`-${gridSize * 60} 0 ${gridSize * 120} ${gridSize * 80}`}
                        className="w-full h-full overflow-visible"
                    >
                        {/* FLOOR PLATE */}
                        <path
                            d={`M ${toScreen(0, 0).x} ${toScreen(0, 0).y}
                               L ${toScreen(gridSize, 0).x} ${toScreen(gridSize, 0).y}
                               L ${toScreen(gridSize, gridSize).x} ${toScreen(gridSize, gridSize).y}
                               L ${toScreen(0, gridSize).x} ${toScreen(0, gridSize).y} Z`}
                            fill={theme.floor}
                            stroke={theme.grid}
                            strokeWidth="2"
                            className="transition-all duration-1000"
                        />

                        {/* ISO GRID */}
                        <g>
                            {Array.from({ length: gridSize + 1 }).map((_, i) => {
                                const start = toScreen(0, i);
                                const end = toScreen(gridSize, i);
                                return (
                                    <line
                                        key={`h-${i}`}
                                        x1={start.x} y1={start.y}
                                        x2={end.x} y2={end.y}
                                        stroke={theme.grid}
                                        strokeWidth="1"
                                        opacity="0.3"
                                    />
                                );
                            })}
                            {Array.from({ length: gridSize + 1 }).map((_, i) => {
                                const start = toScreen(i, 0);
                                const end = toScreen(i, gridSize);
                                return (
                                    <line
                                        key={`v-${i}`}
                                        x1={start.x} y1={start.y}
                                        x2={end.x} y2={end.y}
                                        stroke={theme.grid}
                                        strokeWidth="1"
                                        opacity="0.3"
                                    />
                                );
                            })}
                        </g>

                        {/* SORTED ELEMENTS */}
                        <g>
                            {sortedElements.map((el) => {
                                const screenPos = toScreen(el.gridX, el.gridY);
                                if (el.type === 'furniture-back') {
                                    return <IsometricFurniture key={el.id} x={screenPos.x} y={screenPos.y} mode="back" />;
                                }
                                if (el.type === 'furniture-front') {
                                    return <IsometricFurniture key={el.id} x={screenPos.x} y={screenPos.y} mode="front" />;
                                }
                                if (el.type === 'social-bubble') {
                                    return (
                                        <EmployeeSprite
                                            key={el.id}
                                            employee={{} as any} // Dummy, we only need bubble part
                                            x={screenPos.x}
                                            y={screenPos.y}
                                            isWorking={false}
                                            onClick={() => { }}
                                            onlyBubble={true}
                                            socialMessage={el.data}
                                        />
                                    );
                                }
                                return (
                                    <EmployeeSprite
                                        key={el.id}
                                        employee={el.data as Employee}
                                        x={screenPos.x}
                                        y={screenPos.y}
                                        isWorking={(el.data as any).energy > 10}
                                        onClick={() => onEmployeeClick(el.data.id)}
                                        hideLabel={isModalOpen}
                                    />
                                );
                            })}
                        </g>
                    </svg>
                </div>
            </div>

            {/* Dynamic Corporate HUD Overlay */}
            <div className="absolute top-6 left-6 z-10 pointer-events-none flex flex-col gap-2">
                <div className="bg-[#1e272e] text-white px-6 py-4 rounded-tr-[3rem] rounded-bl-[1.5rem] border-l-[12px] border-amber-500 shadow-[0_20px_50px_rgba(0,0,0,0.3)] backdrop-blur-md min-w-[200px]">
                    <div className="text-[10px] font-black text-amber-400 uppercase tracking-[0.5em] mb-1 opacity-80">{theme.label}</div>
                    <div className="flex items-baseline justify-between gap-4">
                        <div className="text-4xl font-black tracking-tighter flex items-center gap-2">
                            {state.employees.length}<span className="opacity-30 text-xl font-medium">/{officeFacility?.value || 3}</span>
                        </div>
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                            TEAM SIZE
                        </div>
                    </div>
                    <div className="mt-3 w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                            className={`h-full transition-all duration-1000 ${state.employees.length >= (officeFacility?.value || 3) ? 'bg-red-500 animate-pulse' : 'bg-amber-500'}`}
                            style={{ width: `${Math.min(100, (state.employees.length / (officeFacility?.value || 3)) * 100)}%` }}
                        />
                    </div>
                    <div className="mt-2 text-[9px] font-bold text-slate-500 uppercase tracking-tighter flex justify-between">
                        <span>Lvl. {level}</span>
                        <span>{officeFacility?.value ? officeFacility.value - state.employees.length : 0} SLOTS LEFT</span>
                    </div>
                </div>
            </div>

            <div className="absolute bottom-6 right-6 flex gap-3 p-3 bg-white/50 backdrop-blur-md rounded-3xl border border-white/20 shadow-xl">
                <button
                    onClick={() => setZoom(prev => Math.min(prev + 0.2, 3))}
                    className="w-12 h-12 bg-white text-slate-700 rounded-2xl flex items-center justify-center font-bold hover:bg-slate-50 shadow-md transition-all active:scale-90"
                >
                    +
                </button>
                <button
                    onClick={() => setZoom(prev => Math.max(prev - 0.2, 0.3))}
                    className="w-12 h-12 bg-white text-slate-700 rounded-2xl flex items-center justify-center font-bold hover:bg-slate-50 shadow-md transition-all active:scale-90"
                >
                    -
                </button>
                <div className="w-px h-12 bg-slate-300 mx-1" />
                <button
                    onClick={() => { setOffset({ x: 0, y: 0 }); setZoom(1); }}
                    className="px-6 h-12 bg-[#1e272e] text-white rounded-2xl flex items-center justify-center font-bold text-xs hover:bg-slate-800 shadow-md transition-all active:scale-95 uppercase tracking-widest"
                >
                    Recenter
                </button>
            </div>
        </div>
    );
};
