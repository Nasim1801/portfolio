import {
  co2TrackerScreens,
  gameIcons,
  hospitalScreens,
  hospitalTestScreen,
  pathLifeScreens,
  pawLifeScreens,
  physioAiScreens,
  portfolioScreen,
  sumlumeIcon,
  sumlumeScreens,
} from './screens';

export type FrameType = 'phone' | 'browser' | 'desktop' | 'terminal';

export interface LinkItem {
  label: string;
  href: string;
  download?: boolean;
}

export interface MediaItem {
  src: string;
  smallSrc?: string;
  smallWidth?: number;
  sizes?: string;
  fallbackSrc?: string;
  alt: string;
  width: number;
  height: number;
  available?: boolean;
}

export interface SelectedProject {
  slug: string;
  name: string;
  label: string;
  status: string;
  summary: string;
  evidence: string;
  stack: string[];
  accent: string;
  accentSoft: string;
  media: MediaItem;
  icon?: MediaItem;
  frame: FrameType;
}

export interface CaseStudySection {
  id: string;
  eyebrow: string;
  title: string;
  paragraphs: string[];
  bullets?: string[];
}

export interface CaseStudy {
  slug: string;
  name: string;
  eyebrow: string;
  status: string;
  summary: string;
  role: string;
  accent: string;
  accentSoft: string;
  icon?: MediaItem;
  media: MediaItem[];
  frame: FrameType;
  stack: string[];
  facts: { value: string; label: string }[];
  architecture: string[];
  sections: CaseStudySection[];
  links: LinkItem[];
  schemaType: 'VideoGame' | 'SoftwareApplication';
}

export interface TeamProject {
  name: string;
  label: string;
  summary: string;
  role: string;
  outcome: string;
  stack: string[];
  media: MediaItem;
  frame: FrameType;
  links: LinkItem[];
  proof?: MediaItem;
}

export interface SkillEvidenceItem {
  technology: string;
  category: string;
  projects: {
    name: string;
    evidence: string;
    href: string;
  }[];
}

const sumlumeStudy: CaseStudy = {
  slug: 'sumlume',
  name: 'Sumlume',
  eyebrow: 'PathLife Studio · Native mobile game',
  status: 'Live on iPhone and iPad · Android in development',
  summary:
    'A colourful number puzzle where players match equal numbers or pairs that add up to 10, then build progress through daily challenges, achievements and personal records.',
  role: 'Founder & Software Developer. I lead the product design, native mobile implementation and release work under PathLife Studio.',
  accent: '#2058c7',
  accentSoft: '#e8efff',
  icon: sumlumeIcon,
  media: sumlumeScreens,
  frame: 'phone',
  stack: ['Swift', 'SwiftUI', 'Kotlin', 'Native iOS', 'Native Android'],
  facts: [
    { value: 'Live', label: 'on the App Store' },
    { value: '2.0.0', label: 'current iOS version' },
    { value: 'iPhone + iPad', label: 'published platforms' },
    { value: 'Kotlin', label: 'Android build in development' },
  ],
  architecture: [
    'SwiftUI interface',
    'Rule-driven puzzle board',
    'Session and progression state',
    'App Store release',
  ],
  sections: [
    {
      id: 'overview',
      eyebrow: '01 · Product',
      title: 'Simple rules with room for strategy.',
      paragraphs: [
        'Sumlume starts with one clear rule: match identical numbers or two numbers that add up to 10. Each valid pair clears space and changes the next move, so a familiar mechanic develops strategic depth.',
        'The product goal was to make the board immediately readable while giving players reasons to return through Classic games, Daily Challenges, achievements, statistics and collectible profile items.',
      ],
    },
    {
      id: 'responsibility',
      eyebrow: '02 · Responsibility',
      title: 'Native development across two platforms.',
      paragraphs: [
        'The published iPhone and iPad version is built natively for iOS with SwiftUI. A native Android version is being developed in Kotlin and is not currently presented as a published Google Play release.',
        'My work spans the product experience, puzzle behaviour, interface design, progression surfaces and the practical release work required to maintain a live App Store product.',
      ],
      bullets: [
        'Design a dense puzzle grid that remains clear on different Apple device sizes.',
        'Keep core game rules consistent while building platform-native interfaces.',
        'Maintain honest release labels across the published iOS and in-progress Android versions.',
      ],
    },
    {
      id: 'gameplay',
      eyebrow: '03 · Game systems',
      title: 'A board, a session and a longer journey.',
      paragraphs: [
        'The board evaluates valid equal-number and make-10 pairs. Hint, Undo and Add Numbers give players ways to recover when the board becomes difficult without removing the need to plan ahead.',
        'Beyond individual sessions, the published product includes Daily Challenges, experience, achievements, personal records, leaderboards, animal avatars and decorative frames. These systems turn a short puzzle loop into visible long-term progress.',
      ],
    },
    {
      id: 'quality',
      eyebrow: '04 · Quality and release',
      title: 'A live product, not a prototype.',
      paragraphs: [
        'Version 2.0.0 was released on 16 November 2026. The release refreshed the visual system, expanded progression, improved layouts across iPhone and iPad, and included stability and accessibility refinements.',
        'The iOS product also includes a Premium purchase and restoration experience. This portfolio explains the released behaviour without exposing private SDK configuration or commercial credentials.',
      ],
    },
    {
      id: 'lessons',
      eyebrow: '05 · Lessons',
      title: 'Clarity is an engineering constraint.',
      paragraphs: [
        'Sumlume reinforced that visual polish and software structure cannot be separated in a game. A small change to tile size, hierarchy or feedback can affect readability, board density and the player’s ability to understand the next move.',
        'Building natively also makes platform behaviour explicit. The product can share a consistent rule set while each client follows the conventions and constraints of its own platform.',
      ],
    },
  ],
  links: [
    {
      label: 'View on the App Store',
      href: 'https://apps.apple.com/gb/app/sumlume-number-match/id6799957684',
    },
    { label: 'Product page', href: 'https://www.pathlifestudio.com/sumlume.html' },
  ],
  schemaType: 'VideoGame',
};

