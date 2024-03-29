"use client";
import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3"; // Import D3 library

interface Card {
  type: string;
}

interface CardTypeProps {
  data: Card[];
}

const CardType: React.FC<CardTypeProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true); // State variable for loading

  useEffect(() => {
    const fetchDataAndDrawChart = () => {
      // Group data by type and calculate count
      const typeCounts: { [key: string]: number } = data.reduce(
        (acc: { [key: string]: number }, card: Card) => {
          acc[card.type] = (acc[card.type] || 0) + 1;
          return acc;
        },
        {}
      );

      // Convert grouped data to D3-compatible format
      const pieData = Object.entries(typeCounts).map(([type, count]) => ({
        type,
        count,
      }));

      // Set dimensions and margins
      const width: number = 800;
      const height: number = 450;
      const margin: number = 40;
      const radius: number = Math.min(width, height) / 2 - margin;

      // Create and append SVG element to the component's div
      const svg = d3
        .select(svgRef.current)
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width / 2}, ${height / 2})`);

      // Set color scale
      const color = d3
        .scaleOrdinal<string>()
        .domain(pieData.map((d) => d.type))
        .range(d3.schemeDark2);

      // Compute pie angles
      const pie = d3
        .pie<{ type: string; count: number }>()
        .sort(null) // Disable sorting to maintain data order
        .value((d) => d.count);
      const data_ready = pie(pieData);

      // Define arc generator
      const arc = d3
        .arc<d3.PieArcDatum<{ type: string; count: number }>>()
        .innerRadius(radius * 0.5)
        .outerRadius(radius * 0.8);

      // Draw slices
      svg
        .selectAll("allSlices")
        .data(data_ready)
        .enter()
        .append("path")
        .attr("d", arc)
        .attr("fill", (d) => color(d.data.type))
        .attr("stroke", "white")
        .style("stroke-width", "2px")
        .style("opacity", 0.7);

      // Add labels outside the chart with gaps and percentages
      const outerArc = d3
        .arc<d3.PieArcDatum<{ type: string; count: number }>>()
        .outerRadius(radius * 0.9)
        .innerRadius(radius * 0.9);

      svg
        .selectAll("allLabels")
        .data(data_ready)
        .enter()
        .append("text")
        .text(
          (d) =>
            `${d.data.type} (${(
              ((d.endAngle - d.startAngle) / (2 * Math.PI)) *
              100
            ).toFixed(2)}%)`
        ) // Extract text from data directly
        .attr("transform", (d) => {
          const pos = outerArc.centroid(d);
          const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
          pos[0] = radius * 0.99 * (midangle < Math.PI ? 1 : -1);
          // Add gaps between labels
          const gap = 10; // Adjust gap size as needed
          pos[1] += (data_ready.indexOf(d) % 2 === 0 ? 1 : -1) * gap;
          return `translate(${pos[0]}, ${pos[1]})`; // Combine position components
        })
        .style("text-anchor", (d) => {
          const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
          return midangle < Math.PI ? "start" : "end";
        });

      // Add polyline connectors
      svg
        .selectAll("allPolylines")
        .data(data_ready)
        .enter()
        .append("polyline")
        .attr("stroke", "black")
        .style("fill", "none")
        .attr("stroke-width", 1)
        .attr("points", function (d) {
          const posA = arc.centroid(d); // line insertion in the slice
          const posB = outerArc.centroid(d); // line break: we use the other arc generator that has been built only for that
          const posC = outerArc.centroid(d); // Label position = almost the same as posB
          const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2; // we need the angle to see if the X position will be at the extreme right or extreme left
          posC[0] = radius * 0.95 * (midangle < Math.PI ? 1 : -1); // multiply by 1 or -1 to put it on the right or on the left
          return [posA, posB, posC];
        });

      // Set loading state to false after drawing chart
      setIsLoading(false);
    };

    fetchDataAndDrawChart();
  }, [data]);

  return (
    <>
      {isLoading && <div className="loader lg:mx-auto my-56"></div>}
      <svg ref={svgRef}></svg>
    </>
  );
};

export default CardType;
