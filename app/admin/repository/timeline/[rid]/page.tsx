import Link from "next/link";
import { notFound } from "next/navigation";

import { getRepositoryTimeline } from "@/lib/repository/intelligence";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ rid: string }>;
};

export default async function RepositoryTimelinePage({ params }: PageProps) {
  const { rid } = await params;

  let timeline;
  try {
    timeline = await getRepositoryTimeline(decodeURIComponent(rid));
  } catch {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#0b0b0b] px-6 py-10 text-white">
      <div className="mx-auto max-w-5xl">
        <Link
          href={`/admin/repository/object/${encodeURIComponent(
            timeline.object.rid,
          )}`}
          className="text-xs uppercase tracking-[0.2em] text-white/40 hover:text-white"
        >
          {timeline.object.official_name}
        </Link>

        <div className="mt-3 border-b border-white/10 pb-8">
          <h1 className="text-4xl font-semibold tracking-tight">
            Repository Timeline
          </h1>
          <p className="mt-2 text-sm text-white/40">{timeline.object.rid}</p>
        </div>

        <div className="mt-8 space-y-4">
          {timeline.events.map((event) => (
            <article
              key={`${event.event_type}-${event.event_id}`}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
            >
              <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                <div>
                  <span className="text-xs uppercase tracking-[0.14em] text-white/35">
                    {event.event_type}
                  </span>
                  <h2 className="mt-2 text-lg font-medium">{event.title}</h2>
                  {event.description ? (
                    <p className="mt-3 text-sm leading-6 text-white/60">
                      {event.description}
                    </p>
                  ) : null}
                </div>

                <time className="text-xs text-white/35">
                  {new Date(event.occurred_at).toLocaleString()}
                </time>
              </div>
            </article>
          ))}

          {timeline.events.length === 0 ? (
            <div className="rounded-2xl border border-white/10 px-6 py-14 text-center text-sm text-white/45">
              No timeline events are registered for this object.
            </div>
          ) : null}
        </div>
      </div>
    </main>
  );
}
