import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { Employee } from '../../../types';

interface EmployeeAvatarProps {
  employee: Employee;
  onClick: (id: string) => void;
  position: [number, number, number];
}

export const EmployeeAvatar: React.FC<EmployeeAvatarProps> = ({ employee, onClick, position }) => {
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  
  // Random slight movement
  const timeOffset = useMemo(() => Math.random() * 100, []);
  
  useFrame((state) => {
    if (meshRef.current) {
       // Gentle breathing/bobbing animation
       meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2 + timeOffset) * 0.05;
    }
  });

  // Color mapping based on role
  const roleColors: Record<string, string> = {
    'Developer': '#3b82f6',
    'Designer': '#ec4899',
    'Marketer': '#f59e0b',
    'Sales': '#10b981',
    'Manager': '#8b5cf6',
    'Secretary': '#ec4899',
    'Tester': '#64748b'
  };

  const bodyColor = roleColors[employee.role] || '#94a3b8';

  return (
    <group 
      ref={meshRef} 
      position={position} 
      onClick={(e) => { e.stopPropagation(); onClick(employee.id); }}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto'; }}
    >
      {/* Body: Capsule */}
      <mesh castShadow position={[0, 0.4, 0]}>
        <capsuleGeometry args={[0.2, 0.4, 4, 8]} />
        <meshStandardMaterial color={bodyColor} roughness={0.7} />
      </mesh>
      
      {/* Head: Sphere */}
      <mesh castShadow position={[0, 0.9, 0]}>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial color={employee.stress > 80 ? '#fca5a5' : '#fed7aa'} roughness={0.5} />
      </mesh>

      {/* Select Highlight Ring */}
      {hovered && (
        <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
           <ringGeometry args={[0.3, 0.35, 16]} />
           <meshBasicMaterial color="#ffffff" side={THREE.DoubleSide} />
        </mesh>
      )}

      {/* Floating Name Label */}
      <Html position={[0, 1.4, 0]} center zIndexRange={[100, 0]} distanceFactor={8}>
          <div className="flex flex-col items-center pointer-events-none transition-opacity duration-200" style={{ opacity: hovered ? 1 : 0.6 }}>
             {employee.stress > 80 && (
                <div className="bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full mb-1 animate-bounce shadow-sm">
                   STRESSED
                </div>
             )}
             <div className={`px-2 py-0.5 rounded-md text-xs font-bold shadow-md transform transition-transform ${hovered ? 'scale-110' : ''} bg-white text-slate-800 border border-slate-200`}>
                 {employee.name}
             </div>
             <div className="text-[9px] font-bold bg-slate-800/80 text-white px-1.5 rounded mt-0.5 uppercase">
                 {employee.role}
             </div>
          </div>
      </Html>
    </group>
  );
};
