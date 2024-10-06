export interface FontConfig {
  name: string;
  size: number;
  color: string;
  prefix_symbol?: string;
  prefix_symbol_color?: string;
}

export interface OpenGraphConfig {
  title_font: FontConfig;
  description_font: FontConfig;
  domain_font: FontConfig;
  domain: string;
  template_path: string;
  output_dir: string;
}

const config: OpenGraphConfig = {
  title_font: {
    name: "SpaceMono-Regular.ttf",
    size: 150,
    color: "#000000",
    prefix_symbol: "#",
    prefix_symbol_color: "#ff59bd",
  },
  description_font: {
    name: "SpaceMono-Italic.ttf",
    size: 80,
    color: "#737679",
    prefix_symbol: "//",
    prefix_symbol_color: "#ff59bd",
  },
  domain_font: {
    name: "SpaceMono-Regular.ttf",
    size: 70,
    color: "#737679",
  },
  domain: "nickmccleery.com",
  template_path: "./templates/template_blank.png",
  output_dir: "./static/images/og",
};

export default config;
