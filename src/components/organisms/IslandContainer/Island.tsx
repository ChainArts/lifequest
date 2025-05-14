import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

interface IslandProps {
    position: [number, number, number];
    scale: number;
}

const Island = (props: IslandProps) => {
    const { scene } = useGLTF("/models/island.glb");
    scene.scale.set(props.scale, props.scale, props.scale);
    // add a shadow to the island
    scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
            child.receiveShadow = true;
            child.castShadow = true;
        }
    });
    return <primitive object={scene} {...props} />;
};

export default Island;

useGLTF.preload("/models/island.glb");