import { generateMarketForecast } from "@/lib/forecastEngine"

export default function ForecastPage({ params }: any) {

  const forecast = generateMarketForecast(params.city)

  return (

    <main className="max-w-5xl mx-auto py-20">

      <h1 className="text-5xl font-bold mb-10">
        {forecast.city} Housing Market Forecast
      </h1>

      <p className="text-xl mb-6">
        Predicted Appreciation: {forecast.appreciation}%
      </p>

      <p className="text-xl mb-6">
        Market Outlook: {forecast.outlook}
      </p>

      <p className="mt-10 text-gray-600">
        The housing market forecast for {forecast.city} is
        based on supply trends, buyer demand, and regional
        economic indicators.
      </p>

    </main>

  )
}