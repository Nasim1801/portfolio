/**
 * Verified portfolio content.
 *
 * Every fact here comes from the CV, the App Store listings recorded in
 * ASSET-AUDIT-V4.md, or the earlier reviewed copy. Do not add metrics,
 * employers or results without evidence. AUDIT-V5.md lists claims that
 * still need the owner's confirmation.
 */
import type { ScreenshotAsset } from './screens';
import {
  co2TrackerScreens,
  gameIcons,
  hospitalScreens,
  hospitalTestScreen,
  pathLifeScreens,
  pawLifeScreens,
  physioAiScreens,
  portfolioScreen,
  sumlumeScreens,
} from './screens';

export type FrameType = 'phone' | 'print' | 'browser' | 'desktop' | 'terminal';
export type MediaItem = ScreenshotAsset;
export type StatusTone = 'live' | 'graded' | 'progress' | 'done';

export interface LinkItem {
  label: string;
  href: string;
}

export interface CaseStudySection {
  id: string;
  heading: string;
  lead?: string;
  paragraphs?: string[];
  bullets?: string[];
  links?: LinkItem[];
}

export interface CaseStudy {
  slug: string;
  name: string;
  kind: string;
  status: string;
  tone: StatusTone;
  summary: string;
  role: string;
  icon?: MediaItem;
  media: MediaItem[];
  frame: FrameType;
  stack: string[];
  facts: { label: string; value: string }[];
  architecture: string[];
  sections: CaseStudySection[];
  links: LinkItem[];
  schemaType: 'VideoGame' | 'SoftwareApplication';
}

export interface FeaturedProject {
  slug: string;
  summary: string;
  role: string;
  stack: string[];
  /** Two screens for the card. The first is in front. */
  preview: MediaItem[];
  /** Stage colour behind the screenshots, chosen from the product artwork. */
  stage: string;
  links: LinkItem[];
  hasFullCaseStudy?: boolean;
}

export interface MoreProject {
  slug: string;
  name: string;
  kind: string;
  summary: string;
  role: string;
  stack: string[];
  thumbnail: MediaItem;
  links: LinkItem[];
}

const store = {
  pathlife: 'https://apps.apple.com/gb/app/pathlife/id6769602618',
  sumlume: 'https://apps.apple.com/gb/app/sumlume-number-match/id6799957684',
};
const physioSource = 'https://github.com/Nasim1801/physio-ai-final';
const physioRevision = `${physioSource}/blob/7dc8dbd9a4b72e7e145393d2a6cb8fc516b89f42`;
const portfolioFiles = 'https://github.com/Nasim1801/portfolio/blob/main';
const co2Prototype = {
  label: 'React prototype on GitHub',
  href: 'https://github.com/Nasim1801/co2-tracker',
};

