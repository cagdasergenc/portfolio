import shotDnbDtf from '../assets/web/dabdtf.webp'
import shotShirtPrint from '../assets/web/shirtprintcenter.webp'

/**
 * `note` is the one design decision named on each card. Each is read off
 * the live site itself (what the screenshot shows), so it can be checked
 * against the work rather than taken on trust.
 */
export const webWork = [
  {
    title: 'D&B DTF',
    role: 'UI, web design',
    href: 'https://dabdtf.com',
    shot: shotDnbDtf,
    alt: 'D&B DTF homepage: dark navy hero, Back to School artwork, and two ordering calls to action',
    note: 'Designed the custom print-on-demand checkout end to end, applying Baymard Institute and Nielsen Norman Group checkout heuristics.',
  },
  {
    title: 'ShirtPrintCenter',
    role: 'UI, web design',
    href: 'https://shirtprintingcenter.com',
    shot: shotShirtPrint,
    alt: 'ShirtPrintCenter homepage: green split hero, product categories, and a row of apparel brand logos',
    note: 'Navigation leads with print methods (DTF, embroidery, specialty) before apparel, because buyers pick how something is printed before what it goes on.',
  },
]