const pathLifeStudy: CaseStudy = {
  slug: 'pathlife',
  name: 'PathLife',
  eyebrow: 'PathLife Studio · Life simulation',
  status: 'Live on iOS · Android rebuild in progress',
  summary:
    'A life simulation game where each year introduces choices across education, careers, relationships and life events.',
  role: 'Founder & Software Developer. I work across the iOS game, Android rebuild, support platform, publishing and ad infrastructure.',
  accent: '#0660c0',
  accentSoft: '#e5f3f4',
  icon: gameIcons.pathlife,
  media: pathLifeScreens,
  frame: 'phone',
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
  ],
  facts: [
    { value: 'Live', label: 'on the iOS App Store' },
    { value: '13', label: 'screens ported to Android' },
    { value: '500+', label: 'image and sound assets migrated' },
    { value: '5', label: 'ad networks integrated' },
  ],
  architecture: [
    'SwiftUI iOS game',
    'Year and event systems',
    'React Native Android rebuild',
    'Node, Express and SQLite support platform',
  ],
  sections: [
    {
      id: 'overview',
      eyebrow: '01 · Product',
      title: 'Many connected systems, one readable life story.',
      paragraphs: [
        'PathLife models a character’s progress through annual decisions, education, careers and unexpected events. The challenge is not one isolated screen. It is maintaining consistent state as choices change later opportunities and outcomes.',
        'I contributed core game logic and SwiftUI interfaces to the published iOS product, with screens designed in Figma.',
      ],
    },
    {
      id: 'android',
      eyebrow: '02 · Cross-platform engineering',
      title: 'Rebuilding the game for Android.',
      paragraphs: [
        'The Android version is a full React Native and TypeScript rebuild rather than a wrapper around the iOS code. I am porting year advance, education, careers and life-event flows while using Zustand for application state.',
        'The work includes translating data models, recreating interactions and migrating more than 500 image and sound assets while preserving a consistent product identity.',
      ],
    },
    {
      id: 'production',
      eyebrow: '03 · Production engineering',
      title: 'The release depended on more than the app.',
      paragraphs: [
        'Apple rejected the app under App Store Guideline 1.5 because it needed a working support website. I designed and built the required platform with Node.js, Express and SQLite, deployed it on Railway behind Cloudflare, and added an admin dashboard and rate limiting.',
        'The same platform now hosts app-ads.txt and supports verification across five ad networks. Resolving the rejection turned an immediate release blocker into reusable studio infrastructure.',
      ],
    },
    {
      id: 'quality',
      eyebrow: '04 · Testing and release',
      title: 'Release work is part of the engineering.',
      paragraphs: [
        'Publishing required working through support URL requirements, the App Tracking Transparency prompt and in-app purchase sandbox behaviour. Those checks sit alongside game-state validation and interface testing.',
        'The result is a live iOS product with a maintained support surface, while the Android version remains clearly labelled as work in progress.',
      ],
    },
    {
      id: 'lessons',
      eyebrow: '05 · Lessons',
      title: 'Own the whole path to the user.',
      paragraphs: [
        'PathLife taught me to treat store review, support, privacy prompts, monetisation configuration and operational tooling as part of the product rather than tasks that happen after development.',
      ],
    },
  ],
  links: [
    {
      label: 'View on the App Store',
      href: 'https://apps.apple.com/gb/app/pathlife/id6769602618',
    },
    { label: 'Studio website', href: 'https://pathlifestudio.com' },
  ],
  schemaType: 'VideoGame',
};

