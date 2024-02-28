import Artists from "@/components/Artists";
import ArtistsDonutChart from "@/components/Type";

const Hearthstone = async () => {
  const response = await fetch(
    "https://api.hearthstonejson.com/v1/194648/enUS/cards.collectible.json"
  );
  const data = await response.json();

  return (
    <>
      <Artists data={data} />
      {/* <ArtistsDonutChart /> */}
    </>
  );
};

export default Hearthstone;
