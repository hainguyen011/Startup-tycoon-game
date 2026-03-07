import React, { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Grid, ContactShadows } from '@react-three/drei';
import { GameState, Facility } from '../../../types';
import { EmployeeAvatar } from './EmployeeAvatar';

interface OfficeSceneProps {
    state: GameState;
    onEmployeeClick: (empId: string) => void;
    isModalOpen?: boolean;
}

const TechDesk = ({ position }: { position: [number, number, number] }) => (
    <group position={position}>
        {/* L-Shaped Minimalist Desk */}
        <mesh castShadow receiveShadow position={[0, 0.35, 0]}>
            <boxGeometry args={[1.5, 0.04, 0.7]} />
            <meshStandardMaterial color="#334155" roughness={0.15} metalness={0.1} />
        </mesh>
        <mesh castShadow receiveShadow position={[0.4, 0.35, 0.45]}>
            <boxGeometry args={[0.7, 0.04, 0.8]} />
            <meshStandardMaterial color="#334155" roughness={0.15} metalness={0.1} />
        </mesh>

        {/* Desk Legs - Slim Metal */}
        <mesh position={[-0.7, 0.175, 0.3]}>
            <cylinderGeometry args={[0.02, 0.02, 0.35]} />
            <meshStandardMaterial color="#64748b" metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh position={[0.7, 0.175, 0.3]}>
            <cylinderGeometry args={[0.02, 0.02, 0.35]} />
            <meshStandardMaterial color="#64748b" metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh position={[0.7, 0.175, -0.3]}>
            <cylinderGeometry args={[0.02, 0.02, 0.35]} />
            <meshStandardMaterial color="#64748b" metalness={0.9} roughness={0.1} />
        </mesh>

        {/* Pro Tech Setup */}
        <group position={[0, 0.52, 0.15]}>
            {/* Ultra-wide Curved Monitor */}
            <mesh position={[0, 0, 0]} rotation={[0.05, 0, 0]}>
                <boxGeometry args={[1.1, 0.35, 0.03]} />
                <meshStandardMaterial color="#020617" roughness={0.1} />
            </mesh>
            {/* Screen Content Glow */}
            <pointLight position={[0, 0, -0.1]} intensity={0.5} color="#38bdf8" distance={2} />
            {/* Monitor Stand */}
            <mesh position={[0, -0.15, -0.05]}>
                <boxGeometry args={[0.1, 0.3, 0.02]} />
                <meshStandardMaterial color="#334155" />
            </mesh>
        </group>

        {/* Keyboard with RGB Glow (Simulated) */}
        <mesh position={[0, 0.38, -0.05]}>
            <boxGeometry args={[0.4, 0.02, 0.15]} />
            <meshStandardMaterial color="#1e293b" />
        </mesh>

        {/* Designer Chair */}
        <group position={[0, 0, -0.7]} rotation={[0, Math.PI, 0]}>
            {/* Base */}
            <mesh position={[0, 0.08, 0]}>
                <cylinderGeometry args={[0.2, 0.25, 0.05, 5]} />
                <meshStandardMaterial color="#0f172a" />
            </mesh>
            <mesh position={[0, 0.25, 0]}>
                <cylinderGeometry args={[0.04, 0.04, 0.4]} />
                <meshStandardMaterial color="#94a3b8" metalness={0.9} />
            </mesh>
            {/* Cushion */}
            <mesh position={[0, 0.45, 0]}>
                <boxGeometry args={[0.5, 0.1, 0.5]} />
                <meshStandardMaterial color="#1e293b" roughness={0.8} />
            </mesh>
            {/* Back with curvature */}
            <mesh position={[0, 0.8, 0.22]} rotation={[0.15, 0, 0]}>
                <boxGeometry args={[0.45, 0.7, 0.1]} />
                <meshStandardMaterial color="#1e293b" roughness={0.8} />
            </mesh>
            {/* Headrest */}
            <mesh position={[0, 1.2, 0.25]} rotation={[0.1, 0, 0]}>
                <boxGeometry args={[0.3, 0.15, 0.05]} />
                <meshStandardMaterial color="#0f172a" />
            </mesh>
        </group>
    </group>
);

