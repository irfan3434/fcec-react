import Layout from './components/layout/Layout'
import Home from './pages/Home'
import About from './pages/About'
import Careers from './pages/Careers'
import Services from './pages/Services'
import ServiceDetail from './pages/ServiceDetail'
import Projects from './pages/Projects'
import ProjectDetail from './pages/ProjectDetail'
import Contact from './pages/Contact'
import PagePlaceholder from './pages/PagePlaceholder'
import NotFound from './pages/NotFound'

/*
 * One set of pages, mounted twice: at the root for English and under /ar for
 * Arabic. `LocaleProvider` reads the locale back off the URL, so the routes
 * themselves stay locale-agnostic.
 */
const pages = [
  { index: true, element: <Home /> },
  { path: 'about', element: <About /> },
  { path: 'services', element: <Services /> },
  // `slug` is the old Shopify product handle, so /services/<handle> mirrors
  // the /products/<handle> URLs the site has been publishing.
  { path: 'services/:slug', element: <ServiceDetail /> },
  { path: 'projects', element: <Projects /> },
  // Same handles the store published at /products/<handle>.
  { path: 'projects/:slug', element: <ProjectDetail /> },
  { path: 'careers', element: <Careers /> },
  { path: 'contact', element: <Contact /> },
  // Linked from the footer. The theme pointed all three at `href="#"`;
  // the copy for them only exists in Shopify admin.
  { path: 'terms', element: <PagePlaceholder titleKey="footer_headings_text_15" /> },
  { path: 'disclaimer', element: <PagePlaceholder titleKey="footer_headings_text_16" /> },
  { path: 'privacy', element: <PagePlaceholder titleKey="footer_headings_text_17" /> },
  { path: '*', element: <NotFound /> },
]

export const routes = [
  {
    element: <Layout />,
    children: [
      { path: '/', children: pages },
      { path: '/ar', children: pages },
    ],
  },
]
