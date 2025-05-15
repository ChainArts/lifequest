import { useRef, useEffect } from "react";
import { Clone, useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";
import { useLoader } from "@react-three/fiber";
import { gsap } from "gsap";

export default function Duck(props: any) {
    const cloneRef = useRef<THREE.Group>(null);
    const { scene, animations } = useGLTF("/models/mobs/duck.glb");
    const { actions } = useAnimations(animations, cloneRef);
    const shadowTexture = useLoader(THREE.TextureLoader, "/shadow.png");

    // your circle parameters
    const radius = 0.5;
    const loops = 2;
    const circleDur = 4;
    const outDur = 0.5;

    // store the duck's base “forward” rotation
    const initialRot = useRef(0);
    useEffect(() => {
        const r = cloneRef.current!;
        // capture whatever it started looking at
        initialRot.current = r.rotation.y;
        // immediately place it at (radius, 0) on XZ and face tangent
        r.position.set(radius, 0, 0);
        r.rotation.y = initialRot.current + Math.PI / 2;
    }, [radius]);

    const handleClick = () => {
        const duck = cloneRef.current!;
        const walk = actions["walkcycle_1"]!;

        // spin the walk loop _forever_
        walk.reset();
        walk.setLoop(THREE.LoopRepeat, Infinity);
        walk.play();

        // dummy angle to drive the loop
        const angle = { value: 0 };

        const tl = gsap.timeline({
            onComplete: () => {
                // stop the walk
                walk.stop();
                // snap back (in case of any drift)
                duck.position.set(radius, 0, 0);
                duck.rotation.y = initialRot.current + Math.PI / 2;
            },
        });

        // 1) Circle loops
        tl.to(angle, {
            value: Math.PI * 2 * loops,
            duration: circleDur,
            ease: "none",
            onUpdate: () => {
                const θ = angle.value;
                duck.position.x = Math.cos(θ) * radius;
                duck.position.z = Math.sin(θ) * radius;
                // always face tangent: heading = θ + π/2
                duck.rotation.y = initialRot.current - θ + Math.PI;
            },
        })

            // 2) Lerp OUT back to the starting rim point
            .to(duck.position, { x: radius, z: 0, duration: outDur, ease: "power1.inOut" }, ">-0.1")
            .to(
                duck.rotation,
                {
                    duration: outDur,
                    ease: "power1.inOut",
                    y: () => initialRot.current + Math.PI / 2,
                },
                "<"
            );
    };

    return (
        <group {...props} dispose={null} onClick={handleClick}>
            <Clone object={scene} ref={cloneRef}>
                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
                    <planeGeometry args={[1, 1]} />
                    <meshBasicMaterial map={shadowTexture} transparent opacity={0.75} />
                </mesh>
            </Clone>
        </group>
    );
}

useGLTF.preload("/models/mobs/duck.glb");
useLoader.preload(THREE.TextureLoader, "/shadow.png");
