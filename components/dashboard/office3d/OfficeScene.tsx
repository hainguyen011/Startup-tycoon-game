import React, { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Grid, ContactShadows } from '@react-three/drei';
import { GameState, Facility } from '../../../types';
import { EmployeeAvatar } from './EmployeeAvatar';

interface OfficeSceneProps {
    state: GameState;
    onEmployeeClick: (empId: string) => void;
}

const Desk = ({ position }: { position: [number, number, number] }) => (
    <group position={position}>
        <mesh castShadow receiveShadow position={[0, 0.35, 0]}>
            <boxGeometry args={[1.2, 0.05, 0.6]} />
            <meshStandardMaterial color="#e2e8f0" roughness={0.8} />
        </mesh>
        <mesh castShadow receiveShadow position={[-0.55, 0.175, 0]}>
             <boxGeometry args={[0.05, 0.35, 0.5]} />
             <meshStandardMaterial color="#cbd5e1" roughness={0.9} />
        </mesh>
        <mesh castShadow receiveShadow position={[0.55, 0.175, 0]}>
             <boxGeometry args={[0.05, 0.35, 0.5]} />
             <meshStandardMaterial color="#cbd5e1" roughness={0.9} />
        </mesh>
        {/* Laptop/Monitor proxy */}
        <mesh castShadow position={[0, 0.45, 0.1]} rotation={[-0.2, 0, 0]}>
             <boxGeometry args={[0.4, 0.25, 0.02]} />
             <meshStandardMaterial color="#1e293b" metalness={0.5} roughness={0.2} />
        </mesh>
    </group>
);

export const OfficeScene: React.FC<OfficeSceneProps> = ({ state, onEmployeeClick }) => {
    
    // Determine visuals based on facility level
    const officeFacility = state.facilities.find(f => f.id === 'office');
    const level = officeFacility ? officeFacility.level : 1;
    
    // Pre-calculate positions for employees to sit at desks
    // In a real game, this would be saved in the state.
    const employeePositions = useMemo(() => {
        const positions: [number, number, number][] = [];
        const spacingX = 2;
        const spacingZ = 1.5;
        const cols = Math.ceil(Math.sqrt(state.employees.length || 1));
        
        state.employees.forEach((_, i) => {
            const row = Math.floor(i / cols);
            const col = i % cols;
            // Center around origin
            const x = (col - (cols - 1) / 2) * spacingX;
            const z = (row - (Math.floor(state.employees.length / cols) - 1) / 2) * spacingZ;
            positions.push([x, 0, z]);
        });
        return positions;
    }, [state.employees]);

    return (
        <div className="w-full h-full relative cursor-grab active:cursor-grabbing bg-slate-50 rounded-2xl overflow-hidden border border-slate-200">
            <Canvas shadows camera={{ position: [5, 4, 5], fov: 45 }}>
                <color attach="background" args={level === 1 ? ['#f1f5f9'] : ['#f8fafc']} />
                <fog attach="fog" args={['#f8fafc', 5, 20]} />
                
                <ambientLight intensity={level === 1 ? 0.3 : 0.6} />
                <directionalLight
                    castShadow
                    position={[5, 8, 2]}
                    intensity={level === 1 ? 0.8 : 1.2}
                    shadow-mapSize={[1024, 1024]}
                >
                    <orthographicCamera attach="shadow-camera" args={[-5, 5, 5, -5]} />
                </directionalLight>

                {/* The Floor */}
                <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
                    <planeGeometry args={[20, 20]} />
                    <meshStandardMaterial color={level === 1 ? "#94a3b8" : "#cbd5e1"} roughness={1} />
                </mesh>
                
                <Grid infiniteGrid fadeDistance={20} sectionColor="#94a3b8" cellColor="#cbd5e1" />
                
                {/* Desks and Employees */}
                <group position={[0, 0, 0]}>
                    {state.employees.map((emp, i) => {
                        const pos = employeePositions[i];
                        return (
                            <group key={emp.id}>
                                <Desk position={[pos[0], 0, pos[2] - 0.4]} />
                                <EmployeeAvatar 
                                    employee={emp} 
                                    position={pos} 
                                    onClick={onEmployeeClick} 
                                />
                            </group>
                        );
                    })}
                </group>

                {/* Subtle environmental reflections */}
                <Environment preset="city" />
                <ContactShadows position={[0, 0, 0]} opacity={0.4} scale={20} blur={2} far={4} />
                <OrbitControls 
                    makeDefault 
                    minPolarAngle={Math.PI / 4} 
                    maxPolarAngle={Math.PI / 2 - 0.1}
                    maxDistance={15}
                    minDistance={3}
                />
            </Canvas>
            
            {/* UI Overlay */}
            <div className="absolute top-4 left-4 z-10 pointer-events-none">
                <div className="bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{officeFacility?.name || 'Office'}</div>
                    <div className="text-sm font-bold text-slate-800">Level {level}</div>
                </div>
            </div>
            <div className="absolute bottom-4 left-4 text-xs font-bold text-slate-400 uppercase tracking-widest pointer-events-none">
                {state.employees.length} Employees Active
            </div>
        </div>
    );
};
