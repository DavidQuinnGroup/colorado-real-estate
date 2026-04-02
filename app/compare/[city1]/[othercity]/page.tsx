export default function ComparePage({ params }: any) {

  const { city1, city2 } = params

  const format = (city: string) =>
    city.charAt(0).toUpperCase() + city.slice(1)

  const c1 = format(city1)
  const c2 = format(city2)

  return (

    <main style={{ padding: "120px 80px", color: "white", maxWidth: "900px" }}>

      <h1>{c1} vs {c2} Real Estate</h1>

      <p>
        Buyers relocating to Boulder County often compare {c1} and {c2}
        when deciding where to live.
      </p>

      <h2>Living in {c1}</h2>

      <p>
        {c1} offers strong schools, outdoor recreation, and proximity
        to Boulder’s technology and startup ecosystem.
      </p>

      <h2>Living in {c2}</h2>

      <p>
        {c2} is known for its community atmosphere, housing options,
        and access to Boulder and Denver.
      </p>

      <h2>Which City is Better?</h2>

      <p>
        Choosing between {c1} and {c2} depends on lifestyle preferences,
        commute, schools, and housing budget.
      </p>

    </main>

  )
}