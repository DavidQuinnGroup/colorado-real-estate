import Link from "next/link"

export default function AuthorByline() {

  return (

    <div className="border-t pt-6 mt-12">

      <p className="text-sm text-gray-500">
        Written by
      </p>

      <Link
        href="/author/david-quinn"
        className="font-semibold text-blue-600 hover:underline"
      >
        David Quinn
      </Link>

    </div>

  )
}