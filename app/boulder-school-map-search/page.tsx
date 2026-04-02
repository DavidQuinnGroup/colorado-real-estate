export const metadata = {
  title: "Boulder School District Homes Map Search",
  description:
    "Search homes for sale by school district in Boulder Colorado using an interactive map."
};

export default function BoulderSchoolMapSearch() {
  return (
    <div className="max-w-6xl mx-auto pt-32 pb-24 px-6">

      <h1 className="text-4xl font-light mb-6">
        Homes by School District in Boulder
      </h1>

      <p className="text-lg text-gray-300 mb-10">
        Search homes for sale by school district in Boulder using our interactive map.
      </p>

      <div className="w-full h-[700px] bg-[#1a1a1a] flex items-center justify-center text-gray-400">
        SCHOOL DISTRICT MAP SEARCH
      </div>

    </div>
  );
}