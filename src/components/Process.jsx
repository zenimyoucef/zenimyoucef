import { SectionLabel } from "./Editorial";
const phases = [
  { title: "Understand", description: "Problems & people." },
  { title: "Plan", description: "Structure & technical direction." },
  { title: "Build", description: "Clean, scalable, intentional code." },
  { title: "Iterate", description: "Launch, learn, improve." },
];

export default function Process() {
  return (
    <section
      className="process-section wrap section-space"
      id="process"
      aria-labelledby="process-heading"
    >
      <SectionLabel number="05">My approach</SectionLabel>
      <h2 id="process-heading" data-reveal>
        Thoughtful
        <br className="mobile-break" /> from the start.
      </h2>
      <ol className="process-index" data-reveal>
        {phases.map((phase, index) => (
          <li key={phase.title}>
            <span className="phase-number">0{index + 1}</span>
            <span className="phase-node" aria-hidden="true" />
            <div>
              <h3>{phase.title}</h3>
              <p>{phase.description}</p>
            </div>
          </li>
        ))}
      </ol>
      <p className="process-note">build. refine. repeat.</p>
    </section>
  );
}
