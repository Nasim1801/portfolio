import {
  co2TrackerScreens,
  gameIcons,
  hospitalScreens,
  hospitalTestScreen,
  pathLifeScreens,
  pawLifeScreens,
} from './screens';

export type FrameType = 'phone' | 'browser' | 'desktop' | 'terminal';

export interface LinkItem {
  label: string;
  href: string;
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

export interface Project {
  id: string;
  name: string;
  eyebrow: string;
  summary: string;
  accent: string;
  accentSoft: string;
  frame: FrameType;
  media: MediaItem[];
  icon: MediaItem;
  role: string;
  stats: string[];
  details: { label: string; text: string }[];
  stack: string[];
  links: LinkItem[];
}

export interface Co2ProjectData {
  id: 'co2-tracker';
  name: string;
  meta: string;
  description: string;
  accent: string;
  accentSoft: string;
  pills: string[];
  stats: { value: string; label: string }[];
  media: MediaItem[];
  pipeline: { title: string; detail: string }[];
  technicalNotes: { label: string; text: string }[];
  contributions: string[];
  stack: string[];
  links: LinkItem[];
}

export interface HospitalProjectData {
  id: 'hospital';
  name: string;
  meta: string;
  summary: string;
  role: string;
  outcome: string;
  stack: string[];
  media: MediaItem[];
  testMedia: MediaItem;
  link: LinkItem;
}

export const content = {
  identity: {
    name: 'Nasim Mosayebi',
    monogram: 'NM',
    title: 'Nasim Mosayebi | Software Engineer & Founder of PathLife Studio',
    description:
      'London software engineer and PathLife Studio founder building mobile apps, full-stack products and applied AI systems.',
    location: 'London',
    photo: {
      src: 'assets/me/photo.jpg',
      alt: 'Portrait of Nasim Mosayebi',
      width: 800,
      height: 800,
      available: false,
    },
  },
  nav: [
    { label: 'Work', href: '#pathlife' },
    { label: 'Experience', href: '#experience' },
    { label: 'Skills', href: '#skills' },
  ],
  navCta: { label: 'Hire me', href: '#contact' },
  links: {
    github: 'https://github.com/Nasim1801',
    linkedin: 'https://www.linkedin.com/in/nasim-mosayebi',
    studio: 'https://pathlifestudio.com',
    email: 'n.mosayebee@gmail.com',
    cv: 'Nasim-Mosayebi-CV.pdf',
    cvAvailable: false,
    pathlifeAppStore: 'https://apps.apple.com/gb/app/pathlife/id6769602618',
  },
  hero: {
    status: 'London · Open to graduate and junior roles',
    kicker: 'Software Engineer · Mobile Developer · Full-Stack Developer',
    headline: 'I build and ship real products.',
    intro:
      'Founder of PathLife Studio. I took PathLife from code to a live App Store release and built Physio-AI to 96.23% model accuracy.',
    primaryCta: { label: 'View projects', href: '#pathlife' },
    secondaryCta: { label: 'Contact me', href: '#contact' },
    accuracy: '96.23% accuracy',
    visual: {
      pathlife: {
        ...pathLifeScreens[0],
      },
      pawlife: {
        ...pawLifeScreens[0],
      },
    },
  },
  metrics: [
    { value: 'Live', label: 'PathLife on the App Store' },
    {
      value: '96.23%',
      count: 96.23,
      decimals: 2,
      suffix: '%',
      label: 'Physio-AI accuracy, grade A',
    },
    { value: '500+', count: 500, suffix: '+', label: 'assets migrated to Android' },
    { value: '16', count: 16, label: 'minigames built in PawLife' },
    { value: '5', count: 5, label: 'ad networks integrated' },
    { value: '2:1', count: 2, suffix: ':1', label: 'BSc Computer Science, Brunel' },
  ],
  studio: {
    eyebrow: 'Founded August 2026 in London',
    title: 'PathLife Studio Ltd',
    description:
      'PathLife Studio is how I prove I can own and ship products. I founded the London studio in August 2026 and build its games, web infrastructure and publishing systems. I am actively looking for a graduate or junior engineering role in London where I can contribute to a team and keep learning from experienced engineers.',
    link: { label: 'pathlifestudio.com', href: 'https://pathlifestudio.com' },
    games: [
      {
        name: 'PathLife',
        status: 'Live on iOS · Android in progress',
        icon: gameIcons.pathlife.src,
        alt: 'PathLife app icon',
        href: '#pathlife',
      },
      {
        name: 'PawLife',
        status: 'In development · Next release',
        icon: gameIcons.pawlife.src,
        alt: 'PawLife app icon',
        href: '#pawlife',
      },
    ],
  },
  shipStory: {
    eyebrow: 'Shipping story 01',
    title: 'From rejection to Ready for Sale.',
    intro: 'A product is not finished when the code works. It is finished when people can use it.',
    steps: [
      {
        number: '01',
        title: 'The problem',
        text: 'Apple rejected PathLife under App Store Guideline 1.5 (Developer Information). The app needed a working support website.',
        terminal: ['review.guideline = "1.5"', 'status: Rejected'],
      },
      {
        number: '02',
        title: 'What I built',
        text: 'A real support platform from scratch: Node.js, Express and SQLite, deployed on Railway behind Cloudflare, with an admin dashboard, rate limiting and app-ads.txt hosting for ad networks.',
        terminal: ['deploy: railway', 'edge: cloudflare', 'support: online'],
      },
      {
        number: '03',
        title: 'The result',
        text: 'The app passed review and is live on the App Store. The same site now verifies ads across five networks (Google AdMob, Liftoff/Vungle, Appodeal, AppLovin, TaurusX) and serves as pathlifestudio.com.',
        terminal: ['networks: 5', 'status: Ready for Sale'],
      },
    ],
  },
  projects: [
    {
      id: 'pathlife',
      name: 'PathLife',
      eyebrow: 'PathLife Studio · Live on iOS · Android in progress',
      summary:
        'Life simulation game where each year brings new choices: education, careers and life events.',
      accent: '#0660c0',
      accentSoft: '#d8f0f0',
      frame: 'phone' as FrameType,
      media: pathLifeScreens,
      icon: gameIcons.pathlife,
      role: 'Founder & Software Developer. I build the games, web infrastructure and publishing systems.',
      stats: ['13 screens ported', '500+ image and sound assets', '5 ad networks'],
      details: [
        {
          label: 'iOS',
          text: 'Built core game logic and SwiftUI interfaces, with screens designed in Figma.',
        },
        {
          label: 'Android',
          text: 'Leading a full rebuild from scratch in React Native and TypeScript, porting year advance, education, careers and life events, with Zustand for state management and full asset migration.',
        },
        {
          label: 'Web',
          text: 'Designed, built and deployed the official support site and admin dashboard.',
        },
        {
          label: 'Monetisation',
          text: 'Ads and app-ads.txt verification across five networks.',
        },
      ],
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
      links: [
        { label: 'App Store', href: 'https://apps.apple.com/gb/app/pathlife/id6769602618' },
        { label: 'Studio site', href: 'https://pathlifestudio.com' },
        { label: 'View code', href: '[TODO: PATHLIFE_CODE_URL]' },
      ],
    },
    {
      id: 'pawlife',
      name: 'PawLife',
      eyebrow: 'PathLife Studio · In development',
      summary:
        "Pet life simulation game I'm designing and building from scratch. Each animal has its own personality, minigames and story.",
      accent: '#306048',
      accentSoft: '#f0d8c0',
      frame: 'phone' as FrameType,
      media: pawLifeScreens,
      icon: gameIcons.pawlife,
      role: 'Founder & Software Developer. I am designing and building the game from scratch.',
      stats: ['16 minigames', '4 animals', '25 achievements'],
      details: [
        {
          label: 'Systems',
          text: 'Custom event engine focused on clear, funny writing, breed personalities, relationship arcs, life modifiers and a death/legacy system.',
        },
        {
          label: 'Architecture',
          text: 'Custom state-based navigation and app-wide state with Zustand.',
        },
        {
          label: 'Engagement',
          text: 'Shareable results card and a persistent leaderboard using AsyncStorage.',
        },
        {
          label: 'Design',
          text: 'Profile-style layout with floating pill navigation and a dark brown, gold and green colour system.',
        },
      ],
      stack: ['React Native', 'Expo', 'TypeScript', 'Zustand', 'AsyncStorage'],
      links: [
        { label: 'View code', href: '[TODO: PAWLIFE_CODE_URL]' },
        { label: 'View demo', href: '[TODO: PAWLIFE_DEMO_URL]' },
      ],
    },
  ] satisfies Project[],
  physio: {
    id: 'physio-ai',
    eyebrow: 'Final year project · Grade A',
    name: 'Physio-AI',
    summary:
      'A real-time physiotherapy feedback system that uses a normal webcam to track exercise technique and give corrective feedback.',
    role: 'Final-year project. I built the pose-tracking and classification system.',
    accuracy: 96.23,
    media: {
      screenshot: {
        src: 'assets/physio-ai/interface-01.webp',
        alt: 'Physio-AI web interface showing live pose feedback',
        width: 1600,
        height: 1000,
        available: false,
      },
    },
    pipeline: [
      { title: 'Webcam', detail: 'Live video' },
      { title: 'MediaPipe Pose', detail: '33 body landmarks per frame' },
      { title: 'Pose embeddings', detail: 'Movement represented as data' },
      { title: 'Random Forest', detail: 'Best model compared, 96.23% accuracy' },
      { title: 'Live feedback', detail: 'Corrective guidance in the web interface' },
    ],
    stack: ['Python', 'MediaPipe', 'scikit-learn', 'Computer vision', 'Machine learning'],
    links: [
      { label: 'View code', href: 'https://github.com/Nasim1801/physio-ai-final' },
      { label: 'View demo', href: '[TODO: PHYSIO_AI_DEMO_URL]' },
    ],
  },
  teamProjects: {
    eyebrow: 'Team projects',
    title: 'Building well with others.',
    items: [
      {
        id: 'co2-tracker',
        name: 'CO2 Tracker',
        meta: 'Level 2 group project · Brunel University London · Scrum Master',
        description:
          'A sustainability web app aligned with UN SDG 12 that shows a product’s carbon footprint before purchase through name search, a typed barcode or a photo upload.',
        accent: '#4f8a4f',
        accentSoft: '#d4edda',
        pills: ['Group project', 'Scrum Master', 'Full stack'],
        stats: [
          { value: '3', label: 'ways to look up a product' },
          { value: '12', label: 'products in the database' },
          { value: '2', label: 'database tables' },
        ],
        pipeline: [
          { title: 'React front end', detail: 'Search, barcode and photo input' },
          { title: 'REST API', detail: 'Spring Boot endpoints' },
          { title: 'H2 database', detail: 'Products and search history' },
          { title: 'Results', detail: 'CO₂ footprint in kg' },
        ],
        technicalNotes: [
          {
            label: 'Search by name',
            text: 'GET /api/products/search?name=… queries H2 and returns matching products as JSON with brand, category and CO₂ footprint in kg.',
          },
          {
            label: 'Barcode',
            text: 'The user types a barcode. GET /api/products/barcode?barcode=… returns the matching product.',
          },
          {
            label: 'Photo upload',
            text: 'POST /api/upload saves the image and returns a product. This is simulated recognition in this prototype, with the result selected from the product list.',
          },
          {
            label: 'Search history',
            text: 'Every search is saved to the SEARCH_HISTORY table with a timestamp.',
          },
          {
            label: 'Seed data',
            text: 'A DataLoader seeds 12 products across electronics, clothing, footwear and hygiene. Laptop examples include Apple MacBook at 200 kg CO₂, Dell XPS at 180 kg and Framework at 110 kg. T-Shirt examples include H&M at 2.5 kg and Patagonia at 1.8 kg.',
          },
        ],
        contributions: [
          'Built the customer-facing React interface, including search, results display and navigation.',
          'Built the Spring Boot REST API and H2 database back end.',
          'Designed the customer page in Figma, starting from a hand-drawn sketch.',
          'Served as Scrum Master for Sprint 1, planning tasks and coordinating the team through GitHub and Trello.',
        ],
        stack: [
          'React',
          'Vite',
          'React Router',
          'Spring Boot',
          'REST API',
          'H2 database',
          'JPA',
          'Figma',
          'Scrum',
        ],
        media: co2TrackerScreens,
        links: [
          { label: 'Watch the demo', href: 'https://youtu.be/2qtJxDQObb4' },
          { label: 'View code', href: 'https://github.com/Nasim1801/co2-tracker' },
        ],
      } satisfies Co2ProjectData,
      {
        id: 'hospital',
        name: 'Hospital Appointment System',
        meta: 'Team project',
        summary: 'A desktop appointment booking system for patients and staff.',
        role: 'Built the appointment booking module in Java, Swing and WindowBuilder, with JUnit tests.',
        outcome: 'The team delivered 10 of 11 planned requirements.',
        stack: ['Java', 'Swing', 'JUnit'],
        media: hospitalScreens,
        testMedia: hospitalTestScreen,
        link: {
          label: 'View on GitHub',
          href: 'https://github.com/Nasim1801/hospital-appointment-system',
        },
      } satisfies HospitalProjectData,
    ],
  },
  experience: {
    eyebrow: 'Experience & education',
    title: 'A builder with a quality background.',
    items: [
      {
        date: 'Aug 2026 – now',
        title: 'Founder & Software Developer',
        place: 'PathLife Studio Ltd, London',
        description:
          "Build and publish the studio's mobile games for iOS and Android, plus the web and ad infrastructure.",
        tag: 'ownership · shipping · product',
        kind: 'current',
      },
      {
        date: '2023 – 2026',
        title: 'BSc Computer Science, 2:1',
        place: 'Brunel University London',
        description: 'Dissertation: Physio-AI, graded A.',
        kind: 'education',
      },
      {
        date: '2022 – 2023',
        title: 'Foundation, Computer Science',
        place: 'Brunel University London Pathway College',
        kind: 'education',
      },
      {
        date: 'Jan 2021 – Jan 2022',
        title: 'Quality Assurance Intern',
        place: 'Farsar Tejarat Eng Co.',
        description:
          'Supported process validation and regulatory compliance (FDA, MHRA, EU MDR) for medical device product lines: quality documentation, FMEA risk assessments, audits and CAPA tracking.',
        tag: 'testing mindset · documentation',
        kind: 'past',
      },
      {
        date: 'Apr – Sep 2020',
        title: 'IT Support Assistant',
        place: 'Imam Hossein Hospital',
        description:
          'Installed and configured hardware, software and network systems and fixed technical problems for hospital staff.',
        tag: 'debugging under pressure',
        kind: 'past',
      },
      {
        date: 'Apr – Sep 2019',
        title: 'IT Support Assistant',
        place: 'Nedaye Salamt Farsar Alborz',
        description:
          'First-line CRM support, staff onboarding and training, account and access management.',
        tag: 'user empathy · communication',
        kind: 'past',
      },
      {
        date: 'Earlier',
        title: 'BSc Industrial Engineering',
        place: 'Islamic Azad University, Central Tehran',
        description: 'Systems thinking and process optimisation.',
        kind: 'education',
      },
    ],
  },
  skills: {
    eyebrow: 'Tools I use',
    title: 'Practical across the product stack.',
    groups: [
      {
        name: 'Languages',
        items: [
          { name: 'TypeScript', featured: true },
          { name: 'JavaScript', featured: true },
          { name: 'Python', featured: true },
          { name: 'Java', featured: false },
          { name: 'Swift', featured: false },
        ],
      },
      {
        name: 'Mobile & front end',
        items: [
          { name: 'React Native', featured: true },
          { name: 'Expo', featured: true },
          { name: 'SwiftUI', featured: false },
          { name: 'React', featured: false },
          { name: 'Zustand', featured: false },
          { name: 'Figma', featured: false },
        ],
      },
      {
        name: 'Back end & cloud',
        items: [
          { name: 'Node.js', featured: true },
          { name: 'Express', featured: true },
          { name: 'Spring Boot', featured: false },
          { name: 'REST APIs', featured: false },
          { name: 'SQLite', featured: false },
          { name: 'Railway', featured: false },
          { name: 'Cloudflare', featured: false },
        ],
      },
      {
        name: 'AI & practice',
        items: [
          { name: 'Machine learning', featured: true },
          { name: 'Computer vision', featured: false },
          { name: 'MediaPipe', featured: false },
          { name: 'scikit-learn', featured: false },
          { name: 'Git & GitHub', featured: false },
          { name: 'JUnit', featured: false },
          { name: 'Scrum', featured: false },
        ],
      },
    ],
    languages: 'Speaks four languages: English, Persian, [TODO: LANGUAGE_3], [TODO: LANGUAGE_4].',
  },
  contact: {
    eyebrow: 'Say hello',
    title: "Let's build something.",
    text: "I'm looking for a graduate or junior role where I can ship real products and keep learning from experienced engineers. I reply to every message.",
    roles: ['Mobile Developer', 'Full-Stack Developer', 'Software Engineer'],
    location: 'Based in London',
    rows: [
      {
        label: 'Email',
        value: 'n.mosayebee@gmail.com',
        href: 'mailto:n.mosayebee@gmail.com',
        copy: true,
      },
      {
        label: 'LinkedIn',
        value: 'linkedin.com/in/nasim-mosayebi',
        href: 'https://www.linkedin.com/in/nasim-mosayebi',
      },
      { label: 'GitHub', value: 'github.com/Nasim1801', href: 'https://github.com/Nasim1801' },
      { label: 'Studio', value: 'pathlifestudio.com', href: 'https://pathlifestudio.com' },
    ],
  },
  footer: '© 2026 Nasim Mosayebi · London',
};

export type SiteContent = typeof content;
