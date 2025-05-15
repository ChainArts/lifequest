import { useGLTF } from "@react-three/drei";
import { useMemo } from "react";
import { TextureLoader } from "three";
import { useLoader } from "@react-three/fiber";

const Fox = (props: any) => {
    const originalScene = useGLTF("/models/mobs/fox.glb").scene;
    const clonedScene = useMemo(() => originalScene.clone(true), [originalScene]);

    // Load the shadow texture
    const shadowTexture = useLoader(TextureLoader, "/shadow.png");

    clonedScene.scale.set(0.3, 0.3, 0.3);

    return (
        <group {...props}>
            {/* Fox model */}
            <primitive object={clonedScene} />

            {/* Fake shadow */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
                <planeGeometry args={[1.5, 2]} />
                <meshBasicMaterial map={shadowTexture} transparent={true} opacity={0.75} />
            </mesh>
        </group>
    );
};

export default Fox;

useGLTF.preload("/models/mobs/chicken_balloon.glb");