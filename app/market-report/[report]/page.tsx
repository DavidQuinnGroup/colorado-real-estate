import { marketReports } from "../../../data/marketReports"

export async function generateStaticParams() {

return marketReports.map((report) => ({
report: report.slug
}))

}

export default function MarketReport({ params }: any) {

const report = marketReports.find(
r => r.slug === params.report
)

if(!report){
return <div>Report not found</div>
}

return (

<main className="min-h-screen bg-white text-gray-900">

<section className="bg-gray-900 text-white py-20 text-center">

<h1 className="text-5xl font-bold mb-6">
Boulder Housing Market Report
</h1>

<p className="text-xl">
{report.month}
</p>

</section>

<section className="py-20 max-w-4xl mx-auto px-6">

<div className="grid md:grid-cols-3 gap-8">

<div className="border p-6 rounded-xl">
<h3>Median Price</h3>
<p className="text-3xl font-bold">
${report.medianPrice.toLocaleString()}
</p>
</div>

<div className="border p-6 rounded-xl">
<h3>Inventory</h3>
<p className="text-3xl font-bold">
{report.inventory}
</p>
</div>

<div className="border p-6 rounded-xl">
<h3>Days on Market</h3>
<p className="text-3xl font-bold">
{report.daysOnMarket}
</p>
</div>

</div>

</section>

</main>

)

}