const physioStudy: CaseStudy = {
  slug: 'physio-ai',
  name: 'Physio-AI',
  eyebrow: 'Brunel University London · Final-year project',
  status: 'Grade A · 96.23% classifier accuracy',
  summary:
    'A real-time physiotherapy feedback system that tracks exercise technique through a standard webcam and returns corrective guidance during a session.',
  role: 'Individual final-year project. I built the pose-processing, model comparison, real-time feedback pipeline, interface and session persistence.',
  accent: '#16835d',
  accentSoft: '#e7f5ee',
  media: physioAiScreens,
  frame: 'browser',
  stack: ['Python', 'MediaPipe Pose', 'scikit-learn', 'JavaScript', 'WebSockets', 'SQLite'],
  facts: [
    { value: '96.23%', label: 'best model accuracy' },
    { value: '33', label: 'pose landmarks per frame' },
    { value: 'Grade A', label: 'final-year project result' },
    { value: 'Webcam', label: 'no specialist hardware required' },
  ],
  architecture: [
    'Webcam video',
    'MediaPipe landmarks',
    'Pose embeddings',
    'Random Forest classifier',
    'WebSocket feedback and SQLite sessions',
  ],
  sections: [
    {
      id: 'problem',
      eyebrow: '01 · Problem',
      title: 'Feedback is often missing between appointments.',
      paragraphs: [
        'Physiotherapy exercises are frequently completed at home without a clinician watching technique. Physio-AI explores whether a normal webcam can provide useful, immediate feedback while the user exercises.',
        'The project was designed as an end-to-end system rather than a model in a notebook. It captures movement, classifies form, streams feedback to a web interface and stores session data.',
      ],
    },
    {
      id: 'pipeline',
      eyebrow: '02 · System architecture',
      title: 'From pixels to corrective guidance.',
      paragraphs: [
        'MediaPipe Pose extracts 33 body landmarks from each video frame. I transformed those landmarks into pose embeddings that could be compared across several machine-learning approaches.',
        'The Python back end streams results to a JavaScript front end over WebSockets. Session history and progress are persisted in SQLite so the interface can show more than a single live score.',
      ],
    },
    {
      id: 'model',
      eyebrow: '03 · Model selection',
      title: 'Compare first, then ship the best fit.',
      paragraphs: [
        'I trained and compared multiple classifiers, then selected the Random Forest model that achieved 96.23% accuracy. Evaluation included confusion matrices and ROC analysis rather than relying on one headline metric alone.',
        'The final interface combines classification confidence with live visual feedback and extends the experience with fatigue detection and session progress.',
      ],
    },
    {
      id: 'quality',
      eyebrow: '04 · Validation',
      title: 'A useful result needs a usable system.',
      paragraphs: [
        'The project had to maintain responsive feedback on ordinary hardware while keeping the tracking state understandable to the user. The interface exposes repetitions, accuracy, joint performance and corrective messages without requiring specialist equipment.',
        'The project received an A grade as my BSc Computer Science final-year project at Brunel University London.',
      ],
    },
    {
      id: 'lessons',
      eyebrow: '05 · Lessons',
      title: 'Applied AI is a systems problem.',
      paragraphs: [
        'The strongest model is only one part of the product. Landmark quality, embedding design, streaming latency, confidence thresholds, persistence and interface clarity all influence whether the result is useful in practice.',
      ],
    },
  ],
  links: [{ label: 'View source on GitHub', href: 'https://github.com/Nasim1801/physio-ai-final' }],
  schemaType: 'SoftwareApplication',
};

