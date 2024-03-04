"use client";
import React, { useState, useEffect, ChangeEvent } from "react";
import Link from "next/link";

interface Pokemon {
  name: string;
}

interface StatsProps {
  data: {
    results: Pokemon[];
  };
}

const Stats: React.FC<StatsProps> = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredData, setFilteredData] = useState<Pokemon[]>(data.results);

  useEffect(() => {
    const filtered = data.results.filter((pokemon) =>
      pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(filtered);
  }, [searchTerm, data.results]);

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className="w-screen">
      <div className="mx-12 my-6 w-1/2 flex ">
        <input
          className="border-4 focus:border-green-400 hover:border-green-400 outline-none p-2 transition ease-in-out delay-150 hover:-translate-y-1"
          placeholder="Search Pokemon"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <Link
          href={`/pokemon/types`}
          className="border-4 hover:border-green-400 h-full  p-4 mx-12 hover:text-green-300 transition ease-in-out delay-150 hover:-translate-y-1"
        >
          Pokemon Types Graph
        </Link>
      </div>
      <ul className="grid grid-cols-4 mx-12 ">
        {filteredData.map((pokemon, index) => (
          <li key={index}>
            <Link
              href={{
                pathname: `/pokemon/${encodeURIComponent(pokemon.name)}`,
              }}
              className="flex justify-around  border-4 hover:border-green-400 h-full  p-4 transition ease-in-out delay-150 hover:-translate-y-1"
            >
              <p className="my-auto mx-1"> {pokemon.name}</p>
              <img
                src={`https://img.pokemondb.net/artwork/large/${pokemon.name}.jpg`}
                alt="[no sprite available]"
                className="w-12 h-12"
              />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Stats;
