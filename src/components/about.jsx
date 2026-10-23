import {
  aboutClosing,
  aboutHighlights,
  aboutParagraphs,
} from "../../constants/index.js";

const About = () => {
  const [lead, ...body] = aboutParagraphs;

  return (
    <section id="about" className="noisy">
      <div className="container mx-auto grid gap-12 px-5 lg:grid-cols-[1fr_1.6fr] lg:gap-20">
        <aside className="intro">
          <p className="eyebrow">About Me</p>
          <h2>From the sales floor to shipping software</h2>

          <dl className="highlights">
            {aboutHighlights.map(({ value, label }) => (
              <div key={label}>
                <dt>{value}</dt>
                <dd>{label}</dd>
              </div>
            ))}
          </dl>
        </aside>

        <div className="bio">
          <p className="lead">{lead}</p>
          {body.map((paragraph) => (
            <p key={paragraph.slice(0, 24)}>{paragraph}</p>
          ))}
          <p className="closing">
            <a href="#contact">{aboutClosing}</a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;
