import { contactLinks } from "../../constants/index.js";

const year = new Date().getFullYear();

const Contact = () => {
  return (
    <section id="contact">
      <div className="content">
        <p className="eyebrow">Get in touch</p>
        <h2>Let&apos;s build something together</h2>
        <p className="lead">
          Have a project in mind or want to talk about agentic AI? Connect with
          me on LinkedIn or book a time that suits you.
        </p>

        <div className="links">
          {contactLinks.map(({ label, url }) => (
            <a
              key={label}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {label} ↗
            </a>
          ))}
        </div>
      </div>

      <footer>© {year} Riches Digital Ventures</footer>
    </section>
  );
};

export default Contact;
