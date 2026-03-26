import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts';

interface MacroProgressRingProps {
  label: string;
  consumed: number;
  goal: number;
  unit: string;
}

export function MacroProgressRing({ label, consumed, goal, unit }: MacroProgressRingProps) {
  const percentage = goal > 0 ? Math.min((consumed / goal) * 100, 100) : 0;

  const getColor = () => {
    if (consumed > goal) return '#EF4444';
    if (consumed >= goal * 0.9) return '#F59E0B';
    return '#14B8A6';
  };

  const data = [
    {
      name: label,
      value: percentage,
      fill: getColor(),
    },
  ];

  return (
    <div className="bg-white rounded-3xl p-6 flex flex-col items-center shadow-sm">
      <div className="relative w-full aspect-square">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="70%"
            outerRadius="100%"
            data={data}
            startAngle={90}
            endAngle={-270}
          >
            <RadialBar
              background={{ fill: '#E5E7EB' }}
              dataKey="value"
              cornerRadius={12}
              animationDuration={800}
            />
          </RadialBarChart>
        </ResponsiveContainer>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-4xl font-bold text-gray-900">
            {Math.round(consumed)}
          </div>
          <div className="text-sm text-gray-500 mt-1">
            / {Math.round(goal)}{unit}
          </div>
        </div>
      </div>

      <div className="mt-4 text-center">
        <p className="text-base font-semibold text-gray-700">{label}</p>
      </div>
    </div>
  );
}
