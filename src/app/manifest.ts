import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Abhishek Singh | Portfolio",
    short_name: "Abhishek",
    description: "Product Engineer specializing in premium web experiences.",
    start_url: "/",
    display: "standalone",
    background_color: "#050805",
    theme_color: "#050805",
    icons: [
      {
        src: "/removebg.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/removebg.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/removebg.png",
        sizes: "180x180",
        type: "image/png",
      },
      {
        src: "/removebg.png",
        sizes: "144x144",
        type: "image/png",
      },
      {
        src: "/removebg.png",
        sizes: "96x96",
        type: "image/png",
      },
    ],
  };
}
