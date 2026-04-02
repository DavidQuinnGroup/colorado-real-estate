export default function RelocationPage({ params }: any) {

  const { from } = params

  const formatFrom =
    from.charAt(0).toUpperCase() + from.slice(1)

  return (

    <main style={{ padding: "120px 80px", color: "white", maxWidth: "900px" }}>

      <h1>
        Moving to Boulder from {formatFrom}
      </h1>

      <p>
        Many buyers relocate to Boulder, Colorado from {formatFrom}
        each year for lifestyle, outdoor recreation, and career
        opportunities in the technology sector.
      </p>

      <h2>Why People Move to Boulder</h2>

      <p>
        Boulder offers mountain views, access to trails, strong schools,
        and one of the most vibrant tech economies in the country.
      </p>

      <h2>Buying a Home in Boulder</h2>

      <p>
        Relocating buyers often begin their search in neighborhoods
        like Mapleton Hill, Table Mesa, and North Boulder.
      </p>

    </main>
  )
}