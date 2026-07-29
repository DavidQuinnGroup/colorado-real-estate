import Link from "next/link";

import VisualIntelligencePrototype from "@/components/visual-intelligence/VisualIntelligencePrototype";
import { REIE_VISUAL_INTELLIGENCE_SYSTEM_STATUS } from "@/lib/visual-intelligence/visualIntelligenceSystem";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Visual Intelligence System | Repository Studio",
  robots: {
    index: false,
    follow: false,
  },
};

export default function VisualIntelligencePreviewPage() {
  return (
    <>
      <div className="overflow-hidden bg-[#0b0b0b] px-5 pt-8 sm:px-8 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 border-b border-white/10 pb-6 text-white sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/admin/repository"
            className="text-sm text-white/55 underline decoration-white/20 underline-offset-4 hover:text-white"
            style={{ overflowWrap: "anywhere" }}
          >
            Repository Studio
          </Link>
          <p
            className="text-xs font-semibold uppercase text-white/45"
            style={{ overflowWrap: "anywhere" }}
          >
            {REIE_VISUAL_INTELLIGENCE_SYSTEM_STATUS}
          </p>
        </div>
      </div>
      <VisualIntelligencePrototype />
    </>
  );
}