export const OfficeScene: React.FC<OfficeSceneProps> = ({ state, onEmployeeClick, isModalOpen }) => {

    // Determine visuals based on facility level
    const officeFacility = state.facilities.find(f => f.id === 'office');
    const level = officeFacility ? officeFacility.level : 1;

    // Pre-calculate positions for employees
    const employeePositions = useMemo(() => {
        const positions: [number, number, number][] = [];
        const spacingX = 2.4;
        const spacingZ = 2.0;
        const cols = Math.ceil(Math.sqrt(state.employees.length || 1));

        state.employees.forEach((_, i) => {
            const row = Math.floor(i / cols);
            const col = i % cols;
            const x = (col - (cols - 1) / 2) * spacingX;
            const z = (row - (row / 2)) * spacingZ;
            positions.push([x, 0, z]);
        });
        return positions;
    }, [state.employees]);

    return (
        <div className="w-full h-full relative cursor-grab active:cursor-grabbing bg-slate-50 rounded-2xl overflow-hidden border border-slate-200 shadow-inner">
            <Canvas shadows camera={{ position: [6, 5, 8], fov: 40 }}>
                <color attach="background" args={level === 1 ? ['#f1f5f9'] : ['#f8fafc']} />
                <fog attach="fog" args={['#f8fafc', 8, 25]} />

                <ambientLight intensity={0.4} />
                <spotLight
                    position={[10, 15, 10]}
                    angle={0.3}
                    penumbra={1}
                    intensity={1.5}
                    castShadow
                    shadow-mapSize={[2048, 2048]}
                />
                <pointLight position={[-10, 10, -10]} intensity={0.5} />

                {/* The Boutique Floor */}
                <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
                    <planeGeometry args={[40, 40]} />
                    <meshStandardMaterial color="#f1f5f9" roughness={0.8} />
                </mesh>

                {/* Aesthetic Area Rugs */}
                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
                    <planeGeometry args={[16, 14]} />
                    <meshStandardMaterial color="#64748b" transparent opacity={0.1} />
                </mesh>

                <Grid infiniteGrid fadeDistance={30} sectionColor="#94a3b8" cellColor="#cbd5e1" sectionSize={1} cellSize={0.2} />

                {/* Tech Hub & Employees */}
                <group position={[0, 0, 0]}>
                    {state.employees.map((emp, i) => {
                        const pos = employeePositions[i];
                        const isWorking = emp.status === 'working' || (emp.assignedTo && emp.assignedTo.productId);

                        return (
                            <group key={emp.id} position={[pos[0], 0, pos[2]]}>
                                <TechDesk position={[0, 0, 0]} />
                                <EmployeeAvatar
                                    employee={emp}
                                    position={[0, 0, -0.7]} // Sit in the designer chair
                                    onClick={onEmployeeClick}
                                    isWorking={!!isWorking}
                                    hideLabel={isModalOpen}
                                />
                            </group>
                        );
                    })}
                </group>

                {/* Environmental Polish */}
                <Environment preset="studio" />
                <ContactShadows position={[0, 0, 0]} opacity={0.4} scale={30} blur={2.5} far={5} color="#020617" />

                <OrbitControls
                    makeDefault
                    minPolarAngle={Math.PI / 6}
                    maxPolarAngle={Math.PI / 2.1}
                    maxDistance={25}
                    minDistance={5}
                    enableDamping
                    dampingFactor={0.05}
                />
            </Canvas>

            {/* Premium UI Overlay */}
            <div className="absolute top-5 left-5 z-10 pointer-events-none">
                <div className="bg-white/80 backdrop-blur-xl px-4 py-2 rounded-2xl border border-white/40 shadow-xl">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        <div className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">{officeFacility?.name || 'Main Studio'}</div>
                    </div>
                    <div className="text-xl font-black text-slate-800 tracking-tight">Tier {level}</div>
                </div>
            </div>

            <div className="absolute bottom-6 left-6 bg-slate-900/10 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold text-slate-500 uppercase tracking-widest pointer-events-none border border-slate-900/5">
                {state.employees.length} Members Online
            </div>
        </div>
    );
};
