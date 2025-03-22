import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, OrbitControls, PerformanceMonitor, PerspectiveCamera, useGLTF } from "@react-three/drei";
import "./IslandHeader.scss";
import { EffectComposer, SMAA, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";
import { useMemo, useState } from "react";
import FloatingObject from "../../../lib/FloatingObject";

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Chicken = (props: any) => {
    const originalScene = useGLTF("/models/mobs/chicken_balloon.glb").scene;
    const clonedScene = useMemo(() => originalScene.clone(true), [originalScene]);

    clonedScene.scale.set(0.3, 0.3, 0.3);
    return <primitive object={clonedScene} {...props} />;
};

const IslandHeader = () => {
    const [degraded, degrade] = useState(false);

    return (
        <header className="island-header">
            <Canvas className="island-header__canvas" shadows dpr={[1, 2]} gl={{ alpha: false, stencil: false, depth: false, powerPreference: "high-performance" }}>
                {/* <Stats /> */}
                <PerspectiveCamera makeDefault position={[12, 2, 0]} fov={60} />
                <OrbitControls />
                <EffectComposer>
                    <SMAA />
                    <Vignette eskil={false} offset={0.1} darkness={0.5} />
                </EffectComposer>
                <PerformanceMonitor onDecline={() => degrade(true)} />
                <Environment near={0.01} far={300} frames={degraded ? 1 : Infinity} resolution={4096} backgroundRotation={[0, 0, 0]} files="/models/skybox.hdr" background backgroundIntensity={1.15} backgroundBlurriness={0.075} />
                <pointLight position={[-10, 15, 20]} decay={0} intensity={6} color={"#ffeebb"} shadow-mapSize-width={2048} shadow-mapSize-height={2048} castShadow />
                <Island position={[0, 0, 0]} scale={20} />
                <FloatingObject amplitude={0.5} frequency={0.8}>
                    <Chicken position={[-3, 4, 1]} rotation={[0, Math.PI / 14, 0]} />
                </FloatingObject>
                <FloatingObject amplitude={0.5} frequency={1.2}>
                    <Chicken position={[1, 0.5, 4]} rotation={[0, Math.PI / 2, 0]} />
                </FloatingObject>
                <FloatingObject amplitude={0.5} frequency={1}>
                    <Chicken position={[1, 1.5, -4]} />
                </FloatingObject>
            </Canvas>
        </header>
    );
};

export default IslandHeader;