const pawLifeStudy: CaseStudy = {
  slug: 'pawlife',
  name: 'PawLife',
  eyebrow: 'PathLife Studio · Pet life simulation',
  status: 'In development · Not yet released',
  summary:
    'A pet life simulation with distinct animal personalities, story events, minigames, relationships and a persistent life album.',
  role: 'Founder & Software Developer. I am designing and building the product from scratch in React Native and Expo.',
  accent: '#2d6a4f',
  accentSoft: '#f6eadb',
  icon: gameIcons.pawlife,
  media: pawLifeScreens.filter((screen) => screen.available !== false),
  frame: 'phone',
  stack: ['React Native', 'Expo', 'TypeScript', 'Zustand', 'AsyncStorage'],
  facts: [
    { value: '16', label: 'minigames built' },
    { value: '4', label: 'animal types' },
    { value: '25', label: 'achievements' },
    { value: 'In development', label: 'current status' },
  ],
  architecture: [
    'Expo and React Native UI',
    'Custom event engine',
    'Zustand application state',
    'AsyncStorage results and leaderboard',
  ],
  sections: [
    {
      id: 'overview',
      eyebrow: '01 · Product',
      title: 'A simulation built around personality.',
      paragraphs: [
        'PawLife follows a pet through care, relationships, minigames and story moments. Each animal has its own personality, so the same system needs to produce experiences that feel distinct without becoming inconsistent.',
        'The project is still in development and is presented as engineering work in progress, not as a released product.',
      ],
    },
    {
      id: 'systems',
      eyebrow: '02 · Game systems',
      title: 'Connected state across a complete life.',
      paragraphs: [
        'A custom event engine handles story choices, breed personalities, relationship arcs, life modifiers and the death and legacy flow. Sixteen minigames, four animal types and 25 achievements feed into the wider simulation.',
        'The main engineering challenge is making these systems interact without losing a clear source of truth for the pet’s current state.',
      ],
    },
    {
      id: 'state-design',
      eyebrow: '03 · Architecture',
      title: 'State is the product backbone.',
      paragraphs: [
        'The app uses React Native, Expo and TypeScript, with Zustand for app-wide state and custom state-based navigation. AsyncStorage persists shareable results and the leaderboard between sessions.',
        'The profile-style interface and floating pill navigation are designed around the information players need most often rather than mirroring a generic tab layout.',
      ],
    },
    {
      id: 'quality',
      eyebrow: '04 · Current focus',
      title: 'Build depth before claiming release.',
      paragraphs: [
        'Current work focuses on making the event writing, minigame state, progression and long-term simulation agree with one another. Public code and a release link are intentionally not shown because the project remains private and unfinished.',
      ],
    },
    {
      id: 'lessons',
      eyebrow: '05 · Lessons',
      title: 'Narrative systems need software discipline.',
      paragraphs: [
        'A funny story choice still needs deterministic state updates, persistence and testable consequences. PawLife has made the relationship between writing, navigation and application state especially clear.',
      ],
    },
  ],
  links: [],
  schemaType: 'VideoGame',
};

