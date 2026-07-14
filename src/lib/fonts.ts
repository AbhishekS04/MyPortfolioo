// ... existing imports
import localFont from 'next/font/local';
import { Sacramento } from 'next/font/google';

export const sacramento = Sacramento({
  subsets: ['latin'],
  weight: '400',
});

export const bolivia = localFont({
  src: '../fonts/BoliviaSignature-ZpWnz.ttf',
  variable: '--font-bolivia',
  display: 'swap',
});
