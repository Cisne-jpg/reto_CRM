'use client';

import React, { useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  Sector,
} from 'recharts';

export interface PieDataItem {
  name: string;
  value: number;
}

interface LabelProps {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
}

const COLORS = ['#0057B7', '#FF0000', '#00A86B', '#FFD700'];

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: LabelProps) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="black"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const renderActiveShape = (props: unknown): React.ReactElement => {
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    value,
    percent,
  } = props as {
    cx: number;
    cy: number;
    midAngle: number;
    innerRadius: number;
    outerRadius: number;
    startAngle: number;
    endAngle: number;
    fill: string;
    value: number;
    percent: number;
  };

  const RADIAN = Math.PI / 180;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 6}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} />
      <text
        x={ex + (cos >= 0 ? 12 : -12)}
        y={ey}
        textAnchor={textAnchor}
        fill="#333"
      >{`${value} tareas`}</text>
      <text
        x={ex + (cos >= 0 ? 12 : -12)}
        y={ey}
        dy={18}
        textAnchor={textAnchor}
        fill="#999"
      >
        {(percent * 100).toFixed(2)}%
      </text>
    </g>
  );
};

export function PieChartTareas({ pieData }: { pieData: PieDataItem[] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="bg-white p-6 rounded shadow mt-8 min-h-[400px] relative flex items-center justify-center">
      <h2 className="text-2xl font-semibold absolute top-8 text-center w-full">
        Resumen de tareas por estado
      </h2>

      {pieData.length > 0 ? (
        <div className="w-full h-[300px] mt-12">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                activeIndex={activeIndex}
                activeShape={renderActiveShape}
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label={renderCustomizedLabel}
                isAnimationActive
                animationDuration={1000}
                animationEasing="ease-out"
                onMouseEnter={(_, index) => setActiveIndex(index)}
              >
                {pieData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="mt-24 text-gray-500 text-lg">
          No hay tareas registradas todavía.
        </div>
      )}
    </div>
  );
}

export async function buildPieData(
  estados: string[],
  url: string
): Promise<PieDataItem[]> {
  const promises = estados.map(async (estado) => {
    try {
      const response = await fetch(`${url}/${estado}`);
      if (!response.ok) {
        throw new Error(`Error al obtener el estado ${estado}`);
      }
      const data = await response.json();
      return { name: estado, value: data || 0 };
    } catch (error) {
      console.error(`Error con el estado ${estado}:`, error);
      return { name: estado, value: 0 };
    }
  });

  return Promise.all(promises);
}