const portfolioStudy: CaseStudy = {
  slug: 'portfolio',
  name: 'This Portfolio — Design & Engineering',
  eyebrow: 'Design and engineering · React web application',
  status: 'Live on GitHub Pages · Open source',
  summary:
    'A performance-conscious creative portfolio that turns real project evidence into interactive, keyboard-accessible browser experiences.',
  role: 'I designed and engineered the complete experience, from the visual system and component architecture to responsive behaviour, accessibility, metadata, testing and deployment.',
  accent: '#7187ff',
  accentSoft: '#e8ebff',
  media: [portfolioScreen],
  frame: 'browser',
  stack: ['React', 'TypeScript', 'Vite', 'CSS Modules', 'SVG', 'Playwright'],
  facts: [
    { value: '2', label: 'working Engineering Lab exhibits' },
    { value: '5', label: 'project case studies' },
    { value: '360–1920px', label: 'browser QA range' },
    { value: 'Static', label: 'GitHub Pages deployment' },
  ],
  architecture: [
    'Typed content and media data',
    'Reusable React interaction systems',
    'CSS Module visual language',
    'Static route metadata generation',
    'Playwright QA and GitHub Pages release',
  ],
  sections: [
    {
      id: 'objectives',
      eyebrow: '01 · Design objectives',
      title: 'Make the interface part of the evidence.',
      paragraphs: [
        'The portfolio needed to do more than describe front-end capability. Its interactions had to demonstrate state management, responsive composition, motion design and accessibility while keeping the recruitment path immediate.',
        'The visual direction uses a connected signal field rather than a standard landing-page grid. Real project images remain the centre of the experience, while relationships between products, systems and technologies become interactive.',
      ],
    },
    {
      id: 'components',
      eyebrow: '02 · Component architecture',
      title: 'Content, presentation and interaction stay separate.',
      paragraphs: [
        'Verified project facts and media metadata live in typed data files. Reusable frames, galleries, project chapters and case-study components read from that source rather than duplicating claims across pages.',
        'The Engineering Lab keeps rule logic separate from interface state, which makes the number-matching behaviour independently testable. The Physio-AI exhibit uses SVG and derived geometry rather than a recorded animation.',
      ],
      bullets: [
        'Typed project, screenshot and skill-evidence models.',
        'Small interaction components with explicit keyboard behaviour.',
        'Static route shells for GitHub Pages metadata and deep links.',
      ],
    },
    {
      id: 'responsive',
      eyebrow: '03 · Responsive design',
      title: 'The concept changes shape, not meaning.',
      paragraphs: [
        'Desktop uses spatial composition and asymmetric project chapters. On smaller screens the same content becomes an ordered signal selector, swipeable real media and single-column technical evidence.',
        'Critical identity, role, location, CV and contact actions never depend on a hover state or an animation finishing.',
      ],
    },
    {
      id: 'accessibility',
      eyebrow: '04 · Accessibility and motion',
      title: 'Interaction is optional. Access is not.',
      paragraphs: [
        'The constellation, puzzle, pipeline and skill map support keyboard input, visible focus states and meaningful labels. Live feedback is announced without moving focus unexpectedly.',
        'Reduced-motion preferences remove decorative transitions while preserving state changes. Semantic headings, landmark regions and descriptive image text keep the site understandable outside its visual presentation.',
      ],
    },
    {
      id: 'delivery',
      eyebrow: '05 · Performance, SEO and release',
      title: 'Creative work still has production constraints.',
      paragraphs: [
        'The site avoids a heavy 3D runtime. SVG, CSS and lightweight React state provide the visual system, while WebP images, explicit dimensions and lazy loading reduce media cost and layout shift.',
        'Vite produces static assets under the GitHub Pages base path. Route-specific HTML metadata, structured data, a sitemap and a deployment workflow support discoverability and reliable deep links.',
      ],
    },
    {
      id: 'tradeoffs',
      eyebrow: '06 · Trade-offs and maintenance',
      title: 'Ambition without a fragile runtime.',
      paragraphs: [
        'A WebGL scene could create more spectacle, but it would add weight and a less dependable mobile experience without improving the project evidence. The signal field delivers genuine control and spatial depth with regular web primitives.',
        'Automated build, lint, interaction and responsive checks are kept in the repository so future content edits can be verified before deployment.',
      ],
    },
  ],
  links: [
    { label: 'View the portfolio source', href: 'https://github.com/Nasim1801/portfolio' },
    { label: 'Open the Engineering Lab', href: '/portfolio/lab/' },
  ],
  schemaType: 'SoftwareApplication',
};

