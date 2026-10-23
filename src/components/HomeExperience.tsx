'use client';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import dynamic from 'next/dynamic';
import { ArrowDown, Check, Headphones, MessageCircle, Navigation, Phone, RotateCcw, SlidersHorizontal } from 'lucide-react';
import { useMotion } from './MotionProvider';
import { useScrollDirector } from '@/hooks/useScrollDirector';
import { useSplitText } from '@/hooks/useSplitText';
import { Arrow, LineHeading, Magnetic, TransitionLink } from './Primitives';
import { Footer } from './Footer';
import { site, whatsappUrl } from '@/lib/site';
import { useBuild } from './BuildProvider';
import { enquiryMessage } from '@/lib/build';
import { BuildPortfolio } from './BuildPortfolio';
import MidnightWorkshop from './MidnightWorkshop';
import { CampaignImage } from './CampaignImage';
import { SignatureStory } from './SignatureStory';
import { CabinScrollStory } from './CabinScrollStory';
import type { ReceiverApp } from './ReceiverDashboards';

const GarageWorld = dynamic(() => import('./GarageWorld'), { ssr: false });
const InfotainmentDemo = dynamic(() => import('./InfotainmentDemo'));
const CabinStudio = dynamic(() => import('./CabinStudio'));

export function HomeExperience({ serviceContent }: { serviceContent: ReactNode }) {
  const root = useRef<HTMLElement>(null);
  const { full } = useMotion();
  const { build, toggle } = useBuild();
  const [audioAwake, setAudioAwake] = useState(false);
  const [screenRequest, setScreenRequest] = useState<{ app: ReceiverApp; id: number } | null>(null);
  const statement = useSplitText('Some cars get you there. Yours should make you feel something.');
  useScrollDirector(root);
  useEffect(() => {
    if (audioAwake) return;
    if (new URLSearchParams(location.search).get('screen') === 'connect') { setAudioAwake(true); return; }
    const target = document.getElementById('audio'); if (!target) return;
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setAudioAwake(true); observer.disconnect(); } }, { rootMargin: '700px 0px' });
    observer.observe(target); return () => observer.disconnect();
  }, [audioAwake]);
  const openScreen = (app: ReceiverApp) => { setAudioAwake(true); setScreenRequest(value => ({ app, id: (value?.id ?? 0) + 1 })); };
  const quote = whatsappUrl(enquiryMessage(build));

  return <main className="r-site v8-site v9-site v10-site v11-site" ref={root} id="main">
    {full && <GarageWorld />}
    <section className="v8-hero" aria-labelledby="hero-title">
      <div className="v10-hero-stage" role="img" aria-label={full ? 'BMW M6 GT3 in a three-dimensional midnight studio. Scroll to orbit from the front, through the side, to the rear.' : 'BMW M6 GT3 reference car in the midnight studio.'}>
        <img className="v10-hero-poster" src="/images/bmw-studio-poster.webp" width="1280" height="720" alt="" fetchPriority="high" />
        <div className="v10-hero-world" data-world-slot="hero" aria-hidden="true" />
      </div>
      <div className="v10-shot-label" aria-hidden="true"><span>BMW M6 GT3</span><b data-hero-shot>01 / THE REVEAL</b><i /></div>
      {full && <button className="v11-replay" aria-label="Replay headlight ignition" onClick={() => window.dispatchEvent(new Event('cartunez:reignite'))}><RotateCcw size={14} /><span>Replay ignition</span></button>}
      <div className="v10-hero-orbit section-gutter" aria-hidden="true"><span>BUILT TO</span><span>STAND APART<span className="red">.</span></span></div>
      <div className="v8-hero-shade" aria-hidden="true" />
      <div className="v8-hero-content section-gutter"><p className="v8-label"><i />CARTUNEZ / THE MIDNIGHT WORKSHOP</p><h1 id="hero-title" aria-label="Make it yours."><span className="v8-hero-line"><span>MAKE IT</span></span><span className="v8-hero-line"><span>YOURS<span className="red">.</span></span></span></h1><p className="v8-hero-description">More than the car you drive.<br />The way you choose to arrive.</p><div className="v8-hero-actions"><Magnetic><a className="v8-button" href="#craft">Explore the experience <Arrow size={21} /></a></Magnetic><a className="v8-text-link" href="#workshop">Build your own direction <Arrow size={18} /></a></div></div>
      <div className="v9-hero-after section-gutter" aria-hidden="true"><span>EVERY ANGLE.</span><span>YOUR SIGNATURE<span className="red">.</span></span></div><div className="v8-hero-bottom section-gutter"><span className="v9-hero-meter" aria-hidden="true"><i /></span><a href="#intro"><span className="v8-scroll-icon"><ArrowDown size={17} /></span>SCROLL TO EXPLORE EVERY ANGLE</a><span>FORM. FEEL. FREQUENCY.<small data-hero-status>BMW M6 GT3 / REFERENCE STUDY</small></span><span className="v8-hero-edition">EST. IN INDIVIDUALITY<br /><b>INDIA / AFTER HOURS</b></span></div>
    </section>

    <section className="v8-intro section-gutter" id="intro" aria-labelledby="intro-title"><p className="v8-label">PERSONAL BY DESIGN / 01</p><div><h2 id="intro-title" aria-label="Some cars get you there. Yours should make you feel something.">{statement}</h2><div className="v8-intro-bottom"><span>YOUR CAR.<br /><b>YOUR SIGNATURE.</b></span><p>From the first impression to the smallest detail. Shape a car that feels unmistakably like you.</p></div></div></section>
    <nav className="v8-directory section-gutter" id="craft" aria-label="Explore customization experiences">{[{ number: '01', title: 'Body & stance', href: '#bodykits' }, { number: '02', title: 'Cabin & comfort', href: '#interiors' }, { number: '03', title: 'Sound & technology', href: '#audio' }, { number: '04', title: 'Performance & utility', href: '#performance' }].map(item => <a href={item.href} key={item.number}><small>{item.number}</small><span>{item.title}</span><Arrow size={20} /></a>)}</nav>

    <SignatureStory />

    <section className="v8-interior section-gutter" id="interiors" aria-labelledby="interior-title"><header className="v8-section-heading"><div><p className="v8-label">02 / THE INSIDE STORY</p><h2 id="interior-title"><LineHeading>A DIFFERENT</LineHeading><LineHeading>KIND OF FEELING<span className="red">.</span></LineHeading></h2></div><p>The place you return to.<br />Make every touch feel considered.</p></header><div className="v8-interior-layout"><figure className="v8-interior-main" data-v8-parallax><CampaignImage name="interior" sizes="(max-width: 760px) 100vw, 65vw" alt="Espresso leather and black Alcantara seating with warm ambient trim, generated cabin design concept" /><figcaption><span>ESPRESSO / ALCANTARA / WARM LIGHT</span><span>INTERIOR CONCEPT</span></figcaption></figure><aside className="v8-material-story"><p>Texture you notice.<br />Details you keep discovering.</p><figure className="v8-stitch-image" data-v8-parallax><CampaignImage name="stitch" sizes="(max-width: 760px) 65vw, 28vw" alt="Macro of espresso leather, perforated Alcantara and champagne stitching, generated material study" /><figcaption>THE FINISH IS THE FEELING.</figcaption></figure><a className="v8-text-link" href="#cabin-studio">Now compare matting & lighting <Arrow /></a></aside></div><p className="v8-fine-print">Generated material and cabin studies. Actual finish, product choice and fit are confirmed for your vehicle.</p></section>

    <CabinScrollStory />
    <CabinStudio />

    <section className="r-audio v8-audio section-gutter" id="audio" aria-labelledby="audio-title"><header className="v8-audio-header"><div><p className="v8-label">03 / SOUND & TECHNOLOGY</p><h2 id="audio-title"><LineHeading>YOUR WORLD.</LineHeading><LineHeading>TURNED UP<span className="red">.</span></LineHeading></h2><p>A favourite track. A familiar voice.<br />A better way to connect with every drive.</p><span className="v8-partner">Pioneer<small>EXPLORE THE RECEIVER EXPERIENCE</small></span></div><figure className="v8-audio-photo" data-v8-parallax><CampaignImage name="audio" sizes="(max-width: 760px) 100vw, 50vw" alt="Precision speaker cone and stitched door trim, generated sound-system design concept" /><div className="v9-sound-waves" aria-hidden="true"><span /><span /><span /></div><figcaption>PRECISION YOU CAN FEEL / DESIGN CONCEPT</figcaption></figure></header><div className="r-audio-stage"><span className="v9-receiver-halo" aria-hidden="true" /><div className="audio-visual r-receiver-stage">{audioAwake ? <InfotainmentDemo request={screenRequest} /> : <div className="v8-receiver-placeholder"><span>Pioneer</span><h3>YOUR DRIVE.<br />CONNECTED.</h3><p>Interactive receiver preview.<br />Sound starts when you press Play.</p><button onClick={() => setAudioAwake(true)}>Load the receiver experience <Arrow /></button></div>}</div><aside className="r-audio-actions"><span className="v8-label">TAKE IT FOR A TEST DRIVE</span>{[{ app: 'maps' as const, icon: Navigation, title: 'Find your way.', line: 'Explore navigation' }, { app: 'music' as const, icon: Headphones, title: 'Find your soundtrack.', line: 'Try the music player' }, { app: 'settings' as const, icon: SlidersHorizontal, title: 'Find your sweet spot.', line: 'Explore sound controls' }].map(item => <button key={item.app} onClick={() => openScreen(item.app)}><item.icon size={24} strokeWidth={1.4} /><span><b>{item.title}</b><small>{item.line}</small></span><Arrow size={18} /></button>)}<p>Representative website preview. Interface and features vary by receiver model. Maps are illustrative; pairing, FM and calls are simulated.</p><button className="v8-add-audio" aria-pressed={build.selections.includes('pioneer-receiver')} onClick={() => toggle('pioneer-receiver')}>{build.selections.includes('pioneer-receiver') ? <Check size={16} /> : '+'}{build.selections.includes('pioneer-receiver') ? 'Pioneer added to your build' : 'Add Pioneer to my build'}<Arrow size={17} /></button></aside></div><div className="v8-audio-foot"><span><i /> SOUND STARTS WITH YOU.</span><span>NAVIGATION / CONNECTION / SOUND</span></div></section>

    <section className="v8-performance section-gutter" id="performance" aria-labelledby="performance-title"><header className="v8-section-heading"><div><p className="v8-label">04 / PERFORMANCE & UTILITY</p><h2 id="performance-title"><LineHeading>FOR YOUR KIND</LineHeading><LineHeading>OF DRIVE<span className="red">.</span></LineHeading></h2></div><p>A little more purpose.<br />A reason to take the long way home.</p></header><div className="v8-performance-grid">{[{ id: 'utility-consultation', image: 'utility', title: 'Go a little further.', line: 'Roof systems, practical accessories and considered lighting. Plan around how you actually use your car.', tag: 'UTILITY / LIGHTING / EVERYDAY POSSIBILITIES', alt: 'Graphite SUV with a roof basket and driving lights in a highland landscape, generated utility concept' }, { id: 'exhaust-consultation', image: 'performance', title: 'Find your own note.', line: 'Explore exhaust and intake options with the right advice for your vehicle and road-use requirements.', tag: 'SOUND / BREATHING / SUITABILITY', alt: 'Stainless exhaust and intake components on a dark workbench, illustrative product concepts' }].map(item => <article key={item.id}><div className="v8-performance-photo" data-v8-parallax><CampaignImage name={item.image} sizes="(max-width: 760px) 100vw, 50vw" alt={item.alt} /><span>DESIGN CONCEPT</span></div><p className="v8-label">{item.tag}</p><h3>{item.title}</h3><p>{item.line}</p><button className="v8-text-link" aria-pressed={build.selections.includes(item.id)} onClick={() => toggle(item.id)}>{build.selections.includes(item.id) ? <><Check size={16} />Added to your build</> : 'Add this direction to my build'}<Arrow size={17} /></button></article>)}</div><p className="v8-fine-print">Compatibility, load limits, road-use suitability and performance require a vehicle-specific assessment. Pricing is provided by quote.</p></section>

    <div className="v8-marquee" aria-label="Personal by design"><div className="v8-marquee-track" aria-hidden="true">{[0, 1].map(i => <span key={i}>FORM <i>+</i> FEEL <i>+</i> FREQUENCY <i>+</i> CARTUNEZ <i>+</i> </span>)}</div></div>

    <section className="v8-craft section-gutter" id="why" aria-labelledby="craft-title"><header className="v8-section-heading"><div><p className="v8-label">THE CARTUNEZ WAY</p><h2 id="craft-title"><LineHeading>THE DETAILS</LineHeading><LineHeading>ARE THE DIFFERENCE<span className="red">.</span></LineHeading></h2></div><p>Good choices. Considered finishes.<br />A conversation that starts with you.</p></header><div className="v8-craft-layout"><figure data-v8-parallax><CampaignImage name="craft" sizes="(max-width: 760px) 100vw, 60vw" alt="Hands carefully aligning leather trim and materials at a workbench, generated editorial craft illustration" /><figcaption>CRAFT / MATERIAL / CONSIDERATION<small>GENERATED EDITORIAL / NOT A WORKSHOP PHOTOGRAPH</small></figcaption></figure><div className="v8-craft-copy">{[{ number: '01', title: 'Fit comes first.', text: 'Your exact make, model and year set the direction. Check compatibility before choosing the part.' }, { number: '02', title: 'The finish matters.', text: 'Discuss materials, installation and the details you will live with every day.' }, { number: '03', title: 'Know your options.', text: 'Understand the scope, pricing and applicable warranty terms before your build begins.' }].map(item => <article key={item.number} data-reveal><small>{item.number}</small><div><h3>{item.title}</h3><p>{item.text}</p></div></article>)}</div></div></section>

    <MidnightWorkshop />

    <section className="v8-builds section-gutter" id="builds" aria-labelledby="builds-title"><div><p className="v8-label">YOUR CAR / THE NEXT CHAPTER</p><h2 id="builds-title"><LineHeading>BUILT</LineHeading><LineHeading>DIFFERENT<span className="red">.</span></LineHeading></h2><TransitionLink className="v8-text-link" href="/enquire/">Start your own build brief <Arrow /></TransitionLink></div><BuildPortfolio /></section>

    {serviceContent}
    <section className="v8-questions section-gutter" aria-labelledby="questions-title"><div><p className="v8-label">BEFORE THE FIRST UPGRADE</p><h2 id="questions-title">A FEW GOOD<br />QUESTIONS<span className="red">.</span></h2></div><div>{[{ title: 'Will it fit my car?', text: 'Share your make, model and year in the workshop or enquiry form. The team confirms compatibility and installation scope before recommending a product.' }, { title: 'What will my build cost?', text: 'Save the directions you like and request a quote. The final price depends on your car, the selected products and the work required. No automatic estimate is presented here.' }, { title: 'Can I arrange a workshop visit?', text: 'Visit CARTUNEZ on S.P. Road in Secunderabad, Hyderabad. Choose a visit request in the enquiry flow or call the team to confirm timing and availability before travelling.' }].map(item => <details key={item.title}><summary>{item.title}<span aria-hidden="true">+</span></summary><p>{item.text}</p></details>)}</div></section>

    <section className="v8-closing" aria-labelledby="closing-title"><CampaignImage name="closing" alt="Silver coupe with red taillights at the threshold of a midnight atelier, generated closing campaign concept" className="v8-closing-image" /><div className="v8-closing-shade" aria-hidden="true" /><div className="v8-closing-copy section-gutter"><p className="v8-label">YOUR NEXT CHAPTER STARTS HERE.</p><h2 id="closing-title"><LineHeading>READY TO</LineHeading><LineHeading>MAKE IT YOURS<span className="red">?</span></LineHeading></h2><p>Bring the car. Bring the idea.<br />Let’s shape what comes next.</p><Magnetic><a className="v8-button" href={quote} target="_blank" rel="noopener noreferrer"><MessageCircle size={19} />Start on WhatsApp<Arrow size={21} /></a></Magnetic><div className="v8-closing-links"><TransitionLink href="/enquire/?intent=visit">Plan a workshop visit <Arrow size={16} /></TransitionLink><a href={`tel:${site.phone}`}><Phone size={15} />{site.phoneDisplay}</a></div></div><span className="v8-closing-credit">CARTUNEZ / GENERATED DESIGN VISUALISATION</span></section>
    <Footer />
  </main>;
}
