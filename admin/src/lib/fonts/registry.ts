export const fonts = {
  inter: { label: "Inter", font: { variable: "--font-inter", className: "font-sans" } },
  roboto: { label: "Roboto", font: { variable: "--font-roboto", className: "font-sans" } },
  outfit: { label: "Outfit", font: { variable: "--font-outfit", className: "font-sans" } },
  figtree: { label: "Figtree", font: { variable: "--font-figtree", className: "font-sans" } },
  dmSans: { label: "DM Sans", font: { variable: "--font-dm-sans", className: "font-sans" } },
  nunitoSans: { label: "Nunito Sans", font: { variable: "--font-nunito-sans", className: "font-sans" } },
  playfairDisplay: {
    label: "Playfair Display",
    font: { variable: "--font-playfair-display", className: "font-serif" },
  },
  lora: { label: "Lora", font: { variable: "--font-lora", className: "font-serif" } },
  jetbrainsMono: { label: "JetBrains Mono", font: { variable: "--font-jetbrains-mono", className: "font-mono" } },
  geist: { label: "Geist (System)", font: { variable: "--font-geist", className: "font-sans" } },
};

export const fontKeys = Object.keys(fonts);

export type FontKey = keyof typeof fonts;
export const fontOptions = Object.entries(fonts).map(([key, value]) => ({
  key: key as FontKey,
  label: value.label,
}));

export const fontVars = "";
