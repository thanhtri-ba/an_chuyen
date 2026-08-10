import { useRef, useState, useEffect } from'react';
import { Canvas } from'@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Text, useGLTF } from'@react-three/drei';
import * as THREE from'three';

// Coordinate mapping for the seats (approximate relative to the GLB model center)
// These coordinates need to match where the seats are in KIMLONG99.glb
const lowerFloorSeats = [
 { id:'A1', x: -1.2, z: -3.5 }, { id:'B1', x: 0, z: -3.5 }, { id:'C1', x: 1.2, z: -3.5 },
 { id:'A2', x: -1.2, z: -2.0 }, { id:'B2', x: 0, z: -2.0 }, { id:'C2', x: 1.2, z: -2.0 },
 { id:'A3', x: -1.2, z: -0.5 }, { id:'B3', x: 0, z: -0.5 }, { id:'C3', x: 1.2, z: -0.5 },
 { id:'A4', x: -1.2, z: 1.0 }, { id:'B4', x: 0, z: 1.0 }, { id:'C4', x: 1.2, z: 1.0 },
 { id:'A5', x: -1.2, z: 2.5 }, { id:'B5', x: 0, z: 2.5 }, { id:'C5', x: 1.2, z: 2.5 },
 { id:'A6', x: -1.2, z: 4.0 }, { id:'B6', x: 0, z: 4.0 }, { id:'C6', x: 1.2, z: 4.0 },
];

const upperFloorSeats = [
 { id:'A7', x: -1.2, z: -3.5 }, { id:'B7', x: 0, z: -3.5 }, { id:'C7', x: 1.2, z: -3.5 },
 { id:'A8', x: -1.2, z: -2.0 }, { id:'B8', x: 0, z: -2.0 }, { id:'C8', x: 1.2, z: -2.0 },
 { id:'A9', x: -1.2, z: -0.5 }, { id:'B9', x: 0, z: -0.5 }, { id:'C9', x: 1.2, z: -0.5 },
 { id:'A10', x: -1.2, z: 1.0 }, { id:'B10', x: 0, z: 1.0 }, { id:'C10', x: 1.2, z: 1.0 },
 { id:'A11', x: -1.2, z: 2.5 }, { id:'B11', x: 0, z: 2.5 }, { id:'C11', x: 1.2, z: 2.5 },
 { id:'A12', x: -1.2, z: 4.0 }, { id:'B12', x: 0, z: 4.0 }, { id:'C12', x: 1.2, z: 4.0 },
];

// Invisible Hitbox Component for Seat Selection
function SeatHitbox({ 
 position, 
 id, 
 isSelected, 
 isOccupied,
 onClick 
}: { 
 position: [number, number, number], 
 id: string, 
 isSelected: boolean,
 isOccupied: boolean,
 onClick: (id: string, status: string) => void
}) {
 const [hovered, setHovered] = useState(false);

 // If selected, we show a glowing box around the seat.
 // If not selected but hovered, we show a slight highlight.
 // If occupied, we show a red/gray tint.
 
 const opacity = isSelected ? 0.6 : (hovered && !isOccupied ? 0.3 : 0);
 const color = isOccupied ?'#ef4444' : (isSelected ?'#fbbf24' :'#ffffff');

 return (
 <group position={position}>
 {/* The interactive box */}
 <mesh 
 onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = isOccupied ?'not-allowed' :'pointer'; }} 
 onPointerOut={(e) => { e.stopPropagation(); setHovered(false); document.body.style.cursor ='grab'; }}
 onClick={(e) => { e.stopPropagation(); onClick(id, isOccupied ?'occupied' :'available'); }}
 >
 <boxGeometry args={[1.0, 1.5, 1.0]} />
 <meshStandardMaterial 
 color={color} 
 transparent 
 opacity={opacity} 
 emissive={isSelected ?'#fbbf24' :'#000000'}
 emissiveIntensity={isSelected ? 1 : 0}
 depthWrite={false}
 />
 </mesh>
 
 {/* Seat Label */}
 <Text
 position={[0, 1.0, 0]}
 fontSize={0.4}
 color={isOccupied ?"#ef4444" : (isSelected ?"#fbbf24" :"#ffffff")}
 anchorX="center"
 anchorY="middle"
 outlineWidth={0.03}
 outlineColor="#000000"
 visible={!isOccupied || hovered} // Hide occupied labels unless hovered to reduce clutter
 >
 {id}
 </Text>
 </group>
 );
}

