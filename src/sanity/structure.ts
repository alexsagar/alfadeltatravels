import type { StructureResolver } from "sanity/structure";

// Plain-language Studio navigation: company settings first (a single
// document), then one list per content type.
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Alfa Delta Travels")
    .items([
      S.listItem().title("Company & contact").id("siteSettings").child(S.document().schemaType("siteSettings").documentId("siteSettings")),
      S.listItem().title("Homepage").id("homePage").child(S.document().schemaType("homePage").documentId("homePage")),
      S.divider(),
      S.documentTypeListItem("trek").title("Treks"),
      S.documentTypeListItem("experienceCategory").title("Experience categories"),
      S.documentTypeListItem("experience").title("Experiences"),
      S.documentTypeListItem("tourTheme").title("Tour themes"),
      S.documentTypeListItem("tour").title("Tours"),
      S.documentTypeListItem("destination").title("Destinations"),
      S.documentTypeListItem("story").title("Stories & guides"),
    ]);
