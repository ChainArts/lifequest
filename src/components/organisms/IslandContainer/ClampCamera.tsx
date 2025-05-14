import { useFrame } from "@react-three/fiber";

const ClampCamera = ({ controlsRef, minZ, maxZ }: { controlsRef: React.RefObject<any>; minZ: number; maxZ: number }) => {
    useFrame(() => {
        if (controlsRef.current) {
            const camera = controlsRef.current.object;
            camera.position.z = Math.max(minZ, Math.min(maxZ, camera.position.z));
            controlsRef.current.target.z = Math.max(minZ, Math.min(maxZ, controlsRef.current.target.z));
            controlsRef.current.update();
        }
    });
    return null;
};

export default ClampCamera;