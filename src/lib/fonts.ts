import localFont from "next/font/local";
import { Sacramento } from "next/font/google";

export const hendrigo = localFont({
    src: "../fonts/Hendrigo.otf",
    variable: "--font-signature",
    display: "swap",
});

export const sacramento = Sacramento({
    weight: "400",
    subsets: ["latin"],
    variable: "--font-sacramento",
    display: "swap",
});
