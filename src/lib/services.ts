export type Service = {
  slug: string;
  name: string;
  title: string;
  description: string;
  eyebrow: string;
  headline: string;
  answer: string;
  image: string;
  imageAlt: string;
  chapter: string;
  sections: { title: string; text: string }[];
  checklist: string[];
  questions: { question: string; answer: string }[];
};

// Editorial content is rendered at build time, never gated behind a canvas or animation.
// Product stock, prices, warranties and compatibility are confirmed per vehicle.
export const services: Service[] = [
  {
    slug: 'car-interiors-seat-covers', name: 'Car interiors & seat covers',
    title: 'Car Interiors & Seat Covers in Hyderabad',
    description: 'Explore car seat covers, upholstery and interior customisation at CARTUNEZ, Secunderabad. Compare materials and discuss fitment for your car.',
    eyebrow: '01 / CABIN & COMFORT', headline: 'Choose your material and finish.',
    answer: 'CARTUNEZ helps car owners in Hyderabad and Secunderabad plan seat covers, upholstery and interior upgrades around their vehicle, preferred finish and everyday use. Share your make, model and year to discuss suitable materials and installation.',
    image: 'interior', imageAlt: 'Brown and black car seats with contrast stitching', chapter: 'interiors',
    sections: [
      { title: 'Start with the way you use your car', text: 'A daily commute, a family car and a weekend project need different interiors. Tell us whether easy cleaning, a softer feel, a particular colour or a coordinated cabin matters most. A useful brief includes photographs of your existing seats, the condition of the upholstery and any areas you would like to change.' },
      { title: 'Compare the actual materials', text: 'Leather, leatherette, fabric and suede-like finishes have different textures and care requirements. Names alone do not tell you the grade or construction. Ask to see the available samples, stitching, backing and cleaning guidance. Match the seat design to the door trim and floor mats before choosing a complete colour scheme.' },
      { title: 'Fitment is part of the finish', text: 'Seat shape, headrests, armrests, folding mechanisms and vehicle equipment affect the pattern and installation. Share details of seat-mounted airbags, ventilation and existing electric adjustments when requesting advice. The team needs to assess the specific seat before confirming which cover or upholstery approach is suitable.' },
    ],
    checklist: ['Vehicle make, model, year and variant', 'Seat and cabin photographs', 'Preferred material, colour and stitching', 'Seat equipment and any existing damage'],
    questions: [
      { question: 'Can you match seat covers to my car’s interior?', answer: 'Bring a cabin photo or visit us with your car. We can compare the available samples against your existing trim and help you choose a colour and material.' },
      { question: 'How much do custom seat covers cost?', answer: 'A quote depends on the vehicle, material, pattern and installation scope. Send your vehicle details and the finish you want to receive a relevant quote rather than a generic starting price.' },
      { question: 'Can I combine upholstery with mats and lighting?', answer: 'Yes, you can request a coordinated interior brief covering seating, floor mats and ambient lighting. Each product’s fitment, availability and installation are confirmed before work is agreed.' },
    ],
  },
  {
    slug: 'body-kits-conversions', name: 'Body kits & conversions',
    title: 'Car Body Kits & Conversions in Hyderabad',
    description: 'Plan body kits, front lips, side skirts and exterior conversions with CARTUNEZ in Secunderabad. Discuss vehicle fitment, finish and installation.',
    eyebrow: '02 / EXTERIOR STYLING', headline: 'Find the look you want.',
    answer: 'Explore body kits and exterior conversion ideas with CARTUNEZ in Secunderabad, Hyderabad. The right recommendation starts with your exact car, photographs and intended look, followed by a discussion of part fitment, finishing and installation.',
    image: 'aero', imageAlt: 'Silver front bumper with a black front splitter', chapter: 'bodykits',
    sections: [
      { title: 'Choose a direction before choosing parts', text: 'A subtle front lip creates a different result from a full bumper conversion. Reference photographs help explain whether you want an original-equipment feel, a sharper profile or a more pronounced stance. Start with the complete look so a spoiler, side skirt and rear treatment complement one another.' },
      { title: 'The exact variant matters', text: 'Cars with the same model name can have different bumpers, sensors and mounting points across years or trim levels. Tell us about parking sensors, cameras, existing accessories and any previous body work. A photograph of a part on another car does not establish compatibility with yours.' },
      { title: 'Ask what the installation includes', text: 'Separate the part itself from painting, surface preparation, mounting hardware and installation in your quote. Discuss panel alignment, finish matching and everyday ground clearance before committing. Product availability, suitability for your intended use and the final scope are assessed for the vehicle.' },
    ],
    checklist: ['Model year, variant and exterior photographs', 'Reference images of the look you want', 'Parking sensors, cameras and existing modifications', 'Desired finish and budget direction'],
    questions: [
      { question: 'Do you have a body kit for my model?', answer: 'Send your make, model, year and variant, with clear front and rear photos. We’ll check which kits are available and what fitting them involves.' },
      { question: 'Can I upgrade just a front lip or spoiler?', answer: 'You can enquire about individual exterior pieces as well as a coordinated conversion. Fitment and the installation method need to be checked for the particular product and car.' },
      { question: 'Is painting included in the body kit price?', answer: 'Ask for a written scope separating parts, paint preparation, finishing and installation. The final quote depends on the finish and work required for your vehicle.' },
    ],
  },
  {
    slug: 'pioneer-infotainment-car-audio', name: 'Pioneer infotainment & car audio',
    title: 'Pioneer Car Audio & Infotainment in Hyderabad',
    description: 'Explore Pioneer receivers, car speakers, amplifiers and DSP at CARTUNEZ, Secunderabad. Discuss phone connectivity, fitment and your audio upgrade.',
    eyebrow: '03 / SOUND & TECHNOLOGY', headline: 'Your drive. Connected.',
    answer: 'CARTUNEZ helps you explore Pioneer receivers and car audio upgrades in Hyderabad and Secunderabad. Discuss your phone, factory dashboard and listening preferences to shortlist a receiver, speakers, amplification or DSP suited to your car.',
    image: 'audio', imageAlt: 'Car speaker beside stitched interior trim', chapter: 'audio',
    sections: [
      { title: 'Choose the receiver by its model number', text: 'A touchscreen does not tell you everything about a receiver. Ask for the exact Pioneer model and its feature specification before selecting it. Phone projection, Bluetooth, camera inputs, steering-wheel controls and wired or wireless connectivity vary by receiver and installation. Brand name alone is not a feature guarantee.' },
      { title: 'Build the audio system around your priorities', text: 'Clearer voices, stronger bass and a more balanced sound call for different upgrade paths. Tell us what you hear in the current system and what you want to change. Discuss speakers, an amplifier, a subwoofer or digital signal processing as parts of a complete setup, rather than choosing by wattage labels alone.' },
      { title: 'Check the dashboard and existing equipment', text: 'Share a dashboard photograph, your car variant and details of its factory screen, camera, amplifier and steering-wheel controls. These determine which fascia, wiring and integration work may be required. Request a quote that identifies the receiver model, accessories, installation and any original functions retained or changed.' },
    ],
    checklist: ['Car make, year, variant and dashboard photo', 'Phone model and preferred connectivity', 'Factory camera, controls and existing audio equipment', 'Listening priorities and receiver features required'],
    questions: [
      { question: 'Is a Pioneer touchscreen the same as an Android head unit?', answer: 'They can work differently. Tell us which phone you use and which apps you need. We’ll help you compare the exact receiver models and their supported features.' },
      { question: 'Will my steering-wheel controls and reverse camera work?', answer: 'This depends on the vehicle, selected receiver and integration accessories. Include those requirements in your enquiry so the team can assess compatibility and explain the proposed installation.' },
      { question: 'Can I try the Pioneer experience before enquiring?', answer: 'Try the receiver demo on our homepage for music, navigation and sound controls. Calls, pairing and radio are simulated. Ask us about the actual screen and features on the model you’re considering.' },
    ],
  },
  {
    slug: 'car-floor-mats', name: 'Custom-fit car floor mats',
    title: '3D & 7D Car Floor Mats in Hyderabad',
    description: 'Compare custom-fit 3D and 7D car floor mats at CARTUNEZ, Secunderabad. Discuss coverage, material, cleaning and fit for your exact vehicle.',
    eyebrow: '04 / CAR FLOOR MATS', headline: 'Find the right mats for your car.',
    answer: 'Explore 3D and 7D car floor mat options with CARTUNEZ in Secunderabad, Hyderabad. Choose around your car’s floor shape, coverage needs, preferred material and cleaning routine, with fitment confirmed for the exact vehicle.',
    image: '/images/cabin/matting-cocoa.webp', imageAlt: 'Cocoa quilt floor mats covering the footwells and centre tunnel', chapter: 'cabin-studio',
    sections: [
      { title: 'Look beyond the 3D or 7D label', text: 'Mat names describe product ranges and can differ between suppliers. Compare the actual construction, edge height, surface material, backing and removable layers of the options available. A number in the name does not establish how a mat will fit your car or how easy it will be to clean.' },
      { title: 'Coverage should suit daily use', text: 'Think about dust, wet shoes, rear passengers and how often you remove the mats. A tray-style design and a layered upholstered design can feel different underfoot and have different cleaning routines. Ask to compare the front footwells, rear floor and centre area rather than judging only the driver’s mat.' },
      { title: 'Confirm the floor shape and retention', text: 'Share the model year and variant, and mention any existing floor treatment. Check that the selected mat matches the floor and its retaining arrangement, and that the installed position allows the intended pedal and seat movement. Decide whether a boot mat is part of the same enquiry or a separate requirement.' },
    ],
    checklist: ['Vehicle make, model, year and variant', 'Front, rear and optional boot coverage', 'Preferred colour and surface finish', 'Cleaning priorities and existing floor treatment'],
    questions: [
      { question: 'What is the difference between 3D and 7D mats?', answer: 'The names vary by supplier. Compare the available products by construction, coverage, edge design, removable layers, cleaning instructions and fitment rather than choosing only by the label.' },
      { question: 'Can I preview mat colours in my cabin?', answer: 'Use the cabin slider on our homepage to compare the look. Visit us to see the actual colours and textures, and check the options available for your car.' },
      { question: 'How do I get a price for car matting?', answer: 'Send the vehicle details and tell us which areas you want covered. The quote depends on the mat set, material, coverage and any installation work required.' },
    ],
  },
  {
    slug: 'ambient-car-lighting', name: 'Ambient car lighting',
    title: 'Ambient Car Lighting in Hyderabad',
    description: 'Explore ambient cabin lighting with CARTUNEZ in Secunderabad, Hyderabad. Plan dashboard, door and footwell lighting around your car and style.',
    eyebrow: '05 / AMBIENT LIGHTING', headline: 'Choose your colour and brightness.',
    answer: 'Plan ambient car lighting with CARTUNEZ in Secunderabad, Hyderabad. Discuss the dashboard, door and footwell areas you want to illuminate, the look you prefer and the control options suitable for your car.',
    image: '/images/cabin/lighting-blue.webp', imageAlt: 'Blue ambient lighting along the dashboard and doors', chapter: 'cabin-studio',
    sections: [
      { title: 'Start with the lighting zones', text: 'A restrained dashboard accent creates a different atmosphere from lighting across the doors and footwells. Decide which zones matter before comparing kits. Bring a cabin photograph and describe whether you want a subtle line, a warm accent or a more colourful evening setting.' },
      { title: 'Ask how the chosen kit is controlled', text: 'Colour selection, dimming, presets and phone controls depend on the specific product. Ask which functions are included and how the controls will be accessed in your car. A lighting effect in the website preview represents a design idea and does not establish what a particular kit can do.' },
      { title: 'Make the installation part of the brief', text: 'Discuss trim routing, visible light points, power connections and the appearance when the lighting is switched off. Existing cabin equipment and trim design affect the proposal. Ask the team to explain the installation scope and applicable product and installation warranty terms before agreeing to the work.' },
    ],
    checklist: ['Vehicle details and cabin photographs', 'Dashboard, door and footwell zones required', 'Preferred colours and brightness', 'Desired controls and existing cabin accessories'],
    questions: [
      { question: 'Can I see a before-and-after lighting preview?', answer: 'Try the lighting slider on our homepage. Switch between blue, red and amber, then ask us about the kits and installation options for your cabin.' },
      { question: 'Can the ambient lights change colour?', answer: 'Some kits provide selectable colours or presets, while others have more limited controls. Confirm the exact product and its supported functions in your quote.' },
      { question: 'Can lighting be installed with seat covers and mats?', answer: 'Request a coordinated interior consultation so the colours, matting and lighting can be considered together. The team confirms the scope and product compatibility for each part of the installation.' },
    ],
  },
  {
    slug: 'performance-utility', name: 'Performance & utility accessories',
    title: 'Car Utility & Performance Accessories in Hyderabad',
    description: 'Discuss roof systems, lighting, intake and exhaust upgrade options at CARTUNEZ, Secunderabad. Plan accessories around your vehicle and intended use.',
    eyebrow: '06 / PURPOSE & PERSONALITY', headline: 'For your kind of drive.',
    answer: 'Discuss performance and utility accessory options with CARTUNEZ in Secunderabad, Hyderabad. Start with how you use the car, then assess suitable roof systems, practical accessories, lighting or intake and exhaust directions for that specific vehicle.',
    image: 'utility', imageAlt: 'SUV with a roof basket and driving lights', chapter: 'performance',
    sections: [
      { title: 'Plan around the journey', text: 'Extra luggage, weekend travel and everyday practicality create different accessory requirements. Explain what you need to carry, how often you use it and whether existing accessories are already fitted. A useful consultation starts with the job the accessory needs to do, rather than its appearance alone.' },
      { title: 'Check the mounting and product specification', text: 'For a roof system, discuss the vehicle roof type, mounting arrangement, product dimensions and applicable limits. For lighting or other electrical accessories, include your existing setup in the brief. The team needs the exact vehicle and proposed product before confirming a suitable installation.' },
      { title: 'Discuss performance changes individually', text: 'Intake, exhaust and other performance enquiries need a vehicle-specific assessment. Ask what is being changed, what supporting work is required and what evidence supports any claimed result. Compatibility, intended use and applicable requirements should be discussed before proceeding. The website does not promise horsepower gains or acceleration improvements.' },
    ],
    checklist: ['Exact vehicle and existing modifications', 'Intended use and practical requirements', 'Accessory or reference product details', 'Questions about fitment, limits and warranty terms'],
    questions: [
      { question: 'Can I add a roof rack or basket to my car?', answer: 'It depends on the roof, mounting points, selected system and vehicle-specific limits. Send your model, year, roof photographs and carrying requirements for an assessment.' },
      { question: 'Do you guarantee a performance increase?', answer: 'No performance increase is promised by this website. Any proposed modification, expected outcome and supporting evidence need to be discussed for the particular vehicle and product.' },
      { question: 'How do I check stock and pricing?', answer: 'Call or WhatsApp us with your car details and the accessories you need. We’ll check current stock, fitment and pricing for you.' },
    ],
  },
];

export function findService(slug: string) { return services.find(service => service.slug === slug); }
