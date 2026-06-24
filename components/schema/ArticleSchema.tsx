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
  const schemaGraph = schema['@graph'];

  return (
    <script
      type="application/ld+json"
      data-testid="reie-article-schema-component"
      data-article-schema-component-type="Article"
      data-article-schema-component-url={props.url}
      data-article-schema-component-title={props.title}
      data-article-schema-component-section={props.section ?? ""}
      data-article-schema-component-city={props.city ?? ""}
      data-article-schema-component-about={props.aboutName ?? ""}
      data-article-schema-component-keyword-count={props.keywords?.length ?? 0}
      data-article-schema-component-has-image={props.image ? "true" : "false"}
      data-article-schema-component-graph-count={schemaGraph.length}
      data-article-schema-component-has-breadcrumb="true"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema),
      }}
    />
  );
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/components/schema/ArticleSchema.tsx
