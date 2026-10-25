export default function MyProjects() {
  return <section className="selected-work" aria-labelledby="selected-work-heading">
    <header className="portfolio-section-heading">
      <h2 id="selected-work-heading" className="font-archivo">PROJECTS</h2>
    </header>
    <article className="work-composition work-single" aria-labelledby="airside-machine-heading">
      <figure className="work-preview-media work-preview-screenshot" data-ui="airside-machine-preview">
        <img src="/photos/projects/airside-machine.jpg" alt="Airside Machine aircraft marketplace, with buy and lease controls over the world map" width="1440" height="900" loading="lazy" />
      </figure>
      <div className="work-preview-copy">
        <h3 id="airside-machine-heading">Airside Machine</h3>
        <p>A real-time airline management simulation built with Python, JavaScript, and SQLite. Grow a carrier from a single hub: buy or lease aircraft, set fares, plan weekly schedules, and compete with AI airlines for gates, runway slots, and passengers. A browser-based world map brings the network to life, while the simulation handles demand, fuel costs, loans, and weekly financial settlements.</p>
        <a className="work-source-link" href="https://github.com/quanquejztr/airside_machine" target="_blank" rel="noopener noreferrer">GitHub</a>
        <p className="work-map-credit">Map data © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap contributors</a></p>
      </div>
    </article>
  </section>;
}
