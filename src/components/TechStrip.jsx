import { techStack } from "../data/techStack";

export default function TechStrip() {
  return (
    <section className="tech-strip" aria-labelledby="tech-heading">
      <div className="tech-inner wrap">
        <div className="tech-intro">
          <h2 id="tech-heading">My tech stack</h2>
          <p>
            Tools I use to build
            <br />
            thoughtful web experiences.
          </p>
        </div>
        <ul className="tech-list">
          {techStack.map(([label, icon, color, note]) => (
            <li key={label}>
              <span
                className="tech-icon"
                style={{
                  "--icon-color": color,
                  "--icon-url": `url(${import.meta.env.BASE_URL}icons/${icon}.svg)`,
                }}
                aria-hidden="true"
              />
              <span>{label}</span>
              {note && <small>{note}</small>}
            </li>
          ))}
        </ul>
        <p className="tech-aside">
          Same tools.
          <br />
          Different worlds.
        </p>
      </div>
    </section>
  );
}
