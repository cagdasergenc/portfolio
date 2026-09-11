import shotDnbDtf from '../assets/web/dabdtf.webp'
import shotShirtPrint from '../assets/web/shirtprintcenter.webp'
import logoMesfeno from '../assets/logos/mesfeno_logo.png'

/**
 * `note` is the one design decision worth naming on each shop. Leave it
 * empty rather than filling it with something plausible: the card renders
 * without it, and an invented rationale on real client work is worse than
 * a shorter card.
 */
export const webWork = [
  {
    title: 'D&B DTF',
    role: 'UI, web design',
    href: 'https://dabdtf.com',
    shot: shotDnbDtf,
    alt: 'D&B DTF homepage: dark navy hero, Back to School artwork, and two ordering calls to action',
    note: '',
    status: 'live',
  },
  {
    title: 'ShirtPrintCenter',
    role: 'UI, web design',
    href: 'https://shirtprintingcenter.com',
    shot: shotShirtPrint,
    alt: 'ShirtPrintCenter homepage: green split hero, product categories, and a row of apparel brand logos',
    note: '',
    status: 'live',
  },
  {
    title: 'MesfenoWear',
    role: 'UI, web design',
    href: null,
    // No screenshot exists and the site is gone, so the card shows the
    // identity rather than pretending to show the work.
    logo: logoMesfeno,
    note: '',
    status: 'archived',
  },
]
