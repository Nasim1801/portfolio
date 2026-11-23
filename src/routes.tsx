import { findCaseStudy } from './data/content';
import { NotFoundPage, SiteLayout } from './App';

export async function renderRoute(route: string) {
  const project = /^projects\/([^/]+)$/.exec(route);
  const study = project ? findCaseStudy(project[1]) : undefined;

  if (study) {
    const { CaseStudyPage } = await import('./components/CaseStudyPage');
    return (
      <SiteLayout route={route}>
        <CaseStudyPage study={study} />
      </SiteLayout>
    );
  }
  if (route === 'lab') {
    const { EngineeringLabPage } = await import('./components/EngineeringLabPage');
    return (
      <SiteLayout route={route}>
        <EngineeringLabPage />
      </SiteLayout>
    );
  }
  if (route === '' || route === 'index.html') {
    const { HomePage } = await import('./components/HomePage');
    return (
      <SiteLayout route="">
        <HomePage />
      </SiteLayout>
    );
  }
  return (
    <SiteLayout route={route}>
      <NotFoundPage />
    </SiteLayout>
  );
}
