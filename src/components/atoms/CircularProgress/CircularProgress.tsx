import "./CircularProgress.scss";

type CircularProgressProps = {
    progress: number;
};

const CircularProgress = ({ progress }: CircularProgressProps) => {
    const size = 80;
    const radius = size - 10;

    const startAngle = -200;
    const maxRadius = 60;

    const calculatedProgress = () => {
        if (progress > 100) {
            progress = 100;
        }

        if (progress < 0) {
            return 0;
        }
        return maxRadius * (progress / 100);
    };

    const dashArray = 2 * Math.PI * radius;
    const dashOffset = dashArray - (dashArray * calculatedProgress()) / 100;

    return (
        <svg width={size * 2} height={size * 1.5}>
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
            >{`${progress}%`}</text>
            <text
                x={size}
                y={size + 20}
                textAnchor="middle"
                className="fst--upper-heading purple"
            >
                finshed
            </text>
        </svg>
    );
};

export default CircularProgress;
