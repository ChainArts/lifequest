import { Canvas, invalidate, useFrame } from "@react-three/fiber";
import { Environment, MapControls, PerformanceMonitor, PerspectiveCamera, useGLTF } from "@react-three/drei";
import "./IslandContainer.scss";
import { EffectComposer, SMAA, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import FloatingObject from "../../../lib/FloatingObject";
import IslandMenu from "../IslandMenu/IslandMenu";
import { AnimatePresence } from "motion/react";

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

const ClampCamera = ({ controlsRef, minZ, maxZ }: { controlsRef: React.RefObject<any>; minZ: number; maxZ: number }) => {
    useFrame(() => {
        invalidate();
        if (controlsRef.current) {
            const camera = controlsRef.current.object;
            camera.position.z = Math.max(minZ, Math.min(maxZ, camera.position.z));
            controlsRef.current.target.z = Math.max(minZ, Math.min(maxZ, controlsRef.current.target.z));
            controlsRef.current.update();
        }
    });
    return null;
};

const CameraLerp = ({ location, camRef }: { location: string; camRef: React.RefObject<any> }) => {
    // Define the target position once
    const targetPosition = new THREE.Vector3(40, 10, 0);
    useFrame(() => {
        invalidate();
        if (camRef.current && location !== "/island") {
            // Lerp toward the targetPosition with an interpolation factor (e.g., 0.1)
            camRef.current.position.lerp(targetPosition, 0.1);
        }
    });
    return null;
};

const IslandContainer = ({ location }: { location: string }) => {
    const navigate = useNavigate();
    const [degraded, degrade] = useState(false);
    const controlsRef = useRef<any>(null);
    const [isActive, setIsActive] = useState(location === "/island");
    const camRef = useRef<any>(null);
    const [dpr, setDpr] = useState(1);

    const chickens = useMemo(() => {
        const chickenArray = [];
        for (let i = 0; i < 10; i++) {
            chickenArray.push(
                <FloatingObject key={i} amplitude={0.5} frequency={Math.random() * 2 + 0.5}>
                    <Chicken key={i} position={[Math.random() * 15 - 3, Math.random() * 5, Math.random() * 15 - 8]} />
                </FloatingObject>
            );
        }
        return chickenArray;
    }, []);

    const handleIsActive = () => {
        setIsActive(!isActive);
        navigate("/island");
    };

    useEffect(() => {
        setIsActive(location === "/island");
    }, [location]);

    // Define your boundaries
    const minZ = -10,
        maxZ = 10;

    return (
        <section className={`island-container ${isActive ? "island-container--active" : ""}`} onClick={!isActive ? () => handleIsActive() : undefined}>
            <Canvas className="island-container__canvas" shadows frameloop="demand" dpr={dpr} gl={{ alpha: false, stencil: false, depth: false, powerPreference: "high-performance" }}>
                {/* <Stats /> */}
                <PerspectiveCamera ref={camRef} makeDefault position={[40, 10, 0]} fov={50} />
                <ClampCamera controlsRef={controlsRef} minZ={minZ} maxZ={maxZ} />
                <MapControls ref={controlsRef} enabled={isActive} enableRotate={false} enableDamping dampingFactor={0.05} enableZoom={false} />
                <EffectComposer>
                    <SMAA />
                    <Vignette eskil={false} offset={0.1} darkness={0.5} />
                </EffectComposer>
                <PerformanceMonitor onChange={({ factor }) => setDpr(Math.round(0.5 + 1 * factor))} onDecline={() => degrade(true)} />
                <Environment near={0.01} far={300} frames={degraded ? 1 : Infinity} resolution={512} backgroundRotation={[0, 0, 0]} files="/models/skybox.hdr" background backgroundIntensity={1.5} environmentIntensity={1.25} backgroundBlurriness={0.05} />
                <pointLight position={[-10, 15, 20]} decay={0} intensity={6} color={"#ffeebb"} shadow-mapSize-width={1536} shadow-mapSize-height={1536} castShadow />
                <Island position={[0, 0, 0]} scale={20} />
                {chickens.map((chicken) => chicken)}
                <CameraLerp location={location} camRef={camRef} />
            </Canvas>
            <AnimatePresence mode="wait">{isActive && <IslandMenu />}</AnimatePresence>
        </section>
    );
};

export default IslandContainer;

useGLTF.preload("/models/island.glb");
useGLTF.preload("/models/mobs/chicken_balloon.glb");
