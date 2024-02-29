"use client";
import React, { useEffect, useState } from "react";

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

  return (
    <div>
      <h2>Pokémon Types Count:</h2>
      <ul>
        {Object.entries(pokemonTypesCount).map(([type, count]) => (
          <li key={type}>
            {type}: {count}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PokemonTypesCount;
