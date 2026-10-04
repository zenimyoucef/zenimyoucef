import Navigation from "./components/Navigation";
import Hero from "./components/Hero";
import { Work, Playground } from "./components/Projects";
import About from "./components/About";
import Process from "./components/Process";
import Contact from "./components/Contact";
import useReveal from "./hooks/useReveal";
import usePrintMotion from "./hooks/usePrintMotion";
import TechStrip from "./components/TechStrip";

export default function App() {
  useReveal();
  usePrintMotion();
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <div id="top" />
      <Navigation />
      <main id="main" tabIndex={-1}>
        <Hero />
        <TechStrip />
        <div className="project-spread wrap">
          <Work />
          <Playground />
        </div>
        <div className="reflection-spread wrap">
          <About />
          <figure className="reflection-landscape" aria-hidden="true">
            <img src={`${import.meta.env.BASE_URL}images/mountain-640.webp`} width="640" height="424" alt="" loading="lazy" />
          </figure>
          <Process />
        </div>
      </main>
      <Contact />
    </>
  );
}
