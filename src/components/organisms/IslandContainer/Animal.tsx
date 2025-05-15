import React, { useMemo } from "react";
import FloatingObject from "../../../lib/FloatingObject";
import Chicken from "./Chicken";
import Duck from "./Duck";
import Fox from "./Fox";

export interface AnimalProps {
    id: string;
    type: "chicken" | "duck" | "fox";
    position: [number, number, number];
    enabled: boolean;
}

/**
 * memo’d so it only re-renders when `enabled` changes
 */
const Animal: React.FC<AnimalProps> = React.memo(
    ({ id, type, position, enabled }) => {
        // generate random once per id
        const { rot, amplitude, frequency } = useMemo(() => {
            return {
                rot: [0, Math.random() * Math.PI * 2, 0] as [number, number, number],
                amplitude: 0.5,
                frequency: Math.random() * 2 + 0.5,
            };
        }, [id]);

        if (type === "chicken") {
            return (
                <FloatingObject key={id} amplitude={amplitude} frequency={frequency}>
                    <Chicken position={position} rotation={rot} visible={enabled} />
                </FloatingObject>
            );
        } else if (type === "duck") {
            return <Duck key={id} position={position} rotation={rot} visible={enabled} />;
        } else {
            return <Fox key={id} position={position} rotation={rot} scale={[0.3, 0.3, 0.3]} visible={enabled} />;
        }
    },
    // only re-render when `enabled` changes
    (prev, next) => prev.enabled === next.enabled
);

export default Animal;
