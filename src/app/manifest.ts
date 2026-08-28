import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "શ્રી માધવાનંદ આશ્રમ",
    short_name: "માધવાનંદ આશ્રમ",
    description: "સત્સંગ, ગુરુપરંપરા, આશ્રમ શાખાઓ અને સેવાયાત્રાનું ગુજરાતી ડિજિટલ ધામ.",
    start_url: "/",
    display: "standalone",
    background_color: "#fbf7ef",
    theme_color: "#711f2d",
    lang: "gu-IN",
  };
}
