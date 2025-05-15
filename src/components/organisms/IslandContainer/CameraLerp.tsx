import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useMemo } from "react";

const CameraLerp = ({ location, camRef, lerpSpeed }: { location: string; camRef: React.RefObject<any>; lerpSpeed: number }) => {
    // match your initial camera pos [40, 15, 0]
    const initialPosition = useMemo(() => new THREE.Vector3(40, 15, 0), []);
    const targetZoom = 1;
    const epsilon = 0.01;
    const targetLookAt = new THREE.Vector3(0, 0, 0);

    useFrame(() => {
        const cam = camRef.current;
        if (!cam || location === "/island") return;

        // 1) lerp position & zoom
        cam.position.lerp(initialPosition, lerpSpeed);
        cam.zoom = THREE.MathUtils.lerp(cam.zoom, targetZoom, lerpSpeed);
        cam.lookAt(cam.position.clone().lerp(targetLookAt, lerpSpeed));
        cam.updateProjectionMatrix();

        // 2) if we're within epsilon, snap exactly to initial
        if (cam.position.distanceTo(initialPosition) < epsilon) {
            cam.position.copy(initialPosition);
            cam.zoom = targetZoom;
            cam.lookAt(targetLookAt);
            cam.updateProjectionMatrix();
        }
    });

    return null;
};

export default CameraLerp;
