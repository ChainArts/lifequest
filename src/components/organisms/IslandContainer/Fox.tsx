import { useRef } from "react";
import { Clone, useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";
import { useLoader } from "@react-three/fiber";

export default function Fox(props: any) {
  const cloneRef = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF("/models/mobs/fox_rig.glb");
  const { actions } = useAnimations(animations, cloneRef);
  const shadowTexture = useLoader(THREE.TextureLoader, "/shadow.png");

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
    <group {...props} dispose={null} onClick={handleClick}>
      {/* deep-clone so each instance has its own skeleton + bones */}
      <Clone object={scene} ref={cloneRef} />

      {/* optional drop‐shadow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.1, 0]}>
        <planeGeometry args={[3, 6]} />
        <meshBasicMaterial map={shadowTexture} transparent opacity={0.75} />
      </mesh>
    </group>
  );
}

useGLTF.preload("/models/mobs/fox_rig.glb");
useLoader.preload(THREE.TextureLoader, "/shadow.png");