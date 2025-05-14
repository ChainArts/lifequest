import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

const CameraLerp = ({ location, camRef }: { location: string; camRef: React.RefObject<any> }) => {
    // Define the target position once
    const targetPosition = new THREE.Vector3(40, 10, 0);
    useFrame(() => {
        if (camRef.current && location !== "/island") {
            // Lerp toward the targetPosition with an interpolation factor (e.g., 0.1)
            camRef.current.position.lerp(targetPosition, 0.1);
        }
    });
    return null;
};

export default CameraLerp;