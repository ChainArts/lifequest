import { useEffect, useState } from "react";
import "./CircularProgress.scss";

type CircularProgressProps = {
    progress: number;
};

const CircularProgress = ({ progress }: CircularProgressProps) => {
    const [animatedNumber, setAnimatedNumber] = useState(0);
    const [previousProgress, setPreviousProgress] = useState(0);

    if (progress > 100) {
        progress = 100;
    } else if (progress < 0) {
        progress = 0;
    }

    const size = 80;
    const radius = size - 10;

    const startAngle = -200;
    const maxRadius = 61;

    const dashArray = 2 * Math.PI * radius;
    const dashOffset =
        dashArray - (dashArray * (maxRadius * (progress / 100))) / 100;

    useEffect(() => {
        let start = previousProgress;
        let end = progress;
        const duration = 1000;
        const startTimestamp = performance.now();

        const animate = (timestamp: number) => {
            const progressTime = Math.min(
                (timestamp - startTimestamp) / duration,
                1
            );
            const easedProgress = easeOutCubic(progressTime);
            const currentNumber = Math.round(
                start + (end - start) * easedProgress
            );
            setAnimatedNumber(currentNumber);

            if (progressTime < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
        setPreviousProgress(progress); // Remember the current progress as the last state
    }, [progress]);

    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    return (
        <svg width={size * 2} height={size * 1.41}>
            <defs>
                <linearGradient
                    id="gradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                >
                    <stop offset="0%" style={{ stopColor: "#93cff5" }} />
                    <stop offset="100%" style={{ stopColor: "#9a98ef" }} />
                </linearGradient>
            </defs>
            <circle
                cx={size}
                cy={size}
                r={radius}
                className="circle-progress__background"
                style={{
                    strokeDasharray: dashArray,
                    strokeDashoffset: dashArray - (dashArray * maxRadius) / 100,
                }}
                transform={`rotate(${startAngle} ${size} ${size})`}
            />
            <circle
                cx={size}
                cy={size}
                r={radius}
                className="circle-progress__foreground"
                style={{
                    strokeDasharray: dashArray,
                    strokeDashoffset: dashOffset,
                }}
                transform={`rotate(${startAngle} ${size} ${size})`}
                stroke="url(#gradient)"
            />

            <text
                x={size}
                y={size}
                textAnchor="middle"
                className="circle-progress__number"
            >{`${animatedNumber}%`}</text>
            <text
                x={size}
                y={size + 22}
                textAnchor="middle"
                className="fst--upper-heading purple"
            >
                finished
            </text>
        </svg>
    );
};

export default CircularProgress;
