import { Outfit, Google_Sans_Code } from "next/font/google";

const mainFont = Outfit();
const monoFont = Google_Sans_Code({ variable: "--font-mono" });

export { mainFont, monoFont };