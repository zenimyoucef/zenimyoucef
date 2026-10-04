import { experiments, liveProjects, upcomingProjects } from "../data/projects";
import { Arrow, ExternalLink, ProjectImage, SectionLabel } from "./Editorial";
import ProjectGallery from "./ProjectGallery";

function ProjectDetails({ project }) {
  if (!project.longDescription && !project.capabilities?.length) return null;
  return (
    <details className="project-reading">
      <summary>Project notes <span aria-hidden="true">+</span></summary>
      <div className="project-reading-content">
        {project.longDescription && <p>{project.longDescription}</p>}
        {!!project.capabilities?.length && <p><span className="small-label">Built around</span>{project.capabilities.join(" · ")}</p>}
        {project.role && <p><span className="small-label">Role</span>{project.role}</p>}
      </div>
    </details>
  );
}

function LiveSlide({ project }) {
  return (
    <article className="project-feature live-slide" data-status={project.status} data-project={project.id} data-tone={project.tone || "neutral"} data-featured={project.featured}>
      <ExternalLink href={project.liveUrl} className="featured-media live-slide-media" aria-label={`Visit ${project.title}`}>
        <div className="live-image-frame"><ProjectImage project={project} featured /></div>
        <span className="live-media-caption">A view from the live site <span aria-hidden="true">↗</span></span>
      </ExternalLink>
      <div className="live-slide-copy">
        <p className="live-slide-index"><span>{String(project.order).padStart(2, "0")}</span> <span className="status-dot" /> Live &amp; usable</p>
        <p className="live-slide-category">{project.category}</p>
        <h3>{project.title}</h3>
        <p className="live-slide-description">{project.summary || project.description}</p>
        <p className="live-slide-stack">{project.stack.join(" / ")}</p>
        <div className="live-slide-actions">
          <ExternalLink href={project.liveUrl} className="text-link feature-cta">Visit live site <Arrow /></ExternalLink>
          <ProjectDetails project={project} />
        </div>
      </div>
    </article>
  );
}

function UpcomingCard({ project }) {
  return (
    <article className="upcoming-card archive-card" data-status="upcoming">
      <div className="archive-empty-print" aria-hidden="true"><span>↳</span><em>A page still<br />taking shape.</em></div>
      <p className="small-label">Coming soon</p>
      <h3>{project.title}</h3>
      <p>{project.description}</p>
      <span className="upcoming-note">Playground / In progress</span>
    </article>
  );
}

function ProjectCard({ project }) {
  return (
    <article className={`project-card archive-card project-card--${project.id}`} data-status={project.status} data-project={project.id} data-crop={project.crop || "standard"}>
      <ExternalLink href={project.liveUrl} className="project-media" aria-label={`View ${project.title} demo`}>
        <ProjectImage project={project} />
        <span className="media-view">Explore demo <Arrow /></span>
      </ExternalLink>
      <div className="archive-heading">
        <p className="small-label">Field study / {String(project.order).padStart(2, "0")}</p>
        <h3>{project.title}</h3>
      </div>
      <p className="archive-category">{project.category}</p>
      <p className="archive-description">{project.summary || project.description}</p>
      <p className="archive-stack">{project.stack.join(" / ")}</p>
      <div className="archive-actions">
        <ExternalLink href={project.liveUrl} className="text-link">View demo <Arrow /></ExternalLink>
        <ProjectDetails project={project} />
      </div>
    </article>
  );
}

export function Work() {
  const upcoming = upcomingProjects.filter((project) => project.collection === "live");
  return (
    <section className="work-section wrap section-space" id="work" aria-labelledby="work-heading">
      <SectionLabel number="02">Selected work</SectionLabel>
      <div className="section-heading" data-reveal>
        <h2 id="work-heading">Live &amp; Usable<span className="accent">.</span></h2>
        <p>Real projects. <span className="serif-italic">Built to be used.</span></p>
      </div>
      <ProjectGallery id="live-gallery" label="Live projects" variant="live" itemLabel="live project" items={liveProjects} renderItem={(project) => <LiveSlide project={project} />} />
      {upcoming.map((project, index) => <div className="collection-next" data-status="upcoming" key={project.id}><span className="small-label">{String(liveProjects.length + index + 1).padStart(2, "0")} / Next chapter</span><p>{project.title} <span>— Coming soon.</span></p></div>)}
    </section>
  );
}

export function Playground() {
  const collection = [...experiments, ...upcomingProjects.filter((project) => project.collection === "playground")];
  return (
    <section className="playground-section wrap section-space" id="playground" aria-labelledby="playground-heading">
      <SectionLabel number="03">Playground / Hobby projects</SectionLabel>
      <div className="section-heading playground-heading" data-reveal>
        <h2 id="playground-heading">A little room to <em>play.</em></h2>
        <p>Creative experiments, <span className="serif-italic">side projects and ideas.</span></p>
      </div>
      <ProjectGallery id="playground-gallery" label="Playground collection" variant="archive" itemLabel="experiment" items={collection} renderItem={(project) => project.status === "upcoming" ? <UpcomingCard project={project} /> : <ProjectCard project={project} />} />
      <p className="playground-note"><span aria-hidden="true">↳</span> some ideas deserve to exist just because.</p>
    </section>
  );
}
