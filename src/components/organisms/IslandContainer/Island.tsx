import { useGLTF } from "@react-three/drei";
import * as THREE from "three";


const Island = (props: any) => {
    const originalScene = useGLTF("/models/island.glb").scene;
    const clonedScene = originalScene.clone(true);
    clonedScene.scale.set(props.scale, props.scale, props.scale);
    // add a shadow to the island
    clonedScene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
            child.receiveShadow = true;
            child.castShadow = true;
        }
    });
    return <primitive object={clonedScene} {...props} />;
};

export default Island;

useGLTF.preload("/models/island.glb");