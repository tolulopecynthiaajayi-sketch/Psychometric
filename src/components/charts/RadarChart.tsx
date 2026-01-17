import React from 'react';

interface RadarChartProps {
    data: { label: string; value: number; fullMark: number }[];
    size?: number;
}

export function RadarChart({ data, size = 300 }: RadarChartProps) {
    const center = size / 2;
    const radius = (size / 2) - 105; // Increased Padding for labels (Safe Zone)
    const angleSlice = (Math.PI * 2) / data.length;

    // Helper to get coordinates
    const getCoordinates = (value: number, index: number, max: number) => {
        const angle = index * angleSlice - Math.PI / 2; // Start at top
        const r = (value / max) * radius;
        return {
            x: center + r * Math.cos(angle),
            y: center + r * Math.sin(angle),
        };
    };

    // Generate polygon points
    const points = data.map((d, i) => {
        const coords = getCoordinates(d.value, i, d.fullMark);
        return `${coords.x},${coords.y}`;
    }).join(' ');

    // Generate grid lines (concentric pentagons/hexagons)
    const gridLevels = [1, 2, 3, 4, 5];

    return (
        <svg width={size} height={size} viewBox={`-30 0 ${size + 60} ${size}`}>
            {/* Grid Lines */}
            {gridLevels.map((level) => (
                <React.Fragment key={level}>
                    <polygon
                        points={data.map((_, i) => {
                            const coords = getCoordinates(level, i, 5);
                            return `${coords.x},${coords.y}`;
                        }).join(' ')}
                        fill="none"
                        stroke="var(--color-gray-200)"
                        strokeWidth="1"
                    />
                    {/* Axis Lines */}
                    {level === 5 && data.map((_, i) => {
                        const coords = getCoordinates(5, i, 5);
                        return (
                            <line
                                key={i}
                                x1={center}
                                y1={center}
                                x2={coords.x}
                                y2={coords.y}
                                stroke="var(--color-gray-200)"
                                strokeWidth="1"
                            />
                        );
                    })}
                </React.Fragment>
            ))}

            {/* Data Polygon */}
            <polygon
                points={points}
                fill="rgba(212, 175, 55, 0.4)" // Gold with opacity
                stroke="var(--color-gold)"
                strokeWidth="2"
            />

            {/* Labels */}
            {data.map((d, i) => {
                const angle = i * angleSlice - Math.PI / 2;
                // Calculate position relative to center (normalized -1 to 1)
                const cos = Math.cos(angle);
                const sin = Math.sin(angle);

                // Dynamic Anchoring based on horizontal position
                let textAnchor: "middle" | "start" | "end" = "middle";
                let xOffset = 0;

                // Tolerance for "center" alignment (approx Top/Bottom)
                if (Math.abs(cos) < 0.1) {
                    textAnchor = "middle";
                } else if (cos > 0) {
                    textAnchor = "start";
                    xOffset = 5; // Slight push right
                } else {
                    textAnchor = "end";
                    xOffset = -5; // Slight push left
                }

                // Push labels out - REDUCED from 6.2 to 5.8 to keep closer to chart and avoid edge clipping
                const coords = getCoordinates(5.8, i, 5);

                const words = d.label.split(' ');
                const lines = [];
                // Simple wrapping logic: 2 words per line max
                for (let j = 0; j < words.length; j += 2) {
                    lines.push(words.slice(j, j + 2).join(' '));
                }

                return (
                    <text
                        key={i}
                        x={coords.x + xOffset}
                        y={coords.y - ((lines.length - 1) * 6)}
                        textAnchor={textAnchor}
                        dominantBaseline="middle"
                        fontSize="8.5"
                        fill="var(--color-dark-blue)"
                        style={{ fontWeight: 'bold' }}
                    >
                        {lines.map((line, lineIdx) => (
                            <tspan x={coords.x + xOffset} dy={lineIdx === 0 ? 0 : "1.2em"} key={lineIdx}>
                                {line}
                            </tspan>
                        ))}
                    </text>
                );
            })}
        </svg>
    );
}
