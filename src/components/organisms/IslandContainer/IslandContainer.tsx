import { Canvas } from "@react-three/fiber";
import { Environment, MapControls, PerformanceMonitor, PerspectiveCamera } from "@react-three/drei";
import "./IslandContainer.scss";
import { EffectComposer, SMAA, Vignette } from "@react-three/postprocessing";
import CameraLerp from "./CameraLerp";
import ClampCamera from "./ClampCamera";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import FloatingObject from "../../../lib/FloatingObject";
import IslandMenu from "../IslandMenu/IslandMenu";
import { AnimatePresence } from "motion/react";
import Island from "./Island";
import Chicken from "./Chicken";

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
            <Canvas
                className="island-container__canvas"
                shadows
                dpr={dpr}
                gl={{ alpha: false, stencil: false, depth: false, powerPreference: "high-performance" }}
                onCreated={({ gl }) => {
                    gl.shadowMap.autoUpdate = false;
                    gl.shadowMap.needsUpdate = true;
                }}
            >
                {/* <Stats /> */}
                <PerspectiveCamera ref={camRef} makeDefault position={[40, 10, 0]} fov={50} />
                <ClampCamera controlsRef={controlsRef} minZ={minZ} maxZ={maxZ} />
                <MapControls ref={controlsRef} enabled={isActive} enableRotate={false} enableDamping dampingFactor={0.05} minDistance={15} maxDistance={50} zoomSpeed={3} />
                <EffectComposer>
                    <SMAA />
                    <Vignette eskil={false} offset={0.1} darkness={0.5} />
                </EffectComposer>
                <PerformanceMonitor
                    onChange={({ factor }) => {
                        const newDpr = Math.round((0.5 + 1 * factor) * 10) / 10;
                        setDpr(newDpr);
                    }}
                    onDecline={() => degrade(true)}
                />
                <Environment near={0.01} far={300} frames={degraded ? 1 : Infinity} resolution={512} backgroundRotation={[0, 0, 0]} files="/models/skybox.hdr" background backgroundIntensity={1.5} environmentIntensity={1.25} backgroundBlurriness={0.05} />
                <pointLight position={[-10, 15, 20]} decay={0} intensity={6} color={"#ffeebb"} shadow-mapSize-width={2048} shadow-mapSize-height={2048} castShadow />
                <Island position={[0, 0, 0]} scale={20} />
                {chickens.map((chicken) => chicken)}
                <CameraLerp location={location} camRef={camRef} />
            </Canvas>
            <AnimatePresence mode="wait">{isActive && <IslandMenu />}</AnimatePresence>
        </section>
    );
};

export default IslandContainer;
