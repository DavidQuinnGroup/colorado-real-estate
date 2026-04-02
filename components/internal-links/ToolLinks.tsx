import Link from "next/link"

export default function ToolLinks() {

  return (

    <section className="mt-16">

      <h2 className="text-2xl font-semibold mb-4">
        Real Estate Tools
      </h2>

      <ul className="space-y-2">

        <li>
          <Link href="/home-value">
            What Is My Home Worth?
          </Link>
        </li>

        <li>
          <Link href="/home-equity-calculator">
            Home Equity Calculator
          </Link>
        </li>

      </ul>

    </section>
  )
}