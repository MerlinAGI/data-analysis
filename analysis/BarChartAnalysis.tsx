import React from 'react';
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { ClusterData } from './Cluster';

const formatXAxis = (tickItem: any) => {
  return `${tickItem}%`;
};
const CustomTooltip = ({
  active,
  payload,
  label
}: {
  active?: boolean;
  payload?: any[];
  label?: string;
}) => {
  if (active && payload && payload.length) {
    const value = payload[0].value;
    // const percentage =
    //   (value * 100) / data.reduce((total, item) => total + item.uv, 0);
    return (
      <div className="custom-tooltip text-[14px] bg-white p-4 rounded shadow">
        <p className="label">{label}</p>
        <p className="value">{`is mentioned ${value}% of the time`}</p>
      </div>
    );
  }
  return null;
};

export const BarChartAnalysis = ({
  data,
  resp_cnt
}: {
  data: ClusterData[];
  resp_cnt: number;
}) => {
  const plotData = data.map((cluster) => ({
    name: cluster.theme,
    responses: cluster.response_ids.length,
    percentage: Math.round((cluster.response_ids.length / resp_cnt) * 100)
  }));

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          layout="vertical"
          width={500}
          height={300}
          data={plotData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5
          }}
        >
          {/* <CartesianGrid horizontal={false} /> */}

          <XAxis
            interval={1}
            tickLine={false}
            axisLine={false}
            tickFormatter={formatXAxis}
            type="number"
            tick={{ fill: '#000000', fontSize: '14px' }}
          />
          <YAxis
            type="category"
            tickLine={false}
            tick={{ fill: '#000000', fontSize: '14px' }}
            width={200}
            axisLine={false}
            dataKey="name"
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="percentage"
            fill="#82ca9d"
            barSize={60}
            radius={[0, 6, 6, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
