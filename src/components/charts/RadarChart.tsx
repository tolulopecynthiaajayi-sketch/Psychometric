import React from 'react';

interface RadarChartProps {
    data: { label: string; value: number; fullMark: number }[];
    size?: number;
}

export function RadarChart({ data, size = 300 }: RadarChartProps) {
    const center = size / 2;
    const radius = (size / 2) - 40; // Padding
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
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
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
                const coords = getCoordinates(6, i, 5); // Push label out a bit
                return (
                    <text
                        key={i}
                        x={coords.x}
                        y={coords.y}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fontSize="10"
                        fill="var(--color-dark-blue)"
                        style={{ fontWeight: 'bold' }}
                    >
                        {d.label.split(' ')[0]} {/* Shorten label for chart */}
                    </text>
                );
            })}
        </svg>
    );
}
