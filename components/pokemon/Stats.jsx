"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link"; // Import Link for navigation
import Router from "next/router"; // Import Router for programmatic navigation

const Stats = ({ data }) => {
  const [info, setInfo] = useState();

  return (
    <div>
      <h1>Pokemon Names</h1>
      <ul>
        {data.results.map((pokemon, index) => (
          <li key={index}>
            <Link
              href={{
                pathname: `/pokemon/${encodeURIComponent(pokemon.name)}`,
              }}
              onClick={() => setInfo(pokemon.url)} // Set info for potential server-side usage
            >
              {pokemon.name}
            </Link>
          </li>
        ))}
      </ul>

      {info && (
        <button onClick={() => Router.push(`/${encodeURIComponent(info)}`)}>
          Go to Selected Pokemon
        </button>
      )}
    </div>
  );
};

export default Stats;
