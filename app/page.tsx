import Link from "next/link";
import PokemonTypesCount from "@/components/pokemon/Type";
const Home = () => {
  return (
    <>
      <Link href={`/hearthstone`}>Hearthstone</Link>
      <PokemonTypesCount />
    </>
  );
};

export default Home;