const pathLifeStudy: CaseStudy = {
  slug: 'pathlife',
  name: 'PathLife',
  kind: 'Life simulation game for iPhone',
  status: 'Live on the App Store',
  tone: 'live',
  summary:
    'A life simulation game where each year brings choices about education, careers, relationships and money, and every choice changes what is possible later.',
  role: 'I contributed core game logic and SwiftUI interfaces to the published iOS game, I am rebuilding it for Android in React Native and TypeScript, and I designed, built and deployed the support website that cleared its App Store review.',
  icon: gameIcons.pathlife,
  media: pathLifeScreens,
  frame: 'print',
  stack: [
    'Swift',
    'SwiftUI',
    'React Native',
    'TypeScript',
    'Zustand',
    'Node.js',
    'Express',
    'SQLite',
    'Railway',
    'Cloudflare',
    'Figma',
  ],
  facts: [
    { label: 'Status', value: 'Live on the UK App Store' },
    { label: 'Current iOS version', value: '2.1.3, released 7 November 2026' },
    { label: 'Android', value: 'React Native rebuild in progress' },
    { label: 'Publisher', value: 'PathLife Studio Ltd' },
  ],
  architecture: [
    'SwiftUI dashboard applies a year or choice',
    'The updated character becomes the current session',
    'Foundation encodes the character to one local save slot',
    'At launch, the session loads the saved character if it can be decoded',
  ],
  sections: [
    {
      id: 'problem',
      heading: 'Problem and constraints',
      paragraphs: [
        'A year advance can change several parts of a life at once. Resuming a life should restore the character at the last save point, including the consequences of the choices already made.',
      ],
    },
    {
      id: 'responsibility',
      heading: 'My responsibility',
      paragraphs: [
        'I contributed SwiftUI screens and game logic, built the support site that cleared App Store review, and am rebuilding the Android version. The save flow below describes the team implementation. The available history supports my project contribution, with individual ownership of this module unverified.',
      ],
    },
    {
      id: 'decisions',
      heading: 'Technical decision',
      paragraphs: [
        'Persist a complete character snapshot at a save point. This keeps Continue simple because the app restores a single record. The trade-off is that model changes need compatible decoding and older-save fixtures, since a decode failure can make the saved life unavailable.',
      ],
    },
    {
      id: 'architecture',
      heading: 'Implementation evidence',
      paragraphs: [
        'In the inspected SwiftUI development snapshot, the dashboard hands the updated character to an observable session. The save layer encodes it as JSON and replaces one local slot. The load path decodes that slot when there is a saved life.',
      ],
    },
    {
      id: 'verification',
      heading: 'Testing and verification',
      paragraphs: [
        'A separate Swift harness ran the inspected save layer against a synthetic Codable fixture. An empty slot, save and load, replacement, and deletion passed in one process.',
        'To check the released app, use a fresh life on a test device. Advance one year, finish any pending choice, record the resulting age and visible state, then quit and relaunch. Continue should restore the same life and state.',
      ],
    },
    {
      id: 'outcome',
      heading: 'Result and limitations',
      paragraphs: [
        'The public iOS release is verifiable on the App Store. The source walkthrough covers a local 2.2 development snapshot. The Swift probe covers the storage layer in isolation. The release-level restart procedure and migration from older saves remain to be verified.',
      ],
    },
  ],
  links: [
    { label: 'View on the App Store', href: store.pathlife },
    { label: 'Visit pathlifestudio.com', href: 'https://pathlifestudio.com' },
  ],
  schemaType: 'VideoGame',
};

const sumlumeStudy: CaseStudy = {
  slug: 'sumlume',
  name: 'Sumlume',
  kind: 'Number puzzle for iPhone and iPad',
  status: 'Live on the App Store',
  tone: 'live',
  summary:
    'A number puzzle where players clear pairs that match or add up to 10, with daily challenges, achievements and personal records that give them a reason to come back.',
  role: 'Founder and developer at PathLife Studio. I lead the product design, the native iOS build and the release work.',
  icon: gameIcons.sumlume,
  media: sumlumeScreens,
  frame: 'print',
  stack: ['Swift', 'SwiftUI', 'Native iOS'],
  facts: [
    { label: 'Status', value: 'Live on the UK App Store' },
    { label: 'Current iOS version', value: '2.0.0, released 16 November 2026' },
    { label: 'Platforms', value: 'iPhone and iPad' },
    { label: 'Android', value: 'In development' },
  ],
  architecture: [
    'Read two positions and their tile values',
    'Reject missing or cleared tiles and disallowed positions',
    'Apply equal-number or make-10 rule',
    'Return an updated board without changing the input',
  ],
  sections: [
    {
      id: 'product',
      heading: 'Problem and constraints',
      paragraphs: [
        'The game’s core rule is simple to explain. Two selected numbers can match when they are equal or total 10. The portfolio’s compact playground models that rule with a smaller board and its own adjacency rule.',
      ],
    },
    {
      id: 'role',
      heading: 'My responsibility',
      paragraphs: [
        'I lead Sumlume’s product design, native SwiftUI build and App Store release. The checked code and tests below belong to the public portfolio playground.',
      ],
    },
    {
      id: 'decision',
      heading: 'Technical decision',
      paragraphs: [
        'The playground separates pair validation from the interface. Position and value checks run before clearing tiles. Returning a new board keeps an invalid move from changing game state and makes the rule testable without rendering the UI.',
      ],
    },
    {
      id: 'architecture',
      heading: 'Implementation evidence',
      paragraphs: [
        'Review found a playground edge case. Two adjacent positions past the end of the board could both return undefined and pass the equality check. The validator now requires a number in both cells before it compares them.',
      ],
      links: [
        {
          label: 'Review the portfolio rule code',
          href: `${portfolioFiles}/src/lab/sumlumeEngine.ts`,
        },
      ],
    },
    {
      id: 'verification',
      heading: 'Testing and verification',
      paragraphs: [
        'Rule tests exercise equal numbers, make-10 pairs, disallowed positions, already-cleared tiles and invalid indexes. They also check that the input board is preserved. In the Engineering Lab, clear the starting 4 and 6, then reset and confirm the board returns to its starting state.',
      ],
      links: [
        { label: 'Play the Engineering Lab board', href: 'lab/#sumlume-lab-title' },
        {
          label: 'Review the rule regression tests',
          href: `${portfolioFiles}/scripts/test-lab.ts`,
        },
      ],
    },
    {
      id: 'outcome',
      heading: 'Result and limitations',
      paragraphs: [
        'The iPhone and iPad release is live on the App Store. The reproduced defect and passing regression apply to the TypeScript playground. The game’s Swift implementation, undo and save recovery remain outside this public verification.',
      ],
    },
  ],
  links: [
    { label: 'View on the App Store', href: store.sumlume },
    { label: 'Product page', href: 'https://www.pathlifestudio.com/sumlume.html' },
  ],
  schemaType: 'VideoGame',
};

