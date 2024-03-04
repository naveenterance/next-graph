"use client";
import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

interface Card {
  artist: string;
}

interface ArtistData {
  name: string;
  count: number;
}

interface ArtistsHistogramProps {
  data: Card[];
}

const ArtistsHistogram: React.FC<ArtistsHistogramProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchArtistData = () => {
      try {
        const artistCount: { [key: string]: number } = {};

        data.forEach((card) => {
          artistCount[card.artist] = (artistCount[card.artist] || 0) + 1;
        });

        let artistsData: ArtistData[] = Object.entries(artistCount).map(
          ([name, count]) => ({
            name,
            count,
          })
        );

        artistsData.sort((a, b) => b.count - a.count);

        const margin = { top: 20, right: 30, bottom: 250, left: 80 };
        const width = 10000 - margin.left - margin.right;
        const height = 800 - margin.top - margin.bottom;

        const svg = d3
          .select(svgRef.current)
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .append("g")
          .attr(
            "transform",
            "translate(" + margin.left + "," + margin.top + ")"
          );

        const x = d3
          .scaleBand<string>()
          .domain(artistsData.map((d) => d.name))
          .range([0, width])
          .padding(0.2);

        svg
          .append("g")
          .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(x))
          .selectAll("text")
          .attr("transform", "rotate(-45)")
          .style("text-anchor", "end")
          .attr("dx", "-0.8em")
          .attr("dy", "0.15em")
          .style("font-size", "12px");

        const y = d3
          .scaleLinear<number>()
          .domain([0, d3.max(artistsData, (d) => d.count) || 0])
          .nice()
          .range([height, 0]);

        svg.append("g").call(d3.axisLeft(y));

        svg
          .selectAll("rect")
          .data(artistsData)
          .enter()
          .append("rect")
          .attr("x", (d) => x(d.name) || 0)
          .attr("width", x.bandwidth())
          .attr("y", (d) => y(d.count))
          .attr("height", (d) => height - y(d.count))
          .attr("fill", "hsl(180, 100%, 25.1%)")
          .on("mouseover", function (event, d) {
            d3.select("#tooltip")
              .style("display", "block")
              .html(
                `<strong>Artist:</strong> ${d.name}<br/><strong>Count:</strong> ${d.count}`
              )
              .style("left", event.pageX + 10 + "px")
              .style("top", event.pageY - 15 + "px");
          })
          .on("mouseout", function () {
            d3.select("#tooltip").style("display", "none");
          });
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchArtistData();
  }, [data]);

  return (
    <div className="h-screen p-2 relative">
      {isLoading && <div className="loader lg:mx-auto my-56"></div>}
      <svg ref={svgRef}></svg>
      <div
        id="tooltip"
        className="absolute bg-white border rounded p-2"
        style={{ display: "none" }}
      ></div>
    </div>
  );
};

export default ArtistsHistogram;
