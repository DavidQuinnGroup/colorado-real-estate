import Link from "next/link"

export default function CityInternalLinks({ links }: { links: any[] }) {

  return (
    <div className="mt-12 border-t pt-8">

      <h3 className="text-xl font-semibold mb-4">
        Nearby Colorado Real Estate
      </h3>

      <div className="grid grid-cols-2 gap-3">

        {links.map(link => (
          <Link
            key={link.url}
            href={link.url}
            className="text-blue-600 hover:underline"
          >
            {link.name} Real Estate
          </Link>
        ))}

      </div>

    </div>
  )
}