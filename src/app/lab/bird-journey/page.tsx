import type { Metadata } from "next";
import { BirdJourneyM41 as BirdJourney } from "@/features/bird/BirdJourneyM41";

// EXPERIMENTAL prototype (Milestone 4 lab). Not linked from the site; not indexed.
export const metadata: Metadata = {
  title: "Bird journey prototype",
  robots: { index: false, follow: false },
};

export default function BirdJourneyLabPage() {
  return (
    <main id="main">
      <BirdJourney />
    </main>
  );
}
