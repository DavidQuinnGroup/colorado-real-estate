import Link from "next/link"
import { getRelatedNodes } from "@/lib/knowledgeGraph"

type Props = {
  nodeId: string
}

export default function RelatedContent({ nodeId }: Props) {

  const related = getRelatedNodes(nodeId)

  if (!related || related.length === 0) return null

  return (
    <div className="mt-16 border-t border-gray-800 pt-10">

      <h3 className="text-xl mb-6">
        Related Real Estate Guides
      </h3>

      <div className="grid md:grid-cols-2 gap-4">

        {related.map((item) => (
          <Link
            key={item.slug}
            href={item.slug}
            className="underline"
          >
            {item.title}
          </Link>
        ))}

      </div>

    </div>
  )
}