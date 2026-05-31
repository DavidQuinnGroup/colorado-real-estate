import Link from "next/link";

type CityInternalLink = {
  name: string;
  url?: string;
  href?: string;
  description?: string;
  briefUrl?: string;
  briefDescription?: string;
};

type CityInternalLinksProps = {
  links: CityInternalLink[];
  title?: string;
};

function getLinkHref(link: CityInternalLink) {
  return link.href ?? link.url ?? "#";
}

export default function CityInternalLinks({
  links,
  title = "Nearby Colorado Real Estate",
}: CityInternalLinksProps) {
  const validLinks = links.filter((link) => link.name && getLinkHref(link) !== "#");

  if (!validLinks.length) {
    return null;
  }

  return (
    <section className="mt-12 border border-white/10 bg-[#050505] p-6 text-white">
      <div className="mb-6">
        <p className="text-[10px] font-black uppercase tracking-[0.35em] text-[#00ff80]">
          Internal City Graph
        </p>
        <h3 className="mt-2 text-2xl font-black uppercase italic tracking-tight">
          {title}
        </h3>
      </div>

      <div className="grid grid-cols-1 gap-px overflow-hidden border border-white/10 bg-white/10 md:grid-cols-2">
        {validLinks.map((link) => (
          <div key={getLinkHref(link)} className="bg-black">
            <Link href={getLinkHref(link)} className="group block p-5 transition-colors hover:bg-white/[0.04]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-base font-black uppercase italic tracking-tight text-white">
                    {link.name} Real Estate
                  </p>
                  {link.description ? (
                    <p className="mt-2 text-[10px] font-bold uppercase leading-5 tracking-[0.18em] text-white/30">
                      {link.description}
                    </p>
                  ) : null}
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.18em] text-[#00ff80] opacity-70 transition-opacity group-hover:opacity-100">
                  Market
                </span>
              </div>
            </Link>

            {link.briefUrl ? (
              <Link
                href={link.briefUrl}
                className="group block border-t border-white/10 px-5 py-4 transition-colors hover:bg-[#00ff80]/10"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-[0.24em] text-[#00ff80]">Strategy Brief</p>
                    {link.briefDescription ? (
                      <p className="mt-2 text-[10px] font-bold uppercase leading-5 tracking-[0.18em] text-white/30">
                        {link.briefDescription}
                      </p>
                    ) : null}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.18em] text-[#00ff80] opacity-70 transition-opacity group-hover:opacity-100">
                    Brief
                  </span>
                </div>
              </Link>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/components/internal-links/CityInternalLinks.tsx
