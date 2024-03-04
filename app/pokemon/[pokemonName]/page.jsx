"use client";
import React, { useState, useEffect } from "react";

const PokemonDetails = ({ params }) => {
  const { pokemonName } = params;

  const [pokemonData, setPokemonData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${pokemonName}`
        );
        const data = await response.json();
        console.log("Fetched data:", data);
        setPokemonData(data);
      } catch (error) {
        console.error("Error fetching Pokemon data:", error);
      }
    };

    fetchData();
  }, [pokemonName]);

  if (!pokemonData) {
    return <div>Loading...</div>; // Display a loading message while data is being fetched
  }

  return (
    <div className="flex">
      <h1>{pokemonName}</h1>

      <img
        src={`https://img.pokemondb.net/artwork/large/${pokemonName}.jpg`}
        className="w-1/4 my-24"
      />

      <h2>Stats:</h2>
      {/* <ul>
        {pokemonData.stats.map((stat, index) => (
          <li key={index}>
            {stat.stat.name}: {stat.base_stat}
          </li>
        ))}
      </ul> */}
      // Data for the circular bar plot
const data = pokemonData.stats.map(stat => ({
  Country: stat.stat.name,
  Value: stat.base_stat
}));

// Scales
const x = d3.scaleBand()
  .range([0, 2 * Math.PI])
  .align(0)
  .domain(data.map(d => d.Country));
const y = d3.scaleRadial()
  .range([innerRadius, outerRadius])
  .domain([0, d3.max(data, d => d.Value)]);

// Add the bars
svg.selectAll("path")
  .data(data)
  .enter()
  .append("path")
  .attr("fill", "#69b3a2")
  .attr("d", d3.arc()
    .innerRadius(innerRadius)
    .outerRadius(d => y(d.Value))
    .startAngle(d => x(d.Country))
    .endAngle(d => x(d.Country) + x.bandwidth())
    .padAngle(0.01)
    .padRadius(innerRadius));

// Add the labels
svg.selectAll("text")
  .data(data)
  .enter()
  .append("text")
  .attr("text-anchor", d => (x(d.Country) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "end" : "start")
  .attr("transform", d => `rotate(${(x(d.Country) + x.bandwidth() / 2) * 180 / Math.PI - 90})translate(${y(d.Value) + 10},0)`)
  .text(d => d.Country)
  .attr("transform", d => (x(d.Country) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "rotate(180)" : "rotate(0)")
  .style("font-size", "11px")
  .attr("alignment-baseline", "middle");

    </div>
  );
};

export default PokemonDetails;
