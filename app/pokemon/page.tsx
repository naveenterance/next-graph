import Stats from "@/components/pokemon/Stats";
const Pokemon = async () => {
  const response = await fetch(
    "https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0",
    { cache: "no-store" }
  );
  const data = await response.json();

  return (
    <>
      <Stats data={data} />
    </>
  );
};

export default Pokemon;
