import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

interface FloatingObjectProps {
    amplitude: number;
    frequency: number;
    children: React.ReactNode;
}



const FloatingObject = ({ amplitude, frequency, children } : FloatingObjectProps) => {
    const groupRef = useRef<THREE.Group>(null);
    const initialOffset = useMemo(() => (Math.random() - 0.5) * amplitude, [amplitude]);
    useFrame(({ clock }) => {
        if (groupRef.current) {
            groupRef.current.position.y = initialOffset + Math.sin(clock.elapsedTime * frequency) * amplitude;
        }
    });
    return <group ref={groupRef}>{children}</group>;
};

export default FloatingObject;