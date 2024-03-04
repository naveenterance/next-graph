"use client";
import React, { useState, useEffect, FC } from "react";
import * as d3 from "d3";

interface PokemonDetailsProps {
  params: {
    pokemonName: string;
  };
}

const PokemonDetails: FC<PokemonDetailsProps> = ({ params }) => {
  const { pokemonName } = params;

  const [pokemonData, setPokemonData] = useState<any>(null);

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
    return <div className="loader lg:mx-auto my-56"></div>;
  }

  const data = pokemonData.stats.map((stat: any) => ({
    Stat: stat.stat.name,
    Value: stat.base_stat,
  }));

  const margin = { top: 100, right: 0, bottom: 0, left: 0 };
  const width = 800 - margin.left - margin.right;
  const height = 700 - margin.top - margin.bottom;
  const innerRadius = 150;
  const outerRadius = 200;

  const x = d3
    .scaleBand<string>()
    .range([0, 2 * Math.PI])
    .align(0)
    .domain(data.map((d) => d.Stat));
  const y = d3
    .scaleRadial<number, number>()
    .range([innerRadius, outerRadius])
    .domain([0, d3.max(data, (d) => d.Value)]);
  const colorScale = d3.scaleOrdinal<string>().range(d3.schemeCategory10);

  const imageWidth = 150;
  const imageHeight = 150;
  const imageUrl = `https://img.pokemondb.net/artwork/large/${pokemonName}.jpg`;

  return (
    <div className=" w-screen flex h-full">
      <div>
        <p className="text-5xl font-bold mx-72 my-4 uppercase text-gray-300">
          {pokemonName}
        </p>

        <svg width={width} height={height}>
          <g transform={`translate(${width / 2},${height / 2})`}>
            <image
              href={imageUrl}
              x={-imageWidth / 2}
              y={-imageHeight / 2}
              width={imageWidth}
              height={imageHeight}
            />

            {data.map((d, i) => (
              <g key={i}>
                <path
                  fill={colorScale(i)}
                  d={d3
                    .arc<any, any>()
                    .innerRadius(innerRadius)
                    .outerRadius(y(d.Value))
                    .startAngle(x(d.Stat))
                    .endAngle(x(d.Stat) + x.bandwidth())
                    .padAngle(0.01)
                    .padRadius(innerRadius)()}
                />
              </g>
            ))}

            {data.map((d, i) => (
              <g
                key={i}
                textAnchor={
                  (x(d.Stat) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) <
                  Math.PI
                    ? "end"
                    : "start"
                }
                transform={`rotate(${
                  ((x(d.Stat) + x.bandwidth() / 2) * 180) / Math.PI - 90
                })translate(${outerRadius + 10},0)`}
              >
                <text
                  transform={
                    (x(d.Stat) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) <
                    Math.PI
                      ? "rotate(180)"
                      : "rotate(0)"
                  }
                  fontSize="12px"
                  alignmentBaseline="middle"
                  className="font-bold"
                >
                  {d.Stat} [ {d.Value} ]
                </text>
              </g>
            ))}
          </g>
        </svg>
      </div>

      <div className="my-4 flex h-fit">
        <div className=" border-4 border-green-400 rounded-md">
          <div className="text-xl font-bold p-2">Stats</div>
          <ul className="font-semibold  ">
            {pokemonData.stats.map((stat: any, index: number) => (
              <li key={index} className="flex justify-between   p-4">
                <div className="mr-4 uppercase"> {stat.stat.name}</div>{" "}
                <div> {stat.base_stat}</div>
              </li>
            ))}
          </ul>
        </div>
        <div className="mx-4">
          <div className="border-4 border-blue-400 my-4 rounded-md">
            <div className="text-xl font-bold  p-2">Abilities:</div>
            <ul className="font-semibold  ">
              {pokemonData.abilities.map((ability: any, index: number) => (
                <li key={index} className="flex justify-between p-4">
                  {ability.ability.name}
                </li>
              ))}
            </ul>
          </div>
          <div className="border-4 border-red-400 rounded-md">
            <div className="text-xl font-bold p-2">Types:</div>
            <ul>
              {pokemonData.types.map((type: any, index: number) => (
                <li
                  key={index}
                  className="flex justify-between  p-4 font-semibold"
                >
                  {type.type.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PokemonDetails;
