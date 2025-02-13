import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Stats } from "@react-three/drei";
import "./IslandHeader.scss";

const Model = (props: any) => {
    const { scene } = useGLTF("/src/assets/models/island.glb"); // update the path to your GLB file
    return <primitive object={scene} {...props} />;
};

const IslandHeader = () => {
    return (
        <Canvas className="island-header">
            <Stats />
            <OrbitControls />
            <ambientLight intensity={Math.PI / 2} />
            <spotLight
                position={[10, 10, 10]}
                angle={0.15}
                penumbra={1}
                decay={0}
                intensity={Math.PI}
            />
            <pointLight
                position={[-10, -10, -10]}
                decay={0}
                intensity={Math.PI}
            />
            <Model position={[0, 0, 0]} />
        </Canvas>
    );
};

export default IslandHeader;

