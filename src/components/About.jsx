import { SectionLabel } from "./Editorial";
import { skills } from "../data/skills";

export default function About() {
  return (
    <section
      className="about-section wrap section-space"
      id="about"
      aria-labelledby="about-heading"
    >
      <SectionLabel number="04">Behind the pixels</SectionLabel>
      <div className="about-intro" data-reveal>
        <h2 id="about-heading">
          I care about
          <br />
          clean code,
          <br />
          beautiful interfaces
          <br />
          and a <em>kinder internet.</em>
        </h2>
        <div className="about-copy">
          <p className="about-statement">
            I care about clean code, beautiful interfaces and digital products
            that feel considered.
          </p>
          <p>
            I enjoy working where design and engineering meet — taking an idea
            from visual concept to functional product.
          </p>
          <p>
            Sometimes that means an online store. Sometimes it’s a small
            experiment. The attention to detail stays the same.
          </p>
        </div>
      </div>
      <details className="tools-section">
        <summary>
          Explore my working toolkit <span aria-hidden="true">+</span>
        </summary>
        <div className="tools-heading">
          <h3>Tools I use to build.</h3>
          <span className="small-label">A working toolkit</span>
        </div>
        <div className="tools-grid">
          {skills.map((group, index) => (
            <div className="tool-group" key={group.title} data-reveal>
              <h4>
                <span className="accent">0{index + 1}</span> {group.title}
              </h4>
              <ul>
                {group.items.map((item) => (
                  <li key={item}>
                    {item.includes("(learning)") ? (
                      <>
                        Next.js <span className="learning-note">learning</span>
                      </>
                    ) : (
                      item
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </details>
    </section>
  );
}
