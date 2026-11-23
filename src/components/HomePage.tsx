import { Hero } from './Hero';
import { About, Contact, Experience, SelectedWork, Skills } from './Sections';

export function HomePage() {
  return (
    <main id="main-content" tabIndex={-1}>
      <Hero />
      <SelectedWork />
      <Skills />
      <About />
      <Experience />
      <Contact />
    </main>
  );
}
