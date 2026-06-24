import { buildRealEstateAgentSchema, realEstateAgentSchema, type RealEstateAgentSchemaOptions } from '@/lib/schema/realEstateAgentSchema';

type Props = RealEstateAgentSchemaOptions;

export default function RealEstateAgentSchema(props: Props = {}) {
  const schema = props.url || props.image ? buildRealEstateAgentSchema(props) : realEstateAgentSchema;
  const schemaGraph = schema['@graph'];

  return (
    <script
      type="application/ld+json"
      data-testid="reie-real-estate-agent-schema-component"
      data-agent-schema-component-type="RealEstateAgent"
      data-agent-schema-component-url={props.url ?? "https://davidquinngroup.com"}
      data-agent-schema-component-has-custom-url={props.url ? "true" : "false"}
      data-agent-schema-component-has-custom-image={props.image ? "true" : "false"}
      data-agent-schema-component-graph-count={schemaGraph.length}
      data-agent-schema-component-has-property-search="true"
      data-agent-schema-component-has-reie-service="true"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema),
      }}
    />
  );
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/components/schema/RealEstateAgentSchema.tsx