// Real Bus Model with Hitboxes overlay
function RealBusModel({ 
 selectedSeats, 
 currentFloor,
 onSeatToggle,
 occupiedSeats
}: { 
 selectedSeats: string[],
 currentFloor:'lower' |'upper',
 onSeatToggle: (id: string, status: string) => void,
 occupiedSeats: string[]
}) {
 // Load the GLTF model from the public folder
 const { scene } = useGLTF('/KIMLONG99.glb');
 const clonedScene = scene.clone();

 // Determine which seats to render hitboxes for based on the active tab
 const activeSeats = currentFloor ==='lower' ? lowerFloorSeats : upperFloorSeats;
 // Base Y offset for lower and upper floor seats relative to the GLB model
 const floorYOffset = currentFloor ==='lower' ? 0.8 : 2.8; 

 return (
 <group>
 {/* The visual 3D Model */}
 <primitive 
 object={clonedScene} 
 position={[0, 0, 0]} 
 scale={[1, 1, 1]} 
 />

 {/* The invisible hitboxes overlay */}
 {activeSeats.map((seat) => (
 <SeatHitbox 
 key={seat.id}
 position={[seat.x, floorYOffset, seat.z]} 
 id={seat.id}
 isSelected={selectedSeats.includes(seat.id)}
 isOccupied={occupiedSeats.includes(seat.id)}
 onClick={onSeatToggle}
 />
 ))}
 </group>
 );
}

export function BusModel3D({ 
 selectedSeats = [],
 currentFloor ='lower',
 onSeatToggle,
 occupiedSeats = []
}: { 
 selectedSeats?: string[],
 currentFloor?:'lower' |'upper',
 onSeatToggle?: (id: string, status: string) => void,
 occupiedSeats?: string[]
}) {
 return (
 <div className="w-full h-full bg-slate-900 overflow-hidden relative cursor-grab active:cursor-grabbing">
 <div className="absolute top-4 left-4 z-10 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-medium text-white shadow-sm border border-white/10 flex items-center gap-2">
 <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></div>
 Click vào ghế để chọn | Kéo thả để xoay
 </div>
 
 {selectedSeats.length > 0 && (
 <div className="absolute bottom-4 left-4 z-10 bg-yellow-400/90 backdrop-blur-md px-4 py-2 text-sm font-bold text-slate-900 shadow-lg transition-all">
 Ghế đang chọn: {selectedSeats.join(',')}
 </div>
 )}

 <Canvas camera={{ position: [12, 10, 15], fov: 45 }}>
 <ambientLight intensity={0.6} />
 <directionalLight position={[10, 20, 10]} intensity={1.5} castShadow />
 <pointLight position={[0, 5, 0]} intensity={0.5} color="#fbbf24" />
 <Environment preset="night" />
 
 <RealBusModel 
 selectedSeats={selectedSeats}
 currentFloor={currentFloor}
 onSeatToggle={onSeatToggle || (() => {})}
 occupiedSeats={occupiedSeats}
 />
 
 <ContactShadows position={[0, -0.2, 0]} opacity={0.7} scale={20} blur={2.5} far={4} color="#000000" />
 <OrbitControls 
 enablePan={true}
 enableZoom={true}
 minDistance={5}
 maxDistance={30}
 autoRotate={false} // Disable auto-rotate so user can click seats easily
 maxPolarAngle={Math.PI / 2 - 0.05} // Prevent looking from underground
 />
 </Canvas>
 </div>
 );
}
