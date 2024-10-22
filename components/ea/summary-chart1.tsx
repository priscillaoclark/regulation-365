import { useEffect, useRef } from "react";
import * as d3 from "d3";

interface BarChartProps {
  data: { yearMonth: string; count: number }[];
}

const BarChart: React.FC<BarChartProps> = ({ data }) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!data || data.length === 0) return;

    const margin = { top: 20, right: 20, bottom: 60, left: 40 };
    const width = chartRef.current
      ? chartRef.current.clientWidth - margin.left - margin.right
      : 700 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Check if dark mode is enabled by checking the class on the body
    const isDarkMode = document.documentElement.classList.contains("dark");

    // Clear any existing content before rendering the chart
    const svg = d3
      .select(chartRef.current)
      .html("")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // X-axis setup (year-month labels)
    const x = d3
      .scaleBand()
      .domain(data.map((d) => d.yearMonth))
      .range([0, width])
      .padding(0.1);

    // Y-axis setup (count values)
    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.count)!])
      .range([height, 0]);

    // Add the X-axis to the chart
    svg
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).tickFormat((d) => d));

    // Add the Y-axis to the chart
    svg.append("g").attr("class", "y-axis").call(d3.axisLeft(y));

    // Add the bars to the chart
    svg
      .selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => x(d.yearMonth)!)
      .attr("y", (d) => y(d.count))
      .attr("width", x.bandwidth())
      .attr("height", (d) => height - y(d.count))
      .attr("fill", "#A3E635");

    // Add number labels on top of each bar
    svg
      .selectAll(".label")
      .data(data)
      .enter()
      .append("text")
      .attr("class", "label")
      .attr("x", (d) => x(d.yearMonth)! + x.bandwidth() / 2)
      .attr("y", (d) => y(d.count) - 5) // Position label just above the bar
      .attr("text-anchor", "middle")
      .text((d) => d.count)
      .style("fill", "#84CC16");

    // Rotate X-axis labels for better readability
    svg
      .selectAll(".x-axis text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end");
  }, [data]);

  return <div ref={chartRef}></div>;
};

export default BarChart;
