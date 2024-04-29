"use client";
import React, { useEffect, useRef } from "react";
import Chart, { ChartConfiguration, ChartData } from "chart.js/auto";

interface BarChartProps {
  chartData: ChartData<"bar", number[]>;
  chartOptions?: ChartConfiguration<"bar">["options"];
}

const BarChart: React.FC<BarChartProps> = ({ chartData, chartOptions }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart<"bar", number[], unknown> | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      chartInstanceRef.current = new Chart<"bar", number[], unknown>(
        chartRef.current,
        {
          type: "bar",
          data: chartData,
          options: chartOptions,
        }
      );
    }
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [chartData, chartOptions]);

  return <canvas ref={chartRef} />;
};

export default BarChart;
