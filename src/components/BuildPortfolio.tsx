import { verifiedProjects } from '@/lib/projects';
import { whatsappUrl } from '@/lib/site';
import { BeforeAfter } from './BeforeAfter';
import { Arrow } from './Primitives';

export function BuildPortfolio() {
  if (!verifiedProjects.length) return <div className="mw-project-empty section-gutter"><span>LET’S PLAN YOUR BUILD</span><p>Tell us what you drive and what you’d like to change.<br />Save your choices above, then send them to us for a quote.</p></div>;
  return <div className="mw-verified-projects section-gutter">{verifiedProjects.filter(project => project.verified).map(project => <article key={project.id}>{project.beforeImage && project.afterImage ? <BeforeAfter image={project.image} beforeImage={project.beforeImage} afterImage={project.afterImage} concept={false} muteBase={false} alt={project.imageAlt} /> : <img src={project.image} alt={project.imageAlt} width="1200" height="800" loading="lazy" />}<p className="mw-label">{project.vehicle} / {project.categories.join(' + ')}</p><h3>{project.title}</h3><p>{project.story}</p><a className="r-link" href={whatsappUrl(`Hi CARTUNEZ! I saw your ${project.vehicle} project: ${project.title}. Can we discuss a similar direction for my car?`)} target="_blank" rel="noopener noreferrer">Discuss a similar build <Arrow /></a></article>)}</div>;
}
