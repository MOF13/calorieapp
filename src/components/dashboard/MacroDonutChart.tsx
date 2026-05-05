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
      color: "hsl(142.1 76.2% 36.3%)",
      label: "Protein",
      goal: goals.protein,
      unit: "g",
    },
    {
      value: consumed.carbs,
      color: "hsl(47.9 95.8% 53.1%)",
      label: "Carbs",
      goal: goals.carbs,
      unit: "g",
    },
    {
      value: consumed.fat,
      color: "hsl(24.6 95% 53.1%)",
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
    <Card className="p-4 sm:p-6 w-full bg-white border-gray-200 shadow-sm">
      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6 text-center">
        Daily Macro Breakdown
      </h3>
      <div className="relative flex items-center justify-center mb-4 sm:mb-6">
        <DonutChart
          data={macroData}
          size={200}
          strokeWidth={24}
          animationDuration={1.2}
          animationDelayPerSegment={0.08}
          highlightOnHover={true}
          onSegmentHover={(segment) => setHoveredSegment(segment?.label ?? null)}
          centerContent={
            <AnimatePresence mode="wait">
              <motion.div
                key={displayLabel}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2, ease: "circOut" }}
                className="flex flex-col items-center justify-center text-center"
              >
                <p className="text-gray-500 text-xs sm:text-sm font-medium mb-1">
                  {displayLabel}
                </p>
                <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
                  {Math.round(displayValue)}
                  <span className="text-sm sm:text-base md:text-lg text-gray-500 ml-1">{displayUnit}</span>
                </p>
                <p className="text-xs sm:text-sm text-gray-400 mt-1">
                  of {Math.round(displayGoal)}{displayUnit}
                </p>
                <p className="text-sm sm:text-base font-semibold text-teal-600 mt-1">
                  {Math.min(displayPercentage, 100).toFixed(0)}%
                </p>
              </motion.div>
            </AnimatePresence>
          }
        />
      </div>

      <div className="flex flex-col space-y-1.5 sm:space-y-2 pt-3 sm:pt-4 border-t border-gray-200">
        {macroData.map((segment, index) => {
          const percentage = segment.goal > 0 ? (segment.value / segment.goal) * 100 : 0;
          const isOver = percentage > 100;

          return (
            <motion.div
              key={segment.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2 + index * 0.1, duration: 0.4 }}
              className={cn(
                "flex items-center justify-between p-2 sm:p-3 rounded-lg transition-all duration-200 cursor-pointer",
                hoveredSegment === segment.label && "bg-gray-50"
              )}
              onMouseEnter={() => setHoveredSegment(segment.label)}
              onMouseLeave={() => setHoveredSegment(null)}
            >
              <div className="flex items-center space-x-2 sm:space-x-3">
                <span
                  className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: segment.color }}
                ></span>
                <span className="text-xs sm:text-sm font-medium text-gray-900">
                  {segment.label}
                </span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-xs sm:text-sm font-semibold text-gray-600">
                  {Math.round(segment.value)}/{Math.round(segment.goal)}{segment.unit}
                </span>
                <span
                  className={cn(
                    "text-xs font-medium px-2 py-0.5 rounded",
                    isOver
                      ? "bg-red-100 text-red-700"
                      : percentage >= 80
                      ? "bg-teal-100 text-teal-700"
                      : "bg-gray-100 text-gray-600"
                  )}
                >
                  {Math.min(percentage, 100).toFixed(0)}%
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
