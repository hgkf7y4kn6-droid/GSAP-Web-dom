import { lovedProjects, projectLists } from "../../constants/index.js";

const Projects = () => {
  return (
    <section id="projects" className="noisy">
      <img
        src="/images/softwareprojects.png"
        alt="left software projects"
        id="lsp"
      />
      <img
        src="/images/softwareprojects.png"
        alt="right software projects"
        id="rsp"
      />

      <div className="list">
        <div className="popular">
          <h2>Most popular projects:</h2>

          <ul>
            {projectLists.map(({ name, summary, url, linkLabel = "View repo" }) => (
              <li key={name}>
                <div className="md:me-28">
                  <h3>{name}</h3>
                  <p>{summary}</p>
                </div>
                <span className="line" aria-hidden="true" />
                <a href={url} target="_blank" rel="noopener noreferrer">
                  {linkLabel} ↗
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="loved">
          <h2>Most loved projects:</h2>

          <ul>
            {lovedProjects.map(({ name, summary, url, linkLabel = "View repo" }) => (
              <li key={name}>
                <div className="md:me-28">
                  <h3>{name}</h3>
                  <p>{summary}</p>
                </div>
                <span className="line" aria-hidden="true" />
                <a href={url} target="_blank" rel="noopener noreferrer">
                  {linkLabel} ↗
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Projects;