export const content = {
  identity: {
    name: 'Nasim Mosayebi',
    title: 'Nasim Mosayebi | Software Engineer & Founder of PathLife Studio',
    description:
      'Portfolio of London software engineer Nasim Mosayebi. Explore native mobile apps, full-stack systems and a real-time computer vision project.',
    location: 'London, United Kingdom',
  },
  nav: [
    { label: 'Home', href: '#top' },
    { label: 'Work', href: '#work' },
    { label: 'Engineering Lab', href: 'lab/' },
    { label: 'About', href: '#about' },
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
    status: 'London · Open to graduate and junior engineering roles',
    kicker: 'Software Engineer / Creative Developer',
    name: 'Nasim Mosayebi',
    headline: 'I design systems. Then I make them real.',
    intro:
      'Computer Science graduate in London building native apps, full-stack systems and interactive web experiences.',
    proof: 'Two live App Store products. A Grade A pose-tracking project at 96.23% accuracy.',
  },
  proof: [
    { value: '2', label: 'live App Store products' },
    { value: '96.23%', label: 'Physio-AI classifier accuracy' },
    { value: '2:1', label: 'BSc Computer Science' },
    { value: 'London', label: 'open to graduate and junior roles' },
  ],
  selectedWork: [
    {
      slug: 'sumlume',
      name: 'Sumlume',
      label: 'Featured · Native mobile game',
      status: 'Live on iPhone and iPad',
      summary:
        'A number puzzle built around matching equal tiles or pairs that make 10, with daily challenges, achievements and progression.',
      evidence: 'Version 2.0.0 released on 16 November 2026.',
      stack: ['SwiftUI', 'Swift', 'Kotlin'],
      accent: '#2058c7',
      accentSoft: '#e8efff',
      media: sumlumeScreens[0],
      icon: sumlumeIcon,
      frame: 'phone',
    },
    {
      slug: 'pathlife',
      name: 'PathLife',
      label: 'Product engineering · Life simulation',
      status: 'Live on iOS · Android rebuild in progress',
      summary:
        'A life simulation spanning education, careers and events, supported by production web and advertising infrastructure.',
      evidence: '500+ assets migrated and five ad networks integrated.',
      stack: ['SwiftUI', 'React Native', 'TypeScript', 'Node.js'],
      accent: '#0660c0',
      accentSoft: '#e5f3f4',
      media: pathLifeScreens[0],
      icon: gameIcons.pathlife,
      frame: 'phone',
    },
    {
      slug: 'physio-ai',
      name: 'Physio-AI',
      label: 'Applied machine learning · Final-year project',
      status: 'Grade A · 96.23% accuracy',
      summary:
        'Real-time webcam physiotherapy feedback using MediaPipe Pose, pose embeddings and a Random Forest classifier.',
      evidence: '33 landmarks per frame with live feedback over WebSockets.',
      stack: ['Python', 'MediaPipe', 'scikit-learn', 'WebSockets'],
      accent: '#16835d',
      accentSoft: '#e7f5ee',
      media: physioAiScreens[0],
      frame: 'browser',
    },
    {
      slug: 'pawlife',
      name: 'PawLife',
      label: 'Product in development · Pet simulation',
      status: 'In development · Not yet released',
      summary:
        'A React Native pet-life simulation with a custom event engine, minigames, personalities and persistent progression.',
      evidence: '16 minigames, four animals and 25 achievements.',
      stack: ['React Native', 'Expo', 'TypeScript', 'Zustand'],
      accent: '#2d6a4f',
      accentSoft: '#f6eadb',
      media: pawLifeScreens[0],
      icon: gameIcons.pawlife,
      frame: 'phone',
    },
    {
      slug: 'portfolio',
      name: 'This Portfolio',
      label: 'Creative front-end engineering · Open source',
      status: 'Live on GitHub Pages',
      summary:
        'A responsive React experience with a playable lab, interactive project constellation and evidence-linked technical map.',
      evidence: 'Two working browser exhibits with pointer, touch and keyboard controls.',
      stack: ['React', 'TypeScript', 'CSS Modules', 'Playwright'],
      accent: '#7187ff',
      accentSoft: '#e8ebff',
      media: portfolioScreen,
      frame: 'browser',
    },
  ] satisfies SelectedProject[],
  caseStudies: [
    sumlumeStudy,
    pathLifeStudy,
    physioStudy,
    pawLifeStudy,
    portfolioStudy,
  ] satisfies CaseStudy[],
  about: {
    eyebrow: 'About',
    title: 'Product ownership backed by a quality mindset.',
    intro:
      'I am a London-based software engineer with a BSc Computer Science degree from Brunel University London, awarded with a 2:1 classification.',
    paragraphs: [
      'Through PathLife Studio I have taken mobile products from design and implementation through App Store release, support infrastructure and ongoing maintenance. I am now looking for a graduate or junior engineering role where I can contribute that ownership within an experienced team.',
      'My earlier Industrial Engineering degree, medical-device quality assurance work and IT support roles shape how I approach software: understand the system, document decisions, test the risky paths and keep the user’s problem visible.',
    ],
    principles: [
      {
        title: 'Ship the complete product',
        text: 'Code, release review, support, infrastructure and maintenance all count.',
      },
      {
        title: 'Make decisions testable',
        text: 'I bring FMEA, CAPA, JUnit and model-evaluation experience to software work.',
      },
      {
        title: 'Explain the trade-off',
        text: 'Clear technical communication matters to users, teammates and reviewers.',
      },
    ],
  },
  teamProjects: [
    {
      name: 'CO2 Tracker',
      label: 'Brunel group project · Scrum Master for Sprint 1',
      summary:
        'A sustainability web app that returns product carbon-footprint data through name search, typed barcode input and a prototype photo flow.',
      role: 'Built the React customer interface, Spring Boot REST API and H2 database. Designed the customer page in Figma and coordinated Sprint 1.',
      outcome:
        'Search history is persisted with timestamps and the database is seeded with 12 products.',
      stack: ['React', 'Spring Boot', 'REST', 'H2', 'JPA', 'Scrum'],
      media: co2TrackerScreens[1],
      frame: 'browser',
      links: [
        { label: 'View source on GitHub', href: 'https://github.com/Nasim1801/co2-tracker' },
        { label: 'Watch the demo', href: 'https://youtu.be/2qtJxDQObb4' },
      ],
    },
    {
      name: 'Hospital Appointment System',
      label: 'Brunel group project · Java desktop application',
      summary:
        'A Swing desktop booking system for patients and staff, covering hospital search, appointment selection and schedule changes.',
      role: 'Built the appointment booking module in Java, Swing and WindowBuilder, with JUnit coverage.',
      outcome: 'The team delivered 10 of 11 planned requirements.',
      stack: ['Java', 'Swing', 'WindowBuilder', 'JUnit'],
      media: hospitalScreens[1],
      frame: 'desktop',
      proof: hospitalTestScreen,
      links: [
        {
          label: 'View source on GitHub',
          href: 'https://github.com/Nasim1801/hospital-appointment-system',
        },
      ],
    },
  ] satisfies TeamProject[],
  experience: {
    eyebrow: 'Experience and education',
    title: 'Engineering shaped by product, support and quality work.',
    items: [
      {
        date: 'Aug 2026 – now',
        title: 'Founder & Software Developer',
        place: 'PathLife Studio Ltd · London',
        description:
          'Build and publish the studio’s mobile games for iOS and Android, together with the web and advertising infrastructure that supports them.',
        kind: 'current',
      },
      {
        date: 'Apr 2024 – Jun 2026',
        title: 'IT Administrator, part-time',
        place: 'ATOZ Education Services · London',
        description:
          'Supported hardware, software and network systems, maintained day-to-day IT operations and explained technical solutions to staff and students.',
        kind: 'past',
      },
      {
        date: '2023 – 2026',
        title: 'BSc (Hons) Computer Science, 2:1',
        place: 'Brunel University London',
        description: 'Final-year project: Physio-AI, awarded Grade A.',
        kind: 'education',
      },
      {
        date: '2022 – 2023',
        title: 'Foundation in Computer Science',
        place: 'Brunel University London',
        description: 'Pathway programme before the BSc Computer Science degree.',
        kind: 'education',
      },
      {
        date: 'Jan 2021 – Jan 2022',
        title: 'Quality Assurance Intern',
        place: 'Farsar Tejarat · Tehran',
        description:
          'Supported process validation, medical-device compliance, FMEA risk assessments, audits and CAPA tracking.',
        kind: 'past',
      },
      {
        date: 'Apr – Sep 2020',
        title: 'IT Support Assistant',
        place: 'Imam Hossein Hospital · Karaj',
        description:
          'Installed and configured hardware, software and network systems and diagnosed technical problems for hospital staff.',
        kind: 'past',
      },
      {
        date: 'Apr – Sep 2019',
        title: 'IT Support Assistant',
        place: 'Nedaye Salamat Farsar Alborz · Karaj',
        description:
          'Provided first-line CRM support, onboarding, training and account-access management.',
        kind: 'past',
      },
      {
        date: '2018 – 2022 · awarded 2024',
        title: 'BSc Industrial Engineering',
        place: 'Islamic Azad University, Central Tehran',
        description: 'Systems thinking, process analysis and optimisation.',
        kind: 'education',
      },
    ],
  },
  skills: {
    languages: 'English (fluent) · Persian (native) · German (B1) · Arabic (A1)',
  },
  skillEvidence: [
    {
      technology: 'React',
      category: 'Frontend Engineering',
      projects: [
        {
          name: 'This Portfolio',
          evidence:
            'Built the interactive project field, Engineering Lab and evidence map as reusable React components.',
          href: 'projects/portfolio/',
        },
        {
          name: 'CO2 Tracker',
          evidence:
            'Built the customer search, results display and navigation for the sustainability web app.',
          href: '#team-work',
        },
      ],
    },
    {
      technology: 'TypeScript',
      category: 'Frontend Engineering',
      projects: [
        {
          name: 'This Portfolio',
          evidence:
            'Modelled project content, screenshots and interaction state with explicit TypeScript types.',
          href: 'projects/portfolio/',
        },
        {
          name: 'PathLife',
          evidence:
            'Rebuilding year, education, career and event systems in React Native with typed state.',
          href: 'projects/pathlife/',
        },
        {
          name: 'PawLife',
          evidence:
            'Implemented the event engine, navigation and persistent game state in a typed Expo application.',
          href: 'projects/pawlife/',
        },
      ],
    },
    {
      technology: 'HTML & CSS',
      category: 'Frontend Engineering',
      projects: [
        {
          name: 'This Portfolio',
          evidence:
            'Created the responsive signal-field design system, device frames and motion-safe interaction states.',
          href: 'projects/portfolio/',
        },
      ],
    },
    {
      technology: 'SwiftUI',
      category: 'Mobile Application Development',
      projects: [
        {
          name: 'Sumlume',
          evidence:
            'Built the published iPhone and iPad number-puzzle interface natively in SwiftUI.',
          href: 'projects/sumlume/',
        },
        {
          name: 'PathLife',
          evidence: 'Built core game interfaces for the live iOS life-simulation product.',
          href: 'projects/pathlife/',
        },
      ],
    },
    {
      technology: 'React Native',
      category: 'Mobile Application Development',
      projects: [
        {
          name: 'PathLife',
          evidence:
            'Leading the Android rebuild and asset migration with React Native and Zustand.',
          href: 'projects/pathlife/',
        },
        {
          name: 'PawLife',
          evidence:
            'Building a pet-life simulation with 16 minigames and a custom state-based architecture.',
          href: 'projects/pawlife/',
        },
      ],
    },
    {
      technology: 'Kotlin',
      category: 'Mobile Application Development',
      projects: [
        {
          name: 'Sumlume',
          evidence: 'Developing the native Android version of the number-puzzle product.',
          href: 'projects/sumlume/',
        },
      ],
    },
    {
      technology: 'Expo',
      category: 'Mobile Application Development',
      projects: [
        {
          name: 'PawLife',
          evidence: 'Using Expo for the in-development React Native pet simulation.',
          href: 'projects/pawlife/',
        },
      ],
    },
    {
      technology: 'Node.js & Express',
      category: 'Backend and APIs',
      projects: [
        {
          name: 'PathLife',
          evidence:
            'Built the support platform, admin surface, rate limiting and app-ads.txt delivery.',
          href: 'projects/pathlife/',
        },
      ],
    },
    {
      technology: 'Spring Boot',
      category: 'Backend and APIs',
      projects: [
        {
          name: 'CO2 Tracker',
          evidence:
            'Built REST endpoints for name search, typed barcode lookup and the prototype upload flow.',
          href: '#team-work',
        },
      ],
    },
    {
      technology: 'WebSockets',
      category: 'Backend and APIs',
      projects: [
        {
          name: 'Physio-AI',
          evidence:
            'Streamed pose classification results from the Python pipeline to the live web interface.',
          href: 'projects/physio-ai/',
        },
      ],
    },
    {
      technology: 'SQLite & H2',
      category: 'Databases and Data Management',
      projects: [
        {
          name: 'Physio-AI',
          evidence: 'Persisted rehabilitation sessions and progress data in SQLite.',
          href: 'projects/physio-ai/',
        },
        {
          name: 'CO2 Tracker',
          evidence: 'Modelled product records and timestamped search history in H2 through JPA.',
          href: '#team-work',
        },
      ],
    },
    {
      technology: 'MediaPipe Pose',
      category: 'AI and Machine Learning',
      projects: [
        {
          name: 'Physio-AI',
          evidence: 'Extracted 33 pose landmarks per frame from standard webcam video.',
          href: 'projects/physio-ai/',
        },
      ],
    },
    {
      technology: 'scikit-learn',
      category: 'AI and Machine Learning',
      projects: [
        {
          name: 'Physio-AI',
          evidence:
            'Compared classifiers and selected a Random Forest model that achieved 96.23% accuracy.',
          href: 'projects/physio-ai/',
        },
      ],
    },
    {
      technology: 'JUnit',
      category: 'Testing, Tooling and Deployment',
      projects: [
        {
          name: 'Hospital Appointment System',
          evidence: 'Added JUnit coverage for the Java Swing appointment-booking module.',
          href: '#team-work',
        },
      ],
    },
    {
      technology: 'Playwright',
      category: 'Testing, Tooling and Deployment',
      projects: [
        {
          name: 'This Portfolio',
          evidence: 'Automated route, viewport, theme, console, overflow and interaction checks.',
          href: 'projects/portfolio/',
        },
      ],
    },
    {
      technology: 'GitHub Pages',
      category: 'Testing, Tooling and Deployment',
      projects: [
        {
          name: 'This Portfolio',
          evidence:
            'Configured static route shells, base paths and automated production deployment.',
          href: 'projects/portfolio/',
        },
      ],
    },
  ] satisfies SkillEvidenceItem[],
  contact: {
    eyebrow: 'Contact',
    title: 'Let’s build something useful.',
    text: 'I am looking for a graduate or junior Software Engineer, Mobile Developer or Full-Stack Developer role in London. I reply to every genuine message.',
    roles: ['Software Engineer', 'Mobile Developer', 'Full-Stack Developer'],
  },
} as const;

export function findCaseStudy(slug: string) {
  return content.caseStudies.find((study) => study.slug === slug);
}
