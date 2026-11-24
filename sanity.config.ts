"use client";

// Embedded Studio at /studio (src/app/studio). Needs NEXT_PUBLIC_SANITY_PROJECT_ID.
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { apiVersion, dataset, projectId } from "./src/sanity/env";
import { schemaTypes } from "./src/sanity/schemaTypes";
import { structure } from "./src/sanity/structure";

export default defineConfig({
  name: "alfa-delta-travels",
  // Dataset in the title so editors always see where they are working.
  title: `Alfa Delta Travels · ${dataset}`,
  basePath: "/studio",
  projectId,
  dataset,
  schema: {
    types: schemaTypes,
    // The settings and homepage singletons cannot be created twice, deleted or unpublished.
    templates: (t) => t.filter(({ schemaType }) => schemaType !== "siteSettings" && schemaType !== "homePage"),
  },
  document: {
    actions: (actions, { schemaType }) => (schemaType === "siteSettings" || schemaType === "homePage" ? actions.filter(({ action }) => action !== "delete" && action !== "duplicate" && action !== "unpublish") : actions),
  },
  plugins: [structureTool({ structure })],
  // Pinned API version for Studio's own queries too.
  apiVersion,
});
