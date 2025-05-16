import { useGLTF } from "@react-three/drei";
import { useMemo } from "react";


const Chicken = (props: any) => {
    const originalScene = useGLTF("/models/mobs/chicken_balloon.glb").scene;
    const clonedScene = useMemo(() => originalScene.clone(true), [originalScene]);

    clonedScene.scale.set(0.3, 0.3, 0.3);
    return <primitive object={clonedScene} {...props} />;
};

export default Chicken;

useGLTF.preload("/models/mobs/chicken_balloon.glb");