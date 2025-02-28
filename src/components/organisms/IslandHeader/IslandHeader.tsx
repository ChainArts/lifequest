import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Stats } from "@react-three/drei";
import "./IslandHeader.scss";
import * as THREE from "three";
import { useMemo } from "react";

const Island = (props: any) => {
    const scene = useMemo(() => {
        const { scene } = useGLTF("/src/assets/models/island.glb");
        // scale up the island by 20
        scene.scale.set(20, 20, 20);
        return scene;
    }, []);

    return <primitive object={scene} {...props} />;
};

const Chicken = (props: any) => {
    const originalScene = useGLTF("/src/assets/models/mobs/chicken_balloon.glb").scene;
    const clonedScene = useMemo(() => originalScene.clone(true), [originalScene]);

    clonedScene.scale.set(0.3, 0.3, 0.3);
    return <primitive object={clonedScene} {...props} />;
};

const IslandHeader = () => {
    const texture = useMemo(() => {
        const loader = new THREE.TextureLoader();
        return loader.load('/src/assets/models/skybox.png');
    }, []);

    return (
        <header className="island-header">
            <Canvas className="island-header__canvas" onCreated={({ gl, scene }) => {
                const pmremGenerator = new THREE.PMREMGenerator(gl);
                pmremGenerator.compileEquirectangularShader();

                const rt = new THREE.WebGLCubeRenderTarget(texture.image.height);
                rt.fromEquirectangularTexture(gl, texture);
                scene.background = rt.texture;
                scene.environment = pmremGenerator.fromEquirectangular(texture).texture;
            }}>
                <Stats />
                <OrbitControls />
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 0]} decay={0} intensity={Math.PI / 2} />
                <Island position={[0, 0, 0]} />
                <Chicken position={[2, 2, 0]}  rotation={[0, Math.PI / 2, 0]}/>
                <Chicken position={[-3, 0.5, 2]}  rotation={[0, Math.PI / 2, 0]}/>
                <Chicken position={[1, 1.5, -2]} />
            </Canvas>
        </header>
    );
};



export default IslandHeader;
