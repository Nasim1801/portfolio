import { Header } from './components/Header';
import {
  Contact,
  Experience,
  Footer,
  Hero,
  PhysioProject,
  ProjectFeature,
  ShipStory,
  Skills,
  StatsStrip,
  Studio,
  TeamProjects,
} from './components/Sections';
import { content } from './data/content';
import styles from './styles/site.module.css';

export default function App() {
  return (
    <>
      <a className={styles.skipLink} href="#main-content">
        Skip to content
      </a>
      <Header />
      <main id="main-content">
        <Hero />
        <StatsStrip />
        <ProjectFeature project={content.projects[0]} />
        <ShipStory />
        <PhysioProject />
        <ProjectFeature project={content.projects[1]} reversed />
        <Studio />
        <TeamProjects />
        <Experience />
        <Skills />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
