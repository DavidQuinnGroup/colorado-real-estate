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
      answer: `David Quinn Group evaluates ${marketScope} through the Real Estate Intelligence Engine, combining inventory context, pricing signals, public construction questions, neighborhood context, and buyer or seller strategy.`,
    },
    {
      question: `How does construction context support a ${cityName} real estate decision?`,
      answer: `Construction context helps buyers move beyond surface-level presentation. In ${cityName}, that means asking about drainage, exterior exposure, soil context, mechanical systems, maintenance history, and professional inspection scope before relying only on comparable sales.`,
    },
    {
      question: `Why does neighborhood resilience matter in ${cityName}?`,
      answer: `Neighborhood context can affect long-term ownership planning, insurance questions, maintenance expectations, and resale strategy. David Quinn Group uses public context to help buyers and sellers identify what deserves closer review beyond the headline price.`,
    },
    {
      question: `Is the ${cityName} housing market competitive?`,
      answer: `${cityName} can be competitive depending on price band, inventory depth, location quality, and property condition. The REIE approach looks at live supply, demand posture, construction quality, and negotiation leverage instead of treating the entire city as one uniform market.`,
    },
    {
      question: `How should buyers use the Real Estate Intelligence Engine in ${cityName}?`,
      answer: `Buyers can use the Real Estate Intelligence Engine to compare inventory, review public property context, prepare better questions, and decide what to verify before touring, writing, or negotiating.`,
    },
    {
      question: `How should sellers use David Quinn Group intelligence in ${cityName}?`,
      answer: `Sellers can use David Quinn Group intelligence to prepare for buyer questions, review competing inventory, organize documentation, and frame the home around public facts, location context, and preparation priorities.`,
    },
  ];
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/lib/schema/generateFAQs.ts
