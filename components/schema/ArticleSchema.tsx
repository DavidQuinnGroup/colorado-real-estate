import { buildArticleSchema } from '@/lib/schema/articleSchema';

type Props = {
  title: string;
  description: string;
  url: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
  section?: string;
  keywords?: string[];
  aboutName?: string;
  city?: string;
};

function hasRequiredArticleFields({ title, description, url }: Props) {
  return title.trim().length > 0 && description.trim().length > 0 && url.trim().length > 0;
}

export default function ArticleSchema(props: Props) {
  if (!hasRequiredArticleFields(props)) return null;

  const schema = buildArticleSchema(props);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema),
      }}
    />
  );
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/components/schema/ArticleSchema.tsx
