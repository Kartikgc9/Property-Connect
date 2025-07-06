import React from 'react';

type Metric = {
  label: string;
  value: number | string;
};

interface Props {
  metrics: Metric[];
}

export const AgentMetrics: React.FC<Props> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {metrics.map((m) => (
        <div key={m.label} className="bg-white rounded-lg p-4 shadow text-center">
          <div className="text-2xl font-bold text-blue-600">{m.value}</div>
          <div className="text-sm text-gray-600 mt-1">{m.label}</div>
        </div>
      ))}
    </div>
  );
};

export default AgentMetrics;