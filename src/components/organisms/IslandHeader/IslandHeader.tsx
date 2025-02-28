import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Stats } from "@react-three/drei";
import "./IslandHeader.scss";
import * as THREE from "three";
import { useMemo } from "react";

const Island = (props: any) => {
    const scene = useMemo(() => {
        const { scene } = useGLTF("/src/assets/models/island.glb");
        // scale up the island by 10
        scene.scale.set(10, 10, 10);
        return scene;
    }, []);

    return <primitive object={scene} {...props} />;
};

const IslandHeader = () => {
    const skybox = useMemo(() => {
        const loader = new THREE.TextureLoader();
        return loader.load("/src/assets/models/skybox.png");
    }, []);
    return (
        <header className="island-header">
            <Canvas
                className="island-header__canvas"
                onCreated={({ gl, scene }) => {
                    const rt = new THREE.WebGLCubeRenderTarget(skybox.image.height);
                    rt.fromEquirectangularTexture(gl, skybox);
                    scene.background = rt.texture;
                }}
            >
                <Stats />
                <OrbitControls />
                <ambientLight intensity={Math.PI / 2} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
                <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
                <Island position={[0, 0, 0]} />
            </Canvas>
        </header>
    );
};

export default IslandHeader;
