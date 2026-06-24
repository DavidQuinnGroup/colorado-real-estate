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
  const briefLinkCount = validLinks.filter((link) => link.briefUrl).length;

  if (!validLinks.length) {
    return null;
  }

  return (
    <section
      className="mt-12 border border-white/10 bg-[#050505] p-6 text-white"
      data-testid="reie-city-internal-links"
      data-city-internal-links-title={title}
      data-city-internal-links-input-count={links.length}
      data-city-internal-links-valid-count={validLinks.length}
      data-city-internal-links-brief-count={briefLinkCount}
      data-city-internal-links-has-briefs={briefLinkCount ? "true" : "false"}
    >
      <div className="mb-6">
        <p className="text-[10px] font-black uppercase tracking-[0.35em] text-[#00ff80]">
          Internal City Graph
        </p>
        <h3 className="mt-2 text-2xl font-black uppercase italic tracking-tight">
          {title}
        </h3>
      </div>

      <div
        className="grid grid-cols-1 gap-px overflow-hidden border border-white/10 bg-white/10 md:grid-cols-2"
        data-testid="reie-city-internal-links-list"
        data-city-internal-links-list-count={validLinks.length}
      >
        {validLinks.map((link, index) => {
          const marketHref = getLinkHref(link);

          return (
            <div
              key={marketHref}
              className="bg-black"
              data-testid="reie-city-internal-link-card"
              data-city-internal-link-index={index}
              data-city-internal-link-name={link.name}
              data-city-internal-link-market-href={marketHref}
              data-city-internal-link-description={link.description || ""}
              data-city-internal-link-has-description={link.description ? "true" : "false"}
              data-city-internal-link-brief-href={link.briefUrl || ""}
              data-city-internal-link-brief-description={link.briefDescription || ""}
              data-city-internal-link-has-brief={link.briefUrl ? "true" : "false"}
            >
              <Link
                href={marketHref}
                className="group block p-5 transition-colors hover:bg-white/[0.04]"
                data-testid="reie-city-internal-market-link"
                data-city-internal-market-link-href={marketHref}
              >
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
                  data-testid="reie-city-internal-brief-link"
                  data-city-internal-brief-link-href={link.briefUrl}
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
          );
        })}
      </div>
    </section>
  );
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/components/internal-links/CityInternalLinks.tsx
