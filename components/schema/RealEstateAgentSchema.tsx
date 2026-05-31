import { buildRealEstateAgentSchema, realEstateAgentSchema, type RealEstateAgentSchemaOptions } from '@/lib/schema/realEstateAgentSchema';

type Props = RealEstateAgentSchemaOptions;

export default function RealEstateAgentSchema(props: Props = {}) {
  const schema = props.url || props.image ? buildRealEstateAgentSchema(props) : realEstateAgentSchema;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema),
      }}
    />
  );
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/components/schema/RealEstateAgentSchema.tsx
