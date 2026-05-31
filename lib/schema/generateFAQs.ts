import type { FAQItem } from "@/lib/schema/faqSchema";

function toTitleCase(value: string) {
  return value
    .split(/[\s-]+/)
    .filter(Boolean)
    .map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1).toLowerCase()}`)
    .join(" ");
}

function normalizeTopic(topic: string) {
  const normalized = topic.trim().replace(/[-_]+/g, " ").replace(/\s+/g, " ");
  return normalized ? normalized.toLowerCase() : "real estate intelligence";
}

function getMarketScope(cityName: string) {
  return `${cityName}, Colorado`;
}

export function generateFAQs(city: string, topic: string): FAQItem[] {
  const cityName = toTitleCase(city);
  const topicName = normalizeTopic(topic);
  const marketScope = getMarketScope(cityName);

  return [
    {
      question: `What does David Quinn Group evaluate in the ${marketScope} ${topicName} market?`,
      answer: `David Quinn Group evaluates ${marketScope} through the Real Estate Intelligence Engine, combining inventory context, pricing signals, construction condition, neighborhood resilience, lifestyle efficiency, and buyer or seller strategy.`,
    },
    {
      question: `How does construction forensics change a ${cityName} real estate decision?`,
      answer: `Construction forensics helps separate surface-level presentation from durable value. In ${cityName}, that means reviewing condition, building envelope risk, drainage, soil context, mechanical systems, and future maintenance exposure before relying only on comparable sales.`,
    },
    {
      question: `Why does neighborhood resilience matter in ${cityName}?`,
      answer: `Neighborhood resilience affects long-term ownership confidence, insurance complexity, renovation planning, and resale strategy. David Quinn Group uses resilience signals to help buyers and sellers understand risk beyond the headline price.`,
    },
    {
      question: `Is the ${cityName} housing market competitive?`,
      answer: `${cityName} can be competitive depending on price band, inventory depth, location quality, and property condition. The REIE approach looks at live supply, demand posture, construction quality, and negotiation leverage instead of treating the entire city as one uniform market.`,
    },
    {
      question: `How should buyers use the Real Estate Intelligence Engine in ${cityName}?`,
      answer: `Buyers can use the Real Estate Intelligence Engine to compare inventory, identify stronger neighborhood fits, review property-level risk signals, and decide where to move quickly versus where to negotiate or investigate further.`,
    },
    {
      question: `How should sellers use David Quinn Group intelligence in ${cityName}?`,
      answer: `Sellers can use David Quinn Group intelligence to understand likely buyer objections, prioritize high-leverage preparation, position the home against competing inventory, and frame value around condition, location, resilience, and lifestyle efficiency.`,
    },
  ];
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/lib/schema/generateFAQs.ts