const physioStudy: CaseStudy = {
  slug: 'physio-ai',
  name: 'Physio-AI',
  kind: 'Real-time computer vision, final-year project',
  status: 'Graded A',
  tone: 'graded',
  summary:
    'A physiotherapy feedback system that watches exercise technique through an ordinary webcam and gives corrective guidance while the user is moving.',
  role: 'Individual final-year project at Brunel University London. I built the pose processing, model comparison, real-time feedback pipeline, interface and session storage.',
  media: physioAiScreens,
  frame: 'browser',
  stack: ['Python', 'MediaPipe Pose', 'scikit-learn', 'JavaScript', 'WebSockets', 'SQLite'],
  facts: [
    { label: 'Result', value: 'Grade A, BSc Computer Science' },
    { label: 'Reported project result', value: 'Random Forest, 96.23% on the project dataset' },
    { label: 'Input', value: '33 pose landmarks per frame from a standard webcam' },
    { label: 'Academic test split', value: '7,153 frame rows from one participant' },
  ],
  architecture: [
    'MediaPipe extracts body landmarks from webcam frames',
    'Python builds 24-feature pose embeddings and classifies squat form',
    'Results return to the JavaScript interface over WebSockets',
    'SQLite stores session history',
  ],
  sections: [
    {
      id: 'problem',
      heading: 'Problem and constraints',
      paragraphs: [
        'The project asked whether an ordinary webcam could give timely feedback on squat form. The research prototype used recordings from one person and classified four types of squat form.',
      ],
    },
    {
      id: 'responsibility',
      heading: 'My responsibility',
      paragraphs: [
        'For my individual final-year project I built pose processing, compared classifiers, implemented the browser and WebSocket feedback pipeline, and added session history.',
      ],
    },
    {
      id: 'decisions',
      heading: 'Technical decision',
      paragraphs: [
        'I used pose features so different classifiers could be compared on the same representation and the browser could receive a compact feedback result. The dissertation selected Random Forest after augmentation. The result depends on how the augmented frames were split.',
      ],
    },
    {
      id: 'architecture',
      heading: 'Implementation evidence',
      paragraphs: [
        'The public Python server handles the live browser stream and keeps session state. The separate retraining entry point consumes a labelled pose-feature CSV. Keeping these paths separate lets reviewers inspect the browser pipeline and the model experiment independently.',
      ],
      links: [
        { label: 'Review the WebSocket server', href: `${physioRevision}/ws_server.py` },
        {
          label: 'Review the augmentation and retraining script',
          href: `${physioRevision}/retrain_with_augmentation.py`,
        },
      ],
    },
    {
      id: 'verification',
      heading: 'Testing and verification',
      paragraphs: [
        'A local rerun used the archived augmented-feature CSV and the public retraining script. It created 35,764 rows and evaluated 7,153 held-out frame rows. Random Forest scored 96.24% in that run. The script augments before an 80/20 stratified random row split. The dissertation describes a temporal split.',
      ],
    },
    {
      id: 'outcome',
      heading: 'Result and limitations',
      paragraphs: [
        '96.23% is the academic result, and exact reproduction remains unverified. The recordings come from one person. In the rerun, 3,390 test rows shared an input-row ancestor with training. This split cannot establish accuracy for new people or independent recording sessions.',
      ],
    },
  ],
  links: [{ label: 'View source on GitHub', href: physioSource }],
  schemaType: 'SoftwareApplication',
};

