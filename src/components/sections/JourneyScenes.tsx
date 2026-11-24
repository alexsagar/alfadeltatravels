// The four journey scenes (photography only; no animated character on the
// homepage while the bird-journey concept is in review at /lab/bird-journey).
import { photos } from "@/content/photos";
import { SceneBand } from "./SceneBand";

export function JourneyScenes() {
  return (
    <div>
      <SceneBand photo={photos.village} index="01" eyebrow="The village" title="Set out from stone-roofed villages" />

      <SceneBand photo={photos.forest} index="02" eyebrow="The forest" title="Into the high forest" />

      <SceneBand photo={photos.alpine} index="03" eyebrow="The ascent" title="Onto rock and moraine" focus={[0.65, 0.5]} />

      <SceneBand photo={photos.viewpoint} index="04" eyebrow="The viewpoint" title="Arrive above the clouds" />
    </div>
  );
}
