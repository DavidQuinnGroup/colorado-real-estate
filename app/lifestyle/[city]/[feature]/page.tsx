export default function LifestylePage({ params }: any) {

  const { city, feature } = params

  const formatCity =
    city.charAt(0).toUpperCase() + city.slice(1)

  const formatFeature =
    feature.replace("-", " ")

  return (

    <main style={{ padding: "120px 80px", color: "white", maxWidth: "900px" }}>

      <h1>
        {formatCity} Homes with {formatFeature}
      </h1>

      <p>
        Buyers searching for homes with {formatFeature} in {formatCity}
        can find a wide variety of properties including luxury homes,
        modern new construction, and mountain view estates.
      </p>

      <h2>Living in {formatCity}</h2>

      <p>
        {formatCity} Colorado is one of the most desirable places to live
        in Boulder County thanks to its outdoor lifestyle, access to
        trails, and proximity to the Boulder tech corridor.
      </p>

      <h2>Find Homes with {formatFeature}</h2>

      <p>
        Many homes in {formatCity} offer unique features such as large lots,
        open space views, or walkable access to downtown amenities.
      </p>

    </main>
  )
}