"use client";
import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3"; // Import D3 library

const ArtistsHistogram = ({ data }) => {
  const svgRef = useRef();
  const [isLoading, setIsLoading] = useState(true); // Reference to SVG element

  useEffect(() => {
    const fetchArtistData = () => {
      try {
        // Fetch data from the endpoint

        // Create an object to store artist name and count
        const artistCount = {};

        // Count the number of cards for each artist
        data.forEach((card) => {
          artistCount[card.artist] = (artistCount[card.artist] || 0) + 1;
        });

        // Convert artistCount object to array of {name, count} pairs
        let artistsData = Object.entries(artistCount).map(([name, count]) => ({
          name,
          count,
        }));

        // Sort the artistsData array by count in ascending order
        artistsData.sort((a, b) => b.count - a.count);

        // Set up D3 code to create histogram
        const margin = { top: 20, right: 30, bottom: 250, left: 80 }; // Increase bottom margin
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

        // Define x scale and axis
        const x = d3
          .scaleBand()
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
          .attr("dx", "-0.8em") // Adjust padding
          .attr("dy", "0.15em")
          .style("font-size", "12px");

        // Define y scale and axis
        const y = d3
          .scaleLinear()
          .domain([0, d3.max(artistsData, (d) => d.count)])
          .nice()
          .range([height, 0]);

        svg.append("g").call(d3.axisLeft(y));

        // Draw bars
        svg
          .selectAll("rect")
          .data(artistsData)
          .enter()
          .append("rect")
          .attr("x", (d) => x(d.name))
          .attr("width", x.bandwidth())
          .attr("y", (d) => y(d.count))
          .attr("height", (d) => height - y(d.count))
          .attr("fill", "hsl(180, 100%, 25.1%)")
          .on("mouseover", function (event, d) {
            // Show tooltip on mouseover
            d3.select("#tooltip")
              .style("display", "block")
              .html(
                `<strong>Artist:</strong> ${d.name}<br/><strong>Count:</strong> ${d.count}`
              )
              .style("left", event.pageX + 10 + "px")
              .style("top", event.pageY - 15 + "px");
          })
          .on("mouseout", function () {
            // Hide tooltip on mouseout
            d3.select("#tooltip").style("display", "none");
          });
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchArtistData();
  }, [data]); // Run once on mount

  return (
    <div className="h-screen p-2 relative">
      {isLoading && <div class="loader lg:mx-auto my-56"></div>}
      <svg ref={svgRef}></svg>
      <div
        id="tooltip"
        className="absolute bg-white border rounded p-2"
        style={{ display: "none" }}
      ></div>
    </div>
  ); // SVG element with ref
};

export default ArtistsHistogram;