const pawLifeStudy: CaseStudy = {
  slug: 'pawlife',
  name: 'PawLife',
  kind: 'Pet life simulation for mobile',
  status: 'In development',
  tone: 'progress',
  summary:
    'A pet life simulation with animal personalities, story events, minigames, relationships and a life album that persists between sessions.',
  role: 'Founder and developer at PathLife Studio. I am designing and building it from scratch in React Native and Expo.',
  icon: gameIcons.pawlife,
  media: pawLifeScreens,
  frame: 'phone',
  stack: ['React Native', 'Expo', 'TypeScript', 'Zustand', 'AsyncStorage'],
  facts: [
    { label: 'Status', value: 'In development, not released' },
    { label: 'Screenshots', value: 'Native iOS development builds, 17–18 November 2026' },
    { label: 'Publisher', value: 'PathLife Studio' },
  ],
  architecture: [
    'Expo and React Native interface',
    'Custom event engine',
    'Zustand application state',
    'AsyncStorage for results and leaderboard',
  ],
  sections: [
    {
      id: 'product',
      heading: 'Product',
      lead: 'PawLife follows a pet through care, relationships, minigames and story moments. Each animal has its own personality, so the same systems have to produce lives that feel different without becoming inconsistent.',
    },
    {
      id: 'systems',
      heading: 'Game systems',
      paragraphs: [
        'A custom event engine handles story choices, breed personalities, relationship arcs, life modifiers and the end-of-life legacy flow. Care, outings and yearly progression all feed the same simulation.',
      ],
    },
    {
      id: 'architecture',
      heading: 'Architecture',
      paragraphs: [
        'React Native, Expo and TypeScript, with Zustand for app-wide state and a custom state-based navigation system. AsyncStorage keeps shareable results and the leaderboard between sessions.',
      ],
    },
    {
      id: 'focus',
      heading: 'Current focus',
      paragraphs: [
        'Development testing covers returning to a saved life, handling story choices and carrying state from one year into the next.',
      ],
    },
    {
      id: 'lessons',
      heading: 'What I learned',
      paragraphs: [
        'A funny story choice still needs deterministic state updates, persistence and testable consequences. Writing, navigation and application state are one system.',
      ],
    },
  ],
  links: [],
  schemaType: 'VideoGame',
};

