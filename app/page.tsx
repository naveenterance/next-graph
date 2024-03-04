import Link from "next/link";

const Home = () => {
  return (
    <div className="flex h-screen p-8 ">
      <Link href={`/pokemon`} className=" p-8  w-fit ">
        <img
          className=" w-1/5  mb-16 mx-auto "
          src="https://i.pinimg.com/originals/37/17/24/3717242635eb3336ec720d5454b647c8.png"
        />
        <p className="text-5xl font-bold  my-4 uppercase text-gray-300 mx-56 hover:text-green-400 transition ease-in-out delay-150 hover:-translate-y-1">
          Pokemon
        </p>
      </Link>
      <Link href={`/hearthstone`} className="p-8 w-fit hover:text-green-400">
        <img
          className=" w-1/2 "
          src="https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/8a156873-a830-43b1-9b31-3becb2f788fb/dfjfchh-8f163dfd-9944-40e4-ab04-0f81d599687c.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzhhMTU2ODczLWE4MzAtNDNiMS05YjMxLTNiZWNiMmY3ODhmYlwvZGZqZmNoaC04ZjE2M2RmZC05OTQ0LTQwZTQtYWIwNC0wZjgxZDU5OTY4N2MucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.SoLYILfBFIrauaEu0bz5tcnRX_ZMRrtcxWVJ5vl-SLo"
        />
        <p className="text-5xl font-bold  my-4 uppercase text-gray-300 hover:text-green-400 transition ease-in-out delay-150 hover:-translate-y-1">
          Hearthstone
        </p>
      </Link>
    </div>
  );
};

export default Home;
