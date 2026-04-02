export function generateFAQs(city: string, topic: string) {

  const cityName =
    city.charAt(0).toUpperCase() + city.slice(1);

  const topicName = topic
    .split("-")
    .join(" ");

  return [

    {
      question: `What should buyers know about ${topicName} in ${cityName}?`,
      answer: `${cityName}, Colorado offers a competitive real estate market with strong demand, outdoor lifestyle amenities, and proximity to Boulder and Denver.`,
    },

    {
      question: `Is ${cityName} a good place to buy a home?`,
      answer: `${cityName} is considered one of the most desirable communities in Boulder County due to its lifestyle, access to outdoor recreation, and long-term real estate appreciation.`,
    },

    {
      question: `What is the real estate market like in ${cityName}?`,
      answer: `The housing market in ${cityName} typically features strong buyer demand, limited inventory, and steady long-term appreciation.`,
    },

    {
      question: `Are home prices in ${cityName} rising?`,
      answer: `Home values in ${cityName} have historically appreciated due to limited supply, strong local economy, and high quality of life.`,
    },

    {
      question: `How competitive is the housing market in ${cityName}?`,
      answer: `Homes in ${cityName} often attract significant buyer interest due to the area's lifestyle, proximity to Boulder, and strong schools.`,
    },

  ];
}