const portfolioStudy: CaseStudy = {
  slug: 'portfolio',
  name: 'This portfolio',
  kind: 'React and TypeScript web app',
  status: 'Live on GitHub Pages',
  tone: 'live',
  summary:
    'A static React portfolio with a playable make-10 board, animated project worlds, nine page routes and automated browser checks.',
  role: 'I designed and built it: visual system, components, content model, accessibility, image pipeline, metadata, tests and deployment.',
  media: [portfolioScreen],
  frame: 'browser',
  stack: ['React', 'TypeScript', 'Vite', 'CSS Modules', 'Playwright', 'GitHub Actions'],
  facts: [
    { label: 'Routes', value: '9 static pages with their own metadata' },
    { label: 'Browser checks', value: '360 to 1920 px, light and dark' },
    { label: 'Deployment', value: 'GitHub Actions to GitHub Pages' },
  ],
  architecture: [
    'Typed content and media data',
    'React components and CSS Modules',
    'Pure, tested puzzle rules',
    'Static route generation for metadata and deep links',
    'Playwright checks and GitHub Pages release',
  ],
  sections: [
    {
      id: 'goals',
      heading: 'Goals',
      lead: 'A recruiter should know who I am, what role I want and how to reach me within one screen. A hiring manager should find real evidence behind every claim.',
    },
    {
      id: 'design',
      heading: 'Design',
      paragraphs: [
        'The site is designed as a game world around engineering content. The palette comes from the games’ own art, each featured project has its own colour world, the hero opens with a level-select stage that rotates through the four featured projects, and the Sumlume project includes a playable make-10 board built on the game’s rule. Motion is hand-written CSS and a little canvas, with a calm version for visitors who prefer reduced motion.',
      ],
    },
    {
      id: 'engineering',
      heading: 'Engineering',
      bullets: [
        'Project facts, screenshots and skills live in typed data files, so the compiler checks the content structure.',
        'The puzzle rules are pure TypeScript functions with their own tests, shared by the Sumlume demo on the home page and the Engineering Lab.',
        'A build step generates WebP variants at display size, and a second step writes a static HTML page for every route.',
        'A small client router swaps pages in place, so the View Transitions API can morph a project title from the home page into its case study. Every route still exists as a static file.',
      ],
    },
    {
      id: 'accessibility',
      heading: 'Accessibility and performance',
      paragraphs: [
        'The site includes a skip link, keyboard navigation for the project selector and galleries, and support for reduced motion. Playwright checks cover keyboard paths and layout in light and dark mode.',
      ],
    },
  ],
  links: [
    { label: 'View source on GitHub', href: 'https://github.com/Nasim1801/portfolio' },
    { label: 'Open the Engineering Lab', href: 'lab/' },
  ],
  schemaType: 'SoftwareApplication',
};

const co2Study: CaseStudy = {
  slug: 'co2-tracker',
  name: 'CO2 Tracker',
  kind: 'University team project',
  status: 'Completed team project',
  tone: 'done',
  summary:
    'Look up estimated product carbon footprints by name or typed barcode. GitHub contains the React prototype.',
  role: 'For the university demo, I built the React customer interface, Spring Boot REST API and H2 persistence. I designed the customer page in Figma and was Scrum Master for Sprint 1.',
  media: co2TrackerScreens,
  frame: 'browser',
  stack: ['React', 'Spring Boot', 'REST', 'H2', 'JPA', 'Figma', 'Scrum'],
  facts: [
    { label: 'Lookup flows', value: 'Name search, typed barcode, simulated photo' },
    { label: 'Demo data', value: '12 seeded products' },
    { label: 'Public source', value: 'React prototype only' },
  ],
  architecture: [
    'Customer supplies a product name or typed barcode',
    'Spring Boot controller chooses the matching lookup',
    'JPA queries seeded H2 product records',
    'The team service records timestamped search history',
  ],
  sections: [
    {
      id: 'product',
      heading: 'Problem and constraints',
      paragraphs: [
        'The university demo let customers look up estimated carbon footprints from a seeded catalogue. The photo flow simulated a result. Barcode lookup used typed input.',
      ],
    },
    {
      id: 'responsibility',
      heading: 'My responsibility',
      paragraphs: [
        'I built the React customer interface and worked on the Spring Boot lookup and H2 history integration. My coursework branch documents the name, barcode and upload flows. This was a team submission.',
      ],
    },
    {
      id: 'decision',
      heading: 'Technical decision',
      paragraphs: [
        'The controller used case-insensitive exact names to support multiple seeded matches and a separate barcode lookup for one product. This keeps the small catalogue predictable. A partial name does not make a good search in this version.',
      ],
    },
    {
      id: 'architecture',
      heading: 'Implementation evidence',
      paragraphs: [
        'The publicly linked React snapshot shows the inputs and interaction prompts. The authorised local university checkout contains the Spring Boot service, the JPA repositories and timestamped H2 search-history logic.',
      ],
    },
    {
      id: 'verification',
      heading: 'Testing and verification',
      paragraphs: [
        'With the university service bound to localhost and an in-memory H2 database, the catalogue returned 12 records. A mixed-case Laptop search returned three results and a known barcode returned one. Unrecognised names and barcodes both returned HTTP 404.',
      ],
    },
    {
      id: 'outcome',
      heading: 'Result and limitations',
      paragraphs: [
        'The API observations apply to the university backend in a local test. The public repository provides the interface prototype, and the video shows the team demonstration. The backend is outside the public repository and team source stays with the coursework checkout.',
      ],
    },
  ],
  links: [
    co2Prototype,
    { label: 'Watch the university demo', href: 'https://youtu.be/2qtJxDQObb4' },
  ],
  schemaType: 'SoftwareApplication',
};

