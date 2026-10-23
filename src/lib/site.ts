export const site = {
  name: 'CARTUNEZ',
  url: 'https://cartunez.in',
  phone: '+919949695030',
  phoneDisplay: '+91 99496 95030',
  whatsapp: '919949695030',
  // First-party source: CARTUNEZ's previously indexed homepage, checked 2026-10-24.
  // Keep this identical to the Google Business Profile. Hours/pin/ratings are not inferred.
  address: 'Shop No. 12 & 13, Veer Hanuman Temple, S.P. Road',
  city: 'Secunderabad',
  region: 'Telangana',
  postalCode: '500003',
  serviceArea: 'Hyderabad & Secunderabad',
  email: 'adnan@cartunez.in',
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=CARTUNEZ%20Shop%2012%2013%20Veer%20Hanuman%20Temple%20SP%20Road%20Secunderabad%20500003',
  instagramUrl: '',
};

export const serviceNavigation = [
  { slug: 'car-interiors-seat-covers', label: 'Interiors & seat covers' },
  { slug: 'body-kits-conversions', label: 'Body kits & conversions' },
  { slug: 'pioneer-infotainment-car-audio', label: 'Pioneer infotainment & audio' },
  { slug: 'car-floor-mats', label: '3D & 7D floor mats' },
  { slug: 'ambient-car-lighting', label: 'Ambient car lighting' },
  { slug: 'performance-utility', label: 'Performance & utility' },
] as const;

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
