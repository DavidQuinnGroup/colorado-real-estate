interface Props {
  score: number
}

export default function MarketHealth({ score }: Props) {

  const getLabel = () => {
    if (score >= 80) return "Strong Seller Market"
    if (score >= 60) return "Seller Leaning"
    if (score >= 40) return "Balanced Market"
    if (score >= 20) return "Buyer Leaning"
    return "Strong Buyer Market"
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl text-center">
      <h3 className="text-lg mb-2">Boulder Market Health</h3>

      <div className="text-5xl font-bold text-emerald-400">
        {score}
      </div>

      <div className="text-sm text-zinc-400 mt-2">
        {getLabel()}
      </div>
    </div>
  )
}