import { createRoot, hydrateRoot } from 'react-dom/client';
import { renderRoute } from './routes';
import { routePath } from './utils/links';
import './styles/global.css';

const root = document.getElementById('root');
if (root) {
  const route = routePath();
  void renderRoute(route)
    .then((page) => {
      if (root.hasChildNodes()) hydrateRoot(root, page);
      else createRoot(root).render(page);
    })
    .catch((error: unknown) => {
      // Keep the static navigation and image links usable if a chunk fails.
      delete document.documentElement.dataset.js;
      console.error('Could not load interactive portfolio controls.', error);
    });
}
