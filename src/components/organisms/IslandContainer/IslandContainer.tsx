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
import { useIsland } from "../../../lib/IslandContext";
import Island from "./Island";
import Chicken from "./Chicken";
import Fox from "./Fox";
import Duck from "./Duck";

const IslandContainer = ({ location }: { location: string }) => {
    const navigate = useNavigate();
    const [degraded, degrade] = useState(false);
    const controlsRef = useRef<any>(null);
    const [isActive, setIsActive] = useState(location === "/island");
    const camRef = useRef<any>(null);
    const [dpr, setDpr] = useState(1);
    const [lerpSpeed, setLerpSpeed] = useState(0.005);

    const { zones } = useIsland();

    const animals = useMemo(() => {
        return zones.flatMap((zone) =>
            zone.slots.map((slot) => {
                const pos: [number, number, number] = [slot.position.x, slot.position.y, slot.position.z];
                // random rotation on Z axis only
                const rot: [number, number, number] = [0, Math.random() * Math.PI * 2, 0];

                if (slot.enabled) {
                    if (slot.animal === "chicken") {
                        return (
                            <FloatingObject key={slot.id} amplitude={0.5} frequency={Math.random() * 2 + 0.5}>
                                <Chicken position={pos} rotation={rot} />
                            </FloatingObject>
                        );
                    }
                    else if (slot.animal === "duck") {
                        return (
                            <Duck key={slot.id} position={pos} rotation={rot} />
                        );
                    }
                return <Fox key={slot.id} position={pos} rotation={rot} scale={[0.3, 0.3, 0.3]} />
            }
            
            })
        );
    }, [zones]);

    const handleIsActive = () => {
        navigate("/island");
        setLerpSpeed(0.01);
    };

    useEffect(() => {
        setIsActive(location === "/island");
    }, [location]);

    // Define your boundaries
    const minZ = -50,
        maxZ = 50;

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
                <PerspectiveCamera ref={camRef} makeDefault position={[-20, -20, -80]} fov={50} />
                <CameraLerp location={location} camRef={camRef} lerpSpeed={lerpSpeed}/>
                <ClampCamera controlsRef={controlsRef} minZ={minZ} maxZ={maxZ} />
                {isActive && <MapControls ref={controlsRef}  enableDamping dampingFactor={0.05} minDistance={15} maxDistance={50} zoomSpeed={3} screenSpacePanning={false} />}
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
                <pointLight position={[-30, 30, 30]} decay={0} intensity={6} color={"#ffeebb"} shadow-mapSize-width={2048} shadow-mapSize-height={2048} castShadow />
                <Island position={[0, 0, 0]} scale={20} />
                <Island position={[-10, 5, -10]} scale={20} />
                <Island position={[-10, 2, 12]} scale={20} rotation={[0, Math.PI / 2, 0]} />
                {animals}
            </Canvas>
            <AnimatePresence mode="wait">{isActive && <IslandMenu />}</AnimatePresence>
        </section>
    );
};

export default IslandContainer;