const hospitalStudy: CaseStudy = {
  slug: 'hospital-appointment-system',
  name: 'Hospital Appointment System',
  kind: 'Java desktop app, university team project',
  status: 'Completed team project',
  tone: 'done',
  summary:
    'A Swing desktop booking system for patients and staff: find a hospital, pick a date and time, confirm and manage the appointment.',
  role: 'I built the appointment booking module in Java, Swing and WindowBuilder, with JUnit tests.',
  media: [...hospitalScreens, hospitalTestScreen],
  frame: 'desktop',
  stack: ['Java', 'Swing', 'WindowBuilder', 'JUnit'],
  facts: [
    { label: 'My role', value: 'Appointment booking module and its tests' },
    { label: 'Team result', value: '10 of 11 planned requirements delivered' },
    { label: 'Testing', value: 'JUnit' },
  ],
  architecture: [
    'Hospital selection',
    'Date and time controls',
    'Booking confirmation',
    'Appointment schedule',
  ],
  sections: [
    {
      id: 'product',
      heading: 'Product',
      lead: 'Hospital search, time selection, confirmation and schedule changes in one desktop workflow. My part was the booking module and its tests.',
    },
    {
      id: 'engineering',
      heading: 'Engineering',
      paragraphs: [
        'Choosing a date and time is separate from confirming it, so the user can review the appointment first. The gallery pairs a fictional booking with the passing JUnit test for the module.',
      ],
    },
  ],
  links: [
    {
      label: 'View source on GitHub',
      href: 'https://github.com/Nasim1801/hospital-appointment-system',
    },
  ],
  schemaType: 'SoftwareApplication',
};

const caseStudies = [
  pathLifeStudy,
  sumlumeStudy,
  physioStudy,
  pawLifeStudy,
  co2Study,
  hospitalStudy,
  portfolioStudy,
] satisfies CaseStudy[];

