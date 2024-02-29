import Artists from "@/components/hearthstone/Artists";
import ArtistsDonutChart from "@/components/hearthstone/Type";

const Hearthstone = async () => {
  const response = await fetch(
    "https://api.hearthstonejson.com/v1/194648/enUS/cards.collectible.json",
    { cache: "no-store" }
  );
  const data = await response.json();

  return (
    <>
      <Artists data={data} />
      <ArtistsDonutChart data={data} />
    </>
  );
};

export default Hearthstone;
