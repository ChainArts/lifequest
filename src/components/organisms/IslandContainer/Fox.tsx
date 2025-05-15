import { useRef, useMemo } from "react";
import { useGLTF, useAnimations, useTexture } from "@react-three/drei";
import { SkeletonUtils } from "three-stdlib";
import * as THREE from "three";

export default function Fox(props: any) {
    const cloneRef = useRef<THREE.Group>(null);
    const { scene, animations } = useGLTF("/models/mobs/fox_rig.glb");
    const shadowTexture = useTexture("/shadow.png");

    const foxScene = useMemo(() => {
        const clone = SkeletonUtils.clone(scene);
        return clone;
    }, [scene]);

    const { actions } = useAnimations(animations, cloneRef);

    // click handler to wag exactly twice
    const handleClick = () => {
        const wag = actions["Wag"];
        if (wag) {
            wag.reset();
            wag.setLoop(THREE.LoopRepeat, 2);
            wag.play();
        }
    };

    return (
        <group {...props} onClick={handleClick}>
            <primitive object={foxScene} ref={cloneRef} />
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.1, 0]}>
                <planeGeometry args={[3, 6]} />
                <meshBasicMaterial map={shadowTexture} transparent opacity={0.75} />
            </mesh>
        </group>
    );
}

useGLTF.preload("/models/mobs/fox_rig.glb");
useTexture.preload("/shadow.png");
