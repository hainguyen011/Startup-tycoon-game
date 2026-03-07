import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { Employee } from '../../../types';

interface EmployeeAvatarProps {
  employee: Employee;
  onClick: (id: string) => void;
  position: [number, number, number];
  isWorking?: boolean;
  hideLabel?: boolean;
}

export const EmployeeAvatar: React.FC<EmployeeAvatarProps> = ({ employee, onClick, position, isWorking, hideLabel }) => {
  const meshRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Mesh>(null);
  const rightArmRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Reference Visuals: 0: Red Bun/Yellow, 1: Black Polo/Purple, 2: Blonde/Red Jacket
  const variations = useMemo(() => {
    const visualType = Math.floor(Math.random() * 3);
    return {
      timeOffset: Math.random() * 100,
      visualType,
      armSpeed: 10 + Math.random() * 5
    };
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (meshRef.current) {
      if (isWorking) {
        meshRef.current.position.y = position[1] + 0.45 + Math.sin(t * 5 + variations.timeOffset) * 0.01;
        if (leftArmRef.current && rightArmRef.current) {
          leftArmRef.current.rotation.x = -0.7 + Math.sin(t * variations.armSpeed) * 0.2;
          rightArmRef.current.rotation.x = -0.7 + Math.cos(t * (variations.armSpeed + 1)) * 0.2;
        }
        if (headRef.current) headRef.current.rotation.x = 0.35 + Math.sin(t * 8) * 0.02;
      } else {
        meshRef.current.position.y = position[1] + 0.45 + Math.sin(t * 1.2 + variations.timeOffset) * 0.025;
        if (leftArmRef.current && rightArmRef.current) {
          leftArmRef.current.rotation.x = 0.1 + Math.sin(t * 1.2) * 0.05;
          rightArmRef.current.rotation.x = 0.1 + Math.sin(t * 1.2) * 0.05;
        }
        if (headRef.current) {
          headRef.current.rotation.y = Math.sin(t * 0.5 + variations.timeOffset) * 0.2;
          headRef.current.rotation.x = Math.sin(t * 0.3) * 0.05;
        }
      }
    }
  });

  const config = useMemo(() => {
    switch (variations.visualType) {
      case 0: return { skin: '#e2a182', shirt: '#facc15', hair: '#ef4444', type: 'bun' };
      case 1: return { skin: '#d28c6e', shirt: '#818cf8', hair: '#171717', type: 'polo' };
      case 2: return { skin: '#c48a73', shirt: '#dc2626', hair: '#fbbf24', type: 'jacket' };
      default: return { skin: '#ffdbac', shirt: '#94a3b8', hair: '#422006', type: 'polo' };
    }
  }, [variations.visualType]);

  const clayMatProps = { roughness: 0.9, metalness: 0 };

  return (
    <group
      ref={meshRef}
      position={position}
      onClick={(e) => { e.stopPropagation(); onClick(employee.id); }}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto'; }}
    >
      {/* CLAY TORSO */}
      <mesh castShadow position={[0, 0.1, 0]}>
        <boxGeometry args={[0.38, 0.45, 0.24]} />
        <meshStandardMaterial color={config.shirt} {...clayMatProps} />
      </mesh>

      {/* CLAY ARMS */}
      <mesh ref={leftArmRef} castShadow position={[-0.24, 0.25, 0]}>
        <boxGeometry args={[0.12, 0.38, 0.12]} />
        <meshStandardMaterial color={config.shirt} {...clayMatProps} />
      </mesh>
      <mesh ref={rightArmRef} castShadow position={[0.24, 0.25, 0]}>
        <boxGeometry args={[0.12, 0.38, 0.12]} />
        <meshStandardMaterial color={config.shirt} {...clayMatProps} />
      </mesh>

      {/* CLAY NECK */}
      <mesh position={[0, 0.35, 0]}>
        <cylinderGeometry args={[0.06, 0.08, 0.1]} />
        <meshStandardMaterial color={config.skin} {...clayMatProps} />
      </mesh>

      {/* CLAY HEAD (Authentic Faceless) */}
      <group ref={headRef} position={[0, 0.55, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[0.3, 20, 20]} />
          <meshStandardMaterial color={config.skin} {...clayMatProps} />
        </mesh>

        {/* HAIR MODELS - Clay Blobs */}
        {config.type === 'bun' && ( // Red Bun Style
          <group>
            <mesh position={[0, 0.12, -0.05]} scale={[1.1, 1, 1]}>
              <sphereGeometry args={[0.3, 16, 16]} />
              <meshStandardMaterial color={config.hair} {...clayMatProps} />
            </mesh>
            <mesh position={[0, 0.42, -0.1]}>
              <sphereGeometry args={[0.15, 12, 12]} />
              <meshStandardMaterial color={config.hair} {...clayMatProps} />
            </mesh>
          </group>
        )}

        {config.type === 'polo' && ( // Black Cropped Style
          <mesh position={[0, 0.15, -0.02]} scale={[1.1, 0.8, 1.1]}>
            <sphereGeometry args={[0.32, 16, 16]} />
            <meshStandardMaterial color={config.hair} {...clayMatProps} />
          </mesh>
        )}

        {config.type === 'jacket' && ( // Blonde Bob Style
          <mesh position={[0, 0.1, -0.1]} scale={[1.1, 1, 1.1]}>
            <sphereGeometry args={[0.33, 16, 16]} />
            <meshStandardMaterial color={config.hair} {...clayMatProps} />
          </mesh>
        )}

        {/* CLOTHING DETAILS (Collars etc) */}
        {config.type === 'polo' && (
          <mesh position={[0, -0.25, 0.12]} rotation={[0.4, 0, 0]}>
            <boxGeometry args={[0.18, 0.08, 0.02]} />
            <meshStandardMaterial color="#ffffff" {...clayMatProps} />
          </mesh>
        )}
        {config.type === 'jacket' && (
          <mesh position={[0, -0.25, 0.12]}>
            <boxGeometry args={[0.2, 0.15, 0.02]} />
            <meshStandardMaterial color="#ffffff" {...clayMatProps} />
          </mesh>
        )}
      </group>

      {/* Select Shadow */}
      {hovered && (
        <mesh position={[0, -0.18, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.5, 32]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.4} />
        </mesh>
      )}

      {/* Label (Simple and clean) */}
      {!hideLabel && (
        <Html
          position={[0, 1.1, 0]}
          center
          distanceFactor={10}
          style={{ pointerEvents: 'none' }}
        >
          <div className={`flex flex-col items-center transition-all duration-300 ${hovered ? 'scale-110' : 'scale-100'}`}>
            <div className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border-2 border-slate-100">
              <span className="text-slate-800 text-[10px] font-black uppercase tracking-widest">
                {employee.name.split(' ').pop()}
              </span>
            </div>
            {employee.stress > 80 && (
              <div className="mt-1 w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
            )}
          </div>
        </Html>
      )}
    </group>
  );
};
