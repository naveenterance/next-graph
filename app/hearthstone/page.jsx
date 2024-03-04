import Artists from "@/components/hearthstone/Artists";
import CardType from "@/components/hearthstone/Type";

const Hearthstone = async () => {
  const response = await fetch(
    "https://api.hearthstonejson.com/v1/194648/enUS/cards.collectible.json",
    { cache: "no-store" }
  );
  const data = await response.json();

  return (
    <>
      <p className="text-5xl font-bold mx-72 my-4 uppercase text-gray-300">
        Card Type distribution -donut chart
      </p>
      <div className="mx-56">
        {" "}
        <CardType data={data} />
      </div>
      <p className="text-5xl font-bold mx-72 my-4 uppercase text-gray-300">
        Artist contributions - Histogram
      </p>
      <Artists data={data} />
    </>
  );
};

export default Hearthstone;