export const content = {
  identity: {
    name: 'Nasim Mosayebi',
    role: 'Graduate Software Engineer',
    title: 'Nasim Mosayebi | Graduate Software Engineer · iOS and Mobile | London',
    description:
      'Nasim Mosayebi is a Computer Science graduate in London specialising in Swift, SwiftUI and mobile development. Explore two App Store releases and an individual computer vision project.',
    location: 'London',
  },
  nav: [
    { label: 'Work', href: '#work' },
    { label: 'About', href: '#about' },
    { label: 'Experience', href: '#experience' },
    { label: 'Contact', href: '#contact' },
  ],
  links: {
    github: 'https://github.com/Nasim1801',
    linkedin: 'https://www.linkedin.com/in/nasim-mosayebi',
    studio: 'https://pathlifestudio.com',
    email: 'n.mosayebee@gmail.com',
    cv: 'Nasim-Mosayebi-CV.pdf',
  },
  hero: {
    value:
      'I build mobile apps with Swift, SwiftUI and React Native. At PathLife Studio, I lead Sumlume’s iOS development and release work and contribute to PathLife.',
    availability: 'Open to graduate and junior roles',
  },
  /** Achievement badges backed by the App Store listings and CV. */
  achievements: [
    { mark: '2', title: '2 games live', detail: 'on the App Store' },
    { mark: 'A', title: 'Grade A', detail: 'Physio-AI' },
    { mark: 'BSc', title: 'Computer Science', detail: 'Brunel · 2:1' },
  ],
  workEvidence: [
    { label: 'PathLife on the App Store', href: store.pathlife },
    { label: 'Sumlume on the App Store', href: store.sumlume },
    { label: 'Physio-AI source', href: physioSource },
  ],
  levels: [
    { id: 'top', label: 'Start' },
    { id: 'work', label: 'Work' },
    { id: 'skills', label: 'Skills' },
    { id: 'about', label: 'About' },
    { id: 'experience', label: 'Experience' },
    { id: 'contact', label: 'Contact' },
  ],
  featured: [
    {
      slug: 'pathlife',
      summary:
        'A life simulation where every year brings new choices. I worked on the iOS game, I am rebuilding it for Android, and I built the support site that got it through App Store review.',
      role: 'iOS game logic and SwiftUI interfaces, Android rebuild, support platform',
      stack: ['SwiftUI', 'React Native', 'TypeScript', 'Node.js', 'SQLite'],
      preview: [pathLifeScreens[0], pathLifeScreens[1]],
      stage: '#cfe4f7',
      links: [{ label: 'App Store', href: store.pathlife }],
      hasFullCaseStudy: true,
    },
    {
      slug: 'sumlume',
      summary:
        'A number puzzle: clear pairs that match or make 10, with daily challenges, achievements and personal records. Version 2.0.0 shipped in November 2026.',
      role: 'Product design, native iOS build and release',
      stack: ['Swift', 'SwiftUI'],
      preview: [sumlumeScreens[0], sumlumeScreens[1]],
      stage: '#2b49b8',
      links: [{ label: 'App Store', href: store.sumlume }],
    },
    {
      slug: 'physio-ai',
      summary:
        'Real-time exercise feedback from an ordinary webcam. A Python service classifies poses, streams feedback over WebSockets and saves session history in SQLite.',
      role: 'Individual project: pose processing, model selection, real-time pipeline, interface',
      stack: ['Python', 'MediaPipe', 'scikit-learn', 'WebSockets', 'SQLite'],
      preview: [physioAiScreens[0]],
      stage: '#22302f',
      links: [{ label: 'GitHub', href: physioSource }],
      hasFullCaseStudy: true,
    },
    {
      slug: 'pawlife',
      summary:
        'A pet life simulation with personalities, story events and minigames, driven by a custom event engine and persistent state.',
      role: 'Design and development from scratch',
      stack: ['React Native', 'Expo', 'TypeScript', 'Zustand'],
      preview: [pawLifeScreens[0], pawLifeScreens[1]],
      stage: '#f1dcb8',
      links: [],
    },
  ] satisfies FeaturedProject[],
  more: [
    {
      slug: 'co2-tracker',
      name: 'CO2 Tracker',
      kind: 'Team project',
      summary: 'Product carbon-footprint lookup in a university demo.',
      role: 'React interface, Spring Boot API and H2 for the team demo. Scrum Master for Sprint 1.',
      stack: ['React', 'Spring Boot', 'H2'],
      thumbnail: co2TrackerScreens[1],
      links: [co2Prototype, { label: 'Demo video', href: 'https://youtu.be/2qtJxDQObb4' }],
    },
    {
      slug: 'hospital-appointment-system',
      name: 'Hospital Appointment System',
      kind: 'Team project',
      summary: 'Desktop booking for patients and staff.',
      role: 'Booking module in Java and Swing, with JUnit tests.',
      stack: ['Java', 'Swing', 'JUnit'],
      thumbnail: hospitalScreens[1],
      links: [
        {
          label: 'GitHub',
          href: 'https://github.com/Nasim1801/hospital-appointment-system',
        },
      ],
    },
    {
      slug: 'portfolio',
      name: 'This portfolio',
      kind: 'Personal project',
      summary: 'Static React site with a playable puzzle and automated browser checks.',
      role: 'Design, build, tests and deployment.',
      stack: ['React', 'TypeScript', 'Playwright'],
      thumbnail: portfolioScreen,
      links: [{ label: 'GitHub', href: 'https://github.com/Nasim1801/portfolio' }],
    },
  ] satisfies MoreProject[],
  caseStudies,
  skills: [
    {
      group: 'Mobile',
      items: [
        { name: 'Swift and SwiftUI', proof: ['pathlife', 'sumlume'] },
        { name: 'React Native', proof: ['pathlife', 'pawlife'] },
        { name: 'Expo', proof: ['pawlife'] },
        { name: 'Zustand', proof: ['pathlife', 'pawlife'] },
        { name: 'App Store release', proof: ['pathlife', 'sumlume'] },
      ],
    },
    {
      group: 'Front-end',
      items: [
        { name: 'TypeScript', proof: ['pathlife', 'pawlife', 'portfolio'] },
        { name: 'React', proof: ['portfolio', 'co2-tracker'] },
        { name: 'JavaScript', proof: ['physio-ai'] },
        { name: 'HTML and CSS', proof: ['portfolio'] },
        { name: 'Figma', proof: ['pathlife', 'co2-tracker'] },
      ],
    },
    {
      group: 'Back-end and ML',
      items: [
        { name: 'Node.js and Express', proof: ['pathlife'] },
        { name: 'Java', proof: ['hospital-appointment-system', 'co2-tracker'] },
        { name: 'Spring Boot', proof: ['co2-tracker'] },
        { name: 'Python', proof: ['physio-ai'] },
        { name: 'SQLite and H2', proof: ['pathlife', 'physio-ai', 'co2-tracker'] },
        { name: 'WebSockets', proof: ['physio-ai'] },
        { name: 'MediaPipe and scikit-learn', proof: ['physio-ai'] },
      ],
    },
    {
      group: 'Tools and practice',
      items: [
        { name: 'Git and GitHub', proof: ['portfolio'] },
        { name: 'JUnit', proof: ['hospital-appointment-system'] },
        { name: 'Playwright', proof: ['portfolio'] },
        { name: 'Railway and Cloudflare', proof: ['pathlife'] },
        { name: 'Agile and Scrum', proof: ['co2-tracker'] },
      ],
    },
  ],
  about: {
    sheet: [
      { label: 'Focus', value: 'Graduate software engineering, specialising in iOS and mobile' },
      { label: 'Based in', value: 'London' },
      { label: 'Degree', value: 'BSc (Hons) Computer Science, 2:1, Brunel University London' },
      { label: 'Studio', value: 'Founder of PathLife Studio Ltd' },
      { label: 'Languages', value: 'English, Persian, German (B1), Arabic (A1)' },
    ],
    paragraphs: [
      'I’m a Computer Science graduate from Brunel University London with a 2:1. At PathLife Studio, the company I founded in London, I lead Sumlume’s native iOS build and release work, contribute to PathLife and maintain its support site.',
      'Before computer science I studied Industrial Engineering and worked in medical-device quality assurance and IT support. That is where my habits come from: understand the whole system, write decisions down, test the risky paths first, and keep the person using it in view.',
      'I speak four languages: English, Persian, German and some Arabic. I am looking for a graduate or junior role where I can bring that ownership to an experienced team.',
    ],
  },
  experience: [
    {
      date: 'Aug 2026 – Present',
      title: 'Founder and Software Developer',
      place: 'PathLife Studio Ltd, London',
      description:
        'Lead Sumlume’s iOS development and release, contribute to PathLife’s iOS app, rebuild PathLife for Android and maintain its support site.',
    },
    {
      date: 'Apr 2024 – Jun 2026',
      title: 'IT administrator, part-time',
      place: 'ATOZ Education Services, London',
      description:
        'Kept hardware, software and network systems running for staff and students, and explained fixes to non-technical users.',
    },
    {
      date: '2023 – 2026',
      title: 'BSc (Hons) Computer Science, 2:1',
      place: 'Brunel University London',
      description:
        'Final-year project Physio-AI, graded A. Foundation year in Computer Science 2022–2023.',
    },
    {
      date: 'Jan 2021 – Jan 2022',
      title: 'Quality assurance intern, regulatory compliance',
      place: 'Farsar Tejarat, Tehran',
      description:
        'Process validation for medical-device compliance, FMEA risk assessments, audit documentation and CAPA tracking.',
    },
    {
      date: '2019 – 2020',
      title: 'IT support assistant',
      place: 'Imam Hossein Hospital and Nedaye Salamat Farsar Alborz, Karaj',
      description:
        'First-line CRM support, onboarding and account access in 2019, followed by hospital hardware, software and network support in 2020.',
    },
    {
      date: '2018 – 2022, awarded 2024',
      title: 'BSc Industrial Engineering',
      place: 'Islamic Azad University, Central Tehran',
      description: 'Systems thinking, process analysis and optimisation.',
    },
  ],
  contact: {
    title: 'Let’s talk',
    text: 'I’m looking for a graduate or junior software engineering role in London, with a focus on iOS and mobile development.',
  },
} as const;

export function findCaseStudy(slug: string): CaseStudy | undefined {
  return content.caseStudies.find((study) => study.slug === slug);
}
