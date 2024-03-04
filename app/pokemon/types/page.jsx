import PokemonTypesCount from "@/components/pokemon/Type";
const PokemonTypes = () => {
  return (
    <>
      <p className="text-5xl font-bold mx-72 my-4 uppercase text-gray-300">
        Pokemon Type distribution - Donut graph
      </p>{" "}
      <PokemonTypesCount />
    </>
  );
};

export default PokemonTypes;
