import { useState } from "react";
import { DonutChart } from "@/components/ui/donut-chart";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface MacroDonutChartProps {
  consumed: {
    protein: number;
    carbs: number;
    fat: number;
    calories: number;
  };
  goals: {
    protein: number;
    carbs: number;
    fat: number;
    calories: number;
  };
}

export function MacroDonutChart({ consumed, goals }: MacroDonutChartProps) {
  const [hoveredSegment, setHoveredSegment] = useState<string | null>(null);

  const macroData = [
    {
      value: consumed.protein,
      color: "#10B981", // Vitality Emerald
      label: "Protein",
      goal: goals.protein,
      unit: "g",
    },
    {
      value: consumed.carbs,
      color: "#A3E635", // Vitality Lime
      label: "Carbs",
      goal: goals.carbs,
      unit: "g",
    },
    {
      value: consumed.fat,
      color: "#FBBF24", // Vitality Amber
      label: "Fat",
      goal: goals.fat,
      unit: "g",
    },
  ];

  const activeSegment = macroData.find(
    (segment) => segment.label === hoveredSegment
  );

  const displayValue = activeSegment?.value ?? consumed.calories;
  const displayGoal = activeSegment?.goal ?? goals.calories;
  const displayLabel = activeSegment?.label ?? "Calories";
  const displayUnit = activeSegment?.unit ?? "";
  const displayPercentage = displayGoal > 0 ? (displayValue / displayGoal) * 100 : 0;

  return (
    <div className="w-full">
      <div className="relative flex items-center justify-center mb-8">
        <DonutChart
          data={macroData}
          size={240}
          strokeWidth={28}
          animationDuration={1.5}
          animationDelayPerSegment={0.1}
          highlightOnHover={true}
          onSegmentHover={(segment) => setHoveredSegment(segment?.label ?? null)}
          centerContent={
            <AnimatePresence mode="wait">
              <motion.div
                key={displayLabel}
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -10 }}
                transition={{ duration: 0.3, ease: "backOut" }}
                className="flex flex-col items-center justify-center text-center"
              >
                <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-1">
                  {displayLabel}
                </p>
                <div className="flex items-baseline justify-center">
                  <p className="text-4xl md:text-5xl font-black text-vitality-slate tracking-tighter">
                    {Math.round(displayValue)}
                  </p>
                  <span className="text-sm font-bold text-slate-400 ml-1 uppercase">{displayUnit || 'kcal'}</span>
                </div>
                <div className="mt-2 px-3 py-1 bg-vitality-lime/10 rounded-full border border-vitality-emerald/20">
                   <p className="text-xs font-bold text-vitality-emerald">
                      {Math.min(displayPercentage, 100).toFixed(0)}% OF GOAL
                   </p>
                </div>
              </motion.div>
            </AnimatePresence>
          }
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-slate-100">
        {macroData.map((segment, index) => {
          const percentage = segment.goal > 0 ? (segment.value / segment.goal) * 100 : 0;
          const isOver = percentage > 100;

          return (
            <motion.div
              key={segment.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 + index * 0.1, duration: 0.5 }}
              className={cn(
                "flex flex-col p-4 rounded-2xl transition-all duration-300 border border-transparent",
                hoveredSegment === segment.label ? "bg-white shadow-sm border-slate-100 scale-105" : "bg-slate-50/50"
              )}
              onMouseEnter={() => setHoveredSegment(segment.label)}
              onMouseLeave={() => setHoveredSegment(null)}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: segment.color }}
                  ></div>
                  <span className="text-xs font-black text-slate-400 uppercase tracking-tighter">
                    {segment.label}
                  </span>
                </div>
                <span className={cn(
                  "text-[10px] font-bold px-2 py-0.5 rounded-full",
                  isOver ? "bg-red-100 text-red-600" : "bg-vitality-lime/20 text-vitality-emerald"
                )}>
                  {Math.round(percentage)}%
                </span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-black text-vitality-slate">
                  {Math.round(segment.value)}
                </span>
                <span className="text-xs font-bold text-slate-400">/ {Math.round(segment.goal)}g</span>
              </div>
              <div className="w-full h-1 bg-slate-200 rounded-full mt-3 overflow-hidden">
                 <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(percentage, 100)}%` }}
                    transition={{ delay: 1.5 + index * 0.1, duration: 1 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: segment.color }}
                 />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
