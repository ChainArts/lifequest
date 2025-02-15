import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Stats } from "@react-three/drei";
import "./IslandHeader.scss";
import * as THREE from "three";

const Model = (props: any) => {
    const { scene } = useGLTF("/src/assets/models/island.glb"); // update the path to your GLB file
    return <primitive object={scene} {...props} />;
};

const IslandHeader = () => {
    return (
        <header className="island-header">
            <Canvas className="island-header__canvas" onCreated={({ scene }) => (scene.background = new THREE.Color("#9da8e6"))}>
                <Stats />
                <OrbitControls />
                <ambientLight intensity={Math.PI / 2} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
                <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
                <Model position={[0, 0, 0]} />
            </Canvas>
        </header>
    );
};

export default IslandHeader;
