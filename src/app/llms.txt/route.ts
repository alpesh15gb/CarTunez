import { services } from '@/lib/services';
import { site } from '@/lib/site';

export const dynamic = 'force-static';

// Optional discovery aid, generated from the same visible facts as the website.
// llms.txt is not a search ranking signal or a requirement for AI search inclusion.
export function GET() {
  const text = `# CARTUNEZ

> Car accessories and customisation in Secunderabad, Hyderabad, India.

## Business information
- Website: ${site.url}/
- Telephone: ${site.phone}
- Email: ${site.email}
- Address: ${site.address}, ${site.city}, Hyderabad, ${site.region} ${site.postalCode}, India.
- Call or WhatsApp to confirm opening hours, availability and visit timing.

## Services
${services.map(service => `- [${service.name}](${site.url}/services/${service.slug}/): ${service.answer}`).join('\n')}

## Contact
- [Visit the workshop](${site.url}/visit/)
- [Request a vehicle-specific quote](${site.url}/enquire/)
- [All services](${site.url}/services/)

## About the previews
The website includes a BMW 3D reference study and generated design concepts. These are not verified customer builds or live product inventory. The receiver interface is a representative website simulation, not exact Pioneer firmware. Prices, stock, compatibility, installation scope and warranty terms must be confirmed with CARTUNEZ. No performance gains are guaranteed by this website.
`;
  return new Response(text, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
