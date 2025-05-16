import { useRef, useEffect, useMemo } from "react";
import { useGLTF, useAnimations, useTexture } from "@react-three/drei";
import { SkeletonUtils } from "three-stdlib";
import * as THREE from "three";
import { gsap } from "gsap";

export default function Duck(props: any) {
    const cloneRef = useRef<THREE.Group>(null);
    const { scene, animations } = useGLTF("/models/mobs/duck.glb");

    // 1. Deep-clone the scene (so each duck has its own Skeleton & bind matrices)
    //    and bake any scale BEFORE we ever bind animations.
    const duckScene = useMemo(() => {
        const clone = SkeletonUtils.clone(scene);
        // if you ever pass a scale prop, apply it here:
        if (props.scale) {
            clone.scale.set(props.scale[0], props.scale[1], props.scale[2]);
        }
        return clone;
    }, [scene, props.scale]);

    // 2. Hook up animations to *that* clone
    const { actions } = useAnimations(animations, cloneRef);

    // your circle params
    const radius = 0.5;
    const loops = 2;
    const circleDur = 4;
    const outDur = 0.5;

    // capture the duck's “forward” facing so we can restore it
    const initialRot = useRef(0);
    useEffect(() => {
        const r = cloneRef.current!;
        initialRot.current = r.rotation.y;
        // put it on the rim, facing tangent
        r.position.set(radius, 0, 0);
        r.rotation.y = initialRot.current + Math.PI / 2;
    }, [radius]);

    const handleClick = () => {
        const duck = cloneRef.current!;
        const walk = actions["walkcycle_1"]!;
        walk.reset().setLoop(THREE.LoopRepeat, Infinity).play();

        // animate it around a circle with GSAP
        const angle = { value: 0 };
        const tl = gsap.timeline({
            onComplete: () => {
                walk.stop();
                duck.position.set(radius, 0, 0);
                duck.rotation.y = initialRot.current + Math.PI / 2;
            },
        });

        // 1) go around the circle
        tl.to(angle, {
            value: Math.PI * 2 * loops,
            duration: circleDur,
            ease: "none",
            onUpdate: () => {
                const θ = angle.value;
                duck.position.x = Math.cos(θ) * radius;
                duck.position.z = Math.sin(θ) * radius;
                duck.rotation.y = initialRot.current - θ + Math.PI;
            },
        })
            // 2) lerp back out to the start point
            .to(duck.position, { x: radius, z: 0, duration: outDur, ease: "power1.inOut" }, ">-0.1")
            .to(
                duck.rotation,
                {
                    y: () => initialRot.current + Math.PI / 2,
                    duration: outDur,
                    ease: "power1.inOut",
                },
                "<"
            );
    };

    const shadowTexture = useTexture("/shadow.png");

    return (
        <group {...props} dispose={null} onClick={handleClick}>
            {/* our deep-cloned skinned model */}
            <primitive object={duckScene} ref={cloneRef}>
                {/* same shadow plane you had before */}
                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
                    <planeGeometry args={[1, 1]} />
                    <meshBasicMaterial map={shadowTexture} transparent opacity={0.75} />
                </mesh>
            </primitive>
        </group>
    );
}

useGLTF.preload("/models/mobs/duck.glb");
useTexture.preload("/shadow.png");
