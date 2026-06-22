const loaded = new Set<string>();

/** Load a Google Font family on demand so previews look distinct */
export function loadGoogleFont(family: string) {
  if (!family || loaded.has(family)) return;
  loaded.add(family);
  const id = `gf-${family.replace(/\s+/g, "-").toLowerCase()}`;
  if (document.getElementById(id)) return;
  const link = document.createElement("link");
  link.id = id;
  link.rel = "stylesheet";
  const encoded = family.replace(/ /g, "+");
  link.href = `https://fonts.googleapis.com/css2?family=${encoded}:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap`;
  document.head.appendChild(link);
}

export function preloadCommonFonts() {
  [
    "Inter",
    "Geist",
  ].forEach(loadGoogleFont);
}
