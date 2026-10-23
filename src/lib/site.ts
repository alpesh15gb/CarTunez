export const site = {
  name: 'CARTUNEZ',
  url: 'https://cartunez.in',
  phone: '+919949695030',
  phoneDisplay: '+91 99496 95030',
  whatsapp: '919949695030',
  // Supply verified workshop details here. Missing details are never fabricated.
  address: '',
  city: '',
  mapsUrl: '',
  instagramUrl: '',
};

export const categories = [
  { id: 'interiors', number: '01', name: 'Interiors & seating', fullName: 'Custom Interiors & Seating', short: 'Interiors', line: 'A different feeling. Every time you get in.' },
  { id: 'bodykits', number: '02', name: 'Body kits & conversions', fullName: 'Body Kits & Conversions', short: 'Body kits', line: 'A presence you don’t have to announce.' },
  { id: 'audio', number: '03', name: 'Infotainment & audio', fullName: 'Infotainment & Audio', short: 'Audio & tech', line: 'Your own world. Turned all the way up.' },
  { id: 'performance', number: '04', name: 'Performance & utility', fullName: 'Performance & Utility', short: 'Performance', line: 'More purpose. In every kilometre.' },
];

export function whatsappUrl(message = 'Hi CARTUNEZ! I’d like to customise my car. Can we talk about a build?') {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
}

export const motion = {
  entrance: 1,
  stagger: 0.08,
  ease: 'power3.out',
  scrub: 0.8,
  chapterDistance: '+=75%',
};
