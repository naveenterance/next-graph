"use client";
import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

const DonutChart = ({ data }) => {
  const svgRef = useRef();

  useEffect(() => {
    const width = 1000,
      height = 450,
      margin = 40;
    const radius = Math.min(width, height) / 2 - margin;

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    const color = d3
      .scaleOrdinal()
      .domain(data.map((d) => d.type))
      .range(d3.schemeDark2);

    const pie = d3
      .pie()
      .sort(null)
      .value((d) => d.count);
    const data_ready = pie(data);

    const arc = d3
      .arc()
      .innerRadius(radius * 0.5)
      .outerRadius(radius * 0.8);

    const outerArc = d3
      .arc()
      .innerRadius(radius * 0.9)
      .outerRadius(radius * 0.9);

    svg
      .selectAll("allSlices")
      .data(data_ready)
      .join("path")
      .attr("d", arc)
      .attr("fill", (d) => color(d.data.type))
      .attr("stroke", "white")
      .style("stroke-width", "2px")
      .style("opacity", 0.7);

    svg
      .selectAll("allPolylines")
      .data(data_ready)
      .join("polyline")
      .attr("stroke", "black")
      .style("fill", "none")
      .attr("stroke-width", 1)
      .attr("points", (d) => {
        const posA = arc.centroid(d);
        const posB = outerArc.centroid(d);
        const posC = outerArc.centroid(d);
        const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
        posC[0] = radius * 0.95 * (midangle < Math.PI ? 1 : -1);
        return [posA, posB, posC];
      });

    svg
      .selectAll("allLabels")
      .data(data_ready)
      .join("text")
      .text(
        (d) =>
          `${d.data.type} (${d3.format(".1%")(
            d.data.count / d3.sum(data, (d) => d.count)
          )})`
      )
      .attr("transform", (d) => {
        const pos = outerArc.centroid(d);
        const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
        pos[0] = radius * 0.99 * (midangle < Math.PI ? 1 : -1);
        return `translate(${pos})`;
      })
      .style("text-anchor", (d) => {
        const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
        return midangle < Math.PI ? "start" : "end";
      });
  }, [data]);

  return <svg ref={svgRef}></svg>;
};

const PokemonTypesCount = () => {
  const [pokemonTypesCount, setPokemonTypesCount] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0"
        );
        const data = await response.json();
        const pokemons = data.results;

        // Count the number of each type of Pokémon
        const typesCount = {};
        for (const pokemon of pokemons) {
          const pokemonResponse = await fetch(pokemon.url);
          const pokemonData = await pokemonResponse.json();
          const types = pokemonData.types.map((typeData) => typeData.type.name);
          types.forEach((type) => {
            typesCount[type] = (typesCount[type] || 0) + 1;
          });
        }
        setPokemonTypesCount(typesCount);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const data = Object.entries(pokemonTypesCount).map(([type, count]) => ({
    type,
    count,
  }));

  return (
    <div className="w-screen h-screen p-8">
      <h2>Pokémon Types Count:</h2>
      <DonutChart data={data} />
    </div>
  );
};

export default PokemonTypesCount;
