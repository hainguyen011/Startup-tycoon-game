import React from 'react';

interface IsometricFurnitureProps {
    x: number;
    y: number;
    mode: 'front' | 'back';
}

export const IsometricFurniture: React.FC<IsometricFurnitureProps> = ({ x, y, mode }) => {
    if (mode === 'back') {
        return (
            <g transform={`translate(${x}, ${y})`}>
                {/* CHAIR (Sitting position - Perfectly Centered) */}
                <g transform="translate(0, 0)">
                    <ellipse cx="0" cy="0" rx="14" ry="7" fill="black" opacity="0.1" />
                    {/* Backrest */}
                    <path
                        d="M -12 -5 Q -12 -25 0 -28 Q 12 -25 12 -5"
                        fill="#34495e"
                        stroke="#1e272e"
                        strokeWidth="1.5"
                    />
                    {/* Seat */}
                    <ellipse cx="0" cy="-6" rx="14" ry="9" fill="#2c3e50" stroke="#1e272e" strokeWidth="1.5" />
                </g>

                {/* STATIONERY - Monitor (Centered on the back edge) */}
                <g transform="translate(0, -18)">
                    <rect x="-1" y="0" width="2" height="6" fill="#2c3e50" />
                    <rect x="-22" y="-24" width="44" height="28" rx="4" fill="#1e272e" stroke="#2c3e50" strokeWidth="2" />
                    <rect x="-18" y="-20" width="36" height="20" fill="#3498db" opacity="0.1" />
                </g>
            </g>
        );
    }

    return (
        <g transform={`translate(${x}, ${y})`}>
            {/* DESK SHADOW */}
            <path
                d="M -80 -5 L 20 45 L 80 15 L -20 -35 Z"
                fill="black"
                opacity="0.05"
            />

            {/* DESK LEGS (Connecting surface corners to floor) */}
            <g stroke="#2c3e50" strokeWidth="1.2" opacity="0.3">
                <line x1="-80" y1="-10" x2="-80" y2="0" />
                <line x1="20" y1="40" x2="20" y2="50" />
                <line x1="80" y1="10" x2="80" y2="20" />
                <line x1="-20" y1="-40" x2="-20" y2="-30" />
            </g>

            {/* DESK SURFACE (Sleeker 4:1 Rectangle) */}
            <g transform="translate(0, -10)">
                {/* Desk top */}
                <path
                    d="M -80 -10 L 20 40 L 80 10 L -20 -40 Z"
                    fill="#ecf0f1"
                    stroke="#2c3e50"
                    strokeWidth="2.2"
                />

                {/* Desk Side Thickness */}
                <path
                    d="M -80 -10 L -80 -7 L 20 43 L 80 13 L 80 10 L 20 40 Z"
                    fill="#bdc3c7"
                    stroke="#2c3e50"
                    strokeWidth="1.2"
                />

                {/* Keyboard (Centered) */}
                <path
                    d="M -18 12 L 2 2 L 22 12 L 2 22 Z"
                    fill="#34495e"
                    stroke="#2c3e50"
                    strokeWidth="1"
                />
            </g>
        </g>
    );
};
