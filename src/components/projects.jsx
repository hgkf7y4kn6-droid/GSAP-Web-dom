import { projectLists } from "../../constants/index.js";

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
            {projectLists.map((project) => (
              <li key={project.name}>
                <div className="md:me-28">
                  <h3>{project.name}</h3>
                  <p>{project.summary}</p>
                </div>
                <span className="line" aria-hidden="true" />
                <a href={project.url} target="_blank" rel="noopener noreferrer">
                  View repo ↗
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
