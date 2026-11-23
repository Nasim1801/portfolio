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
  /** Owner should review sections drafted from documented facts. */
  draftedSections?: string[];
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
    'SwiftUI game for iOS',
    'Year, education, career and life-event systems',
    'React Native and TypeScript rebuild for Android, with Zustand state',
    'Node.js, Express and SQLite support site on Railway behind Cloudflare',
  ],
  sections: [
    {
      id: 'problem',
      heading: 'Problem',
      lead: 'PathLife follows one character a year at a time. Education, career, relationships and random life events all read and change the same character, so a decision made at 18 has to make sense at 40.',
      paragraphs: [
        'That makes the game a state problem more than a screen problem. It also had to get through App Store review, which rejected it under Guideline 1.5 because the app needed a working support website.',
      ],
    },
    {
      id: 'constraints',
      heading: 'Constraints',
      bullets: [
        'The iOS game is already published, so the Android version has to reproduce its rules and feel without reusing its Swift code.',
        'App Store review requires a working support URL, a correct App Tracking Transparency prompt and in-app purchases that behave in the sandbox.',
        'The studio domain has to serve an app-ads.txt file that the ad networks can verify.',
      ],
    },
    {
      id: 'architecture',
      heading: 'Architecture',
      paragraphs: [
        'Screens are designed in Figma and built natively in SwiftUI for iOS. The Android version is a separate React Native and TypeScript app. The support site is a small Node.js and Express service with an SQLite database, deployed on Railway behind Cloudflare.',
      ],
    },
    {
      id: 'decisions',
      heading: 'Key decisions',
      bullets: [
        'Rebuild Android in React Native and TypeScript rather than wrap the iOS code. Data models, year advance, education, careers and life events are translated one system at a time.',
        'Manage Android game state with Zustand, so the year, career, education and event systems work from shared character state.',
        'Treat the support website as production software: an admin dashboard and rate limiting from the start, and the same service now hosts app-ads.txt for ad-network verification.',
      ],
    },
    {
      id: 'challenges',
      heading: 'Challenges',
      paragraphs: [
        'The Guideline 1.5 rejection blocked the release until a real support site existed, so I designed, built and deployed one. Release work also meant getting the App Tracking Transparency prompt right and testing in-app purchases in the sandbox.',
        'On Android the hard part is consistency: translating the data models and migrating the game’s images and sounds so both versions feel like the same product.',
      ],
    },
    {
      id: 'outcome',
      heading: 'Outcome',
      bullets: [
        'PathLife 2.1.3 is live on the UK App Store, published by PathLife Studio Ltd.',
        'The support site at pathlifestudio.com resolved the rejection and now also serves app-ads.txt.',
        'The Android rebuild is in progress. It is not on Google Play yet.',
      ],
    },
    {
      id: 'improve',
      heading: 'What I’d improve',
      bullets: [
        'Write automated tests for the year-advance and life-event rules before porting more systems, so iOS and Android can be checked against the same cases.',
        'Plan store requirements (support URL, privacy prompts, purchase testing) at the start of a project instead of meeting them at review.',
      ],
    },
  ],
  links: [
    { label: 'View on the App Store', href: store.pathlife },
    { label: 'Visit pathlifestudio.com', href: 'https://pathlifestudio.com' },
  ],
  schemaType: 'VideoGame',
  draftedSections: ['decisions', 'improve'],
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
    'SwiftUI interface',
    'Rule-driven puzzle board',
    'Session and progression state',
    'App Store release',
  ],
  sections: [
    {
      id: 'product',
      heading: 'Product',
      lead: 'One clear rule: match identical numbers or two numbers that add up to 10. Each pair clears space and changes the next move.',
      paragraphs: [
        'The goal was a board that is readable at a glance, with Classic games, Daily Challenges, achievements, statistics and collectible profile items to bring players back.',
      ],
    },
    {
      id: 'role',
      heading: 'My role',
      paragraphs: [
        'The published iPhone and iPad version is built natively with SwiftUI. A native Android version is being developed in Kotlin and is not yet on Google Play.',
      ],
      bullets: [
        'Design a dense puzzle grid that stays clear on every Apple screen size.',
        'Keep the core rules identical while building platform-native interfaces.',
        'Keep release labels honest across the published iOS and unreleased Android versions.',
      ],
    },
    {
      id: 'systems',
      heading: 'Game systems',
      paragraphs: [
        'The board evaluates equal-number and make-10 pairs. Hint, Undo and Add Numbers help players recover from a difficult board without removing the need to plan ahead.',
        'Daily Challenges, experience, achievements, personal records, leaderboards, animal avatars and decorative frames turn a short puzzle loop into visible long-term progress.',
      ],
    },
    {
      id: 'release',
      heading: 'Release',
      paragraphs: [
        'Version 2.0.0 shipped on 16 November 2026. It refreshed the visual system, expanded progression, improved layouts across iPhone and iPad and included stability and accessibility fixes. The app also includes a Premium purchase and restore flow.',
      ],
    },
    {
      id: 'lessons',
      heading: 'What I learned',
      paragraphs: [
        'In a puzzle game, visual polish and software structure cannot be separated. A small change to tile size, hierarchy or feedback changes how quickly a player can see the next move.',
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
    { label: 'Evaluation', value: 'Confusion matrices and ROC analysis' },
  ],
  architecture: [
    'Webcam video',
    'MediaPipe Pose: 33 landmarks per frame',
    'Pose embeddings',
    'Random Forest classifier',
    'WebSocket stream to the JavaScript interface',
    'SQLite session history',
  ],
  sections: [
    {
      id: 'problem',
      heading: 'Problem',
      lead: 'Most physiotherapy exercises are done at home, with nobody watching technique. Physio-AI asks whether an ordinary webcam can give useful feedback in the moment.',
    },
    {
      id: 'constraints',
      heading: 'Constraints',
      bullets: [
        'A standard webcam and ordinary hardware. No depth camera or wearable sensors.',
        'Feedback has to arrive while the user is still moving, so the whole pipeline runs in real time.',
        'An individual final-year project: one person responsible for data, model, back end and interface.',
      ],
    },
    {
      id: 'architecture',
      heading: 'Architecture',
      paragraphs: [
        'MediaPipe Pose extracts 33 body landmarks from each frame. I turned those landmarks into pose embeddings, classified them with scikit-learn, and streamed results from the Python back end to a JavaScript interface over WebSockets. Sessions are stored in SQLite so the interface can show progress over time, not only a live score.',
      ],
    },
    {
      id: 'decisions',
      heading: 'Key decisions',
      bullets: [
        'Classify landmarks, not pixels. Pose embeddings made the same features usable across several machine-learning approaches.',
        'Compare models before choosing one. I trained several classifiers and chose the Random Forest, judged on confusion matrices and ROC analysis rather than one headline number.',
        'Build the whole system, not a notebook: live capture, classification, feedback, persistence and a progress dashboard.',
      ],
    },
    {
      id: 'challenges',
      heading: 'Challenges',
      paragraphs: [
        'The model is only one part of the result. Landmark quality, embedding design, streaming latency, confidence thresholds and interface clarity all decide whether the feedback is useful. The interface shows repetitions, accuracy, joint performance and corrective messages so the user can understand what the system sees.',
      ],
    },
    {
      id: 'outcome',
      heading: 'Outcome',
      bullets: [
        'Graded A as my BSc Computer Science final-year project at Brunel University London.',
        'The project reported 96.23% classification accuracy for the Random Forest on its own dataset.',
        'Extended with fatigue detection, confidence-based visual feedback, session history and a progress dashboard.',
      ],
    },
    {
      id: 'improve',
      heading: 'What I’d improve',
      bullets: [
        'Test with more people, exercises and camera positions. Accuracy on the project dataset does not show how the system behaves for every body or room.',
        'Measure end-to-end latency from frame to feedback and report it alongside accuracy.',
      ],
    },
  ],
  links: [{ label: 'View source on GitHub', href: physioSource }],
  schemaType: 'SoftwareApplication',
  draftedSections: ['improve'],
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
    'React customer interface',
    'Spring Boot REST API',
    'JPA repositories',
    'H2 database and search history',
  ],
  sections: [
    {
      id: 'product',
      heading: 'Product',
      lead: 'Customers look up an estimated carbon footprint by product name or typed barcode. Both flows return the matching product and its emissions figure from the demonstration dataset.',
    },
    {
      id: 'engineering',
      heading: 'Engineering',
      paragraphs: [
        'In the university demo, the REST API handled lookups and recorded timestamped search history. The photo path simulated a result to demonstrate the upload flow.',
        'The public GitHub repository contains the React prototype. The Spring Boot API and H2 database from the university demo are unavailable in that repository.',
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
