export interface ScreenshotAsset {
  src: string;
  smallSrc?: string;
  thumbnailSrc?: string;
  smallWidth?: number;
  sizes?: string;
  alt: string;
  width: number;
  height: number;
  label?: string;
}

function portrait(
  src: string,
  width: number,
  height: number,
  label: string,
  alt: string,
): ScreenshotAsset {
  return {
    src: `${src}.webp`,
    smallSrc: `${src}-540.webp`,
    thumbnailSrc: `${src}-112.webp`,
    smallWidth: 540,
    sizes: '(max-width: 650px) 48vw, 290px',
    width,
    height,
    label,
    alt,
  };
}

export const sumlumeScreens: ScreenshotAsset[] = [
  portrait(
    'assets/sumlume/classic',
    1179,
    2556,
    'Classic board',
    'Official Sumlume App Store artwork showing the colourful Classic board and an example of numbers that add to ten',
  ),
  portrait(
    'assets/sumlume/home',
    1179,
    2556,
    'Home and progression',
    'Sumlume home screen showing Continue Classic, Daily Challenge and level progress',
  ),
  portrait(
    'assets/sumlume/daily',
    1179,
    2556,
    'Daily Challenge',
    'Sumlume Daily Challenge board with a dated number puzzle',
  ),
  portrait(
    'assets/sumlume/achievements',
    1179,
    2556,
    'Achievements',
    'Sumlume achievements screen showing milestones and unlockable rewards',
  ),
  portrait(
    'assets/sumlume/statistics',
    1179,
    2556,
    'Statistics',
    'Sumlume statistics screen displaying best score, puzzles played and numbers matched',
  ),
  portrait(
    'assets/sumlume/collection',
    1179,
    2556,
    'Collection',
    'Sumlume collection screen with animal avatars and decorative frames',
  ),
];

export const pathLifeScreens: ScreenshotAsset[] = [
  portrait(
    'assets/pathlife/dashboard',
    1179,
    2556,
    'Life dashboard',
    'Official PathLife App Store artwork showing Grace’s dashboard, career goal, well-being and age controls',
  ),
  portrait(
    'assets/pathlife/decisions',
    1206,
    2622,
    'Life decisions',
    'PathLife life event presenting a relationship dilemma and four choices',
  ),
  portrait(
    'assets/pathlife/relationships',
    1179,
    2556,
    'Relationships',
    'PathLife relationships screen listing family members and their connection scores',
  ),
  portrait(
    'assets/pathlife/career',
    1179,
    2556,
    'Career',
    'PathLife career screen showing a software developer’s pay, performance and promotion progress',
  ),
  portrait(
    'assets/pathlife/education',
    1179,
    2556,
    'Education',
    'PathLife education overview with university offers and student-life actions',
  ),
  portrait(
    'assets/pathlife/business',
    1179,
    2556,
    'Business',
    'PathLife gym company dashboard showing finances, staff and clubs',
  ),
  portrait(
    'assets/pathlife/property',
    1179,
    2556,
    'Property',
    'PathLife property management screen showing valuation, rental and renovation actions',
  ),
];

export const pawLifeScreens: ScreenshotAsset[] = [
  portrait(
    'assets/pawlife/home',
    1206,
    2622,
    'Home life',
    'PawLife development build showing Bella at home in year four, with needs and story controls',
  ),
  portrait(
    'assets/pawlife/care',
    1206,
    2622,
    'Companionship',
    'PawLife companionship session with an invitation to care for Bella',
  ),
  portrait(
    'assets/pawlife/creation',
    1206,
    2622,
    'Character creation',
    'PawLife companion selection showing a dog preview, animal choices and breed options',
  ),
  portrait(
    'assets/pawlife/shelter',
    1206,
    2622,
    'Shelter story',
    'PawLife opening biography for Saffron, a kitten living in a shelter',
  ),
  portrait(
    'assets/pawlife/outing',
    1206,
    2622,
    'Neighbourhood activity',
    'PawLife neighbourhood activity asking the player to guide their pet across a grid towards a ribbon',
  ),
  portrait(
    'assets/pawlife/beach',
    1206,
    2622,
    'Beach activity',
    'PawLife beach scene showing a choice between playing with the foam and following a shell line',
  ),
  portrait(
    'assets/pawlife/progression',
    1206,
    2622,
    'Life progression',
    'PawLife annual review showing Marshmallow’s current stage and the option to begin year one',
  ),
];

export const physioAiScreens: ScreenshotAsset[] = [
  {
    src: 'assets/physio-ai/01-live-squat.webp',
    label: 'Live squat tracking',
    smallSrc: 'assets/physio-ai/01-live-squat-960.webp',
    smallWidth: 960,
    thumbnailSrc: 'assets/physio-ai/01-live-squat-160.webp',
    alt: 'Physio-AI live squat session showing tracked pose landmarks, eleven repetitions and 100% session accuracy',
    width: 1179,
    height: 529,
  },
  {
    src: 'assets/physio-ai/02-live-standing.webp',
    label: 'Standing detection',
    smallSrc: 'assets/physio-ai/02-live-standing-960.webp',
    smallWidth: 960,
    thumbnailSrc: 'assets/physio-ai/02-live-standing-160.webp',
    alt: 'Physio-AI live session detecting the standing position before a squat',
    width: 988,
    height: 437,
  },
  {
    src: 'assets/physio-ai/03-progress-dashboard.webp',
    label: 'Progress dashboard',
    thumbnailSrc: 'assets/physio-ai/03-progress-dashboard-160.webp',
    alt: 'Physio-AI progress dashboard showing session accuracy, rep volume and joint performance',
    width: 902,
    height: 508,
  },
  {
    src: 'assets/physio-ai/04-session-history.webp',
    label: 'Session history',
    smallSrc: 'assets/physio-ai/04-session-history-960.webp',
    smallWidth: 960,
    thumbnailSrc: 'assets/physio-ai/04-session-history-160.webp',
    alt: 'Physio-AI session history showing squat repetitions, accuracy and joint performance',
    width: 1206,
    height: 676,
  },
  {
    src: 'assets/physio-ai/05-profile-settings.webp',
    label: 'Recovery settings',
    thumbnailSrc: 'assets/physio-ai/05-profile-settings-160.webp',
    alt: 'Physio-AI profile and recovery progress screen with personal account details redacted',
    width: 724,
    height: 408,
  },
  {
    src: 'assets/physio-ai/06-ai-feedback-panel.webp',
    label: 'Live feedback',
    thumbnailSrc: 'assets/physio-ai/06-ai-feedback-panel-160.webp',
    alt: 'Physio-AI session panel showing rep count, form score and live corrective feedback',
    width: 360,
    height: 674,
  },
];

export const sumlumeIcon: ScreenshotAsset = {
  src: 'assets/sumlume/icon.webp',
  smallSrc: 'assets/sumlume/icon-160.webp',
  smallWidth: 160,
  sizes: '82px',
  alt: 'Sumlume app icon with glowing number tiles',
  width: 512,
  height: 512,
};

export const portfolioScreen: ScreenshotAsset = {
  src: 'assets/portfolio/01-home.webp',
  smallSrc: 'assets/portfolio/01-home-960.webp',
  smallWidth: 960,
  thumbnailSrc: 'assets/portfolio/01-home-160.webp',
  label: 'Homepage',
  alt: 'Nasim Mosayebi portfolio homepage with name, role, calls to action and a level-select stage showing PathLife',
  width: 1600,
  height: 1000,
};

export const gameIcons = {
  sumlume: sumlumeIcon,
  pathlife: {
    src: 'assets/pathlife/icon.webp',
    smallSrc: 'assets/pathlife/icon-160.webp',
    smallWidth: 160,
    sizes: '80px',
    alt: 'PathLife app icon',
    width: 512,
    height: 512,
  },
  pawlife: {
    src: 'assets/pawlife/icon.webp',
    smallSrc: 'assets/pawlife/icon-192.webp',
    smallWidth: 192,
    sizes: '80px',
    alt: 'PawLife app icon',
    width: 512,
    height: 512,
  },
} satisfies Record<string, ScreenshotAsset>;

const hospitalSize = { width: 2000, height: 1083 } as const;

export const co2TrackerScreens: ScreenshotAsset[] = [
  {
    src: 'assets/co2-tracker/01-customer-page.webp',
    label: 'Customer dashboard',
    smallSrc: 'assets/co2-tracker/01-customer-page-960.webp',
    smallWidth: 960,
    thumbnailSrc: 'assets/co2-tracker/01-customer-page-160.webp',
    alt: 'ECOlution customer page with sidebar, product search, photo upload and barcode lookup controls',
    width: 2000,
    height: 1003,
  },
  {
    src: 'assets/co2-tracker/02-search-results.webp',
    label: 'Product search',
    smallSrc: 'assets/co2-tracker/02-search-results-960.webp',
    smallWidth: 960,
    thumbnailSrc: 'assets/co2-tracker/02-search-results-160.webp',
    alt: 'ECOlution search results showing three laptops and their carbon footprints: Apple MacBook, Dell XPS and Framework',
    width: 2000,
    height: 1233,
  },
  {
    src: 'assets/co2-tracker/03-barcode-result.webp',
    label: 'Barcode lookup',
    smallSrc: 'assets/co2-tracker/03-barcode-result-960.webp',
    smallWidth: 960,
    thumbnailSrc: 'assets/co2-tracker/03-barcode-result-160.webp',
    alt: 'ECOlution typed barcode lookup showing an Apple MacBook result with a 200 kg carbon footprint',
    width: 2000,
    height: 966,
  },
  {
    src: 'assets/co2-tracker/04-upload-simulated.webp',
    label: 'Simulated photo lookup',
    smallSrc: 'assets/co2-tracker/04-upload-simulated-960.webp',
    smallWidth: 960,
    thumbnailSrc: 'assets/co2-tracker/04-upload-simulated-160.webp',
    alt: 'ECOlution prototype photo upload alert showing simulated recognition of Training Shoes',
    width: 2000,
    height: 863,
  },
];

export const hospitalScreens: ScreenshotAsset[] = [
  {
    src: 'assets/hospital/01-login.webp',
    label: 'Hospital search',
    smallSrc: 'assets/hospital/01-login-960.webp',
    smallWidth: 960,
    thumbnailSrc: 'assets/hospital/01-login-160.webp',
    alt: 'Hospital Appointment System start screen for finding a hospital',
    ...hospitalSize,
  },
  {
    src: 'assets/hospital/02-booking.webp',
    label: 'Choose a date and time',
    smallSrc: 'assets/hospital/02-booking-960.webp',
    smallWidth: 960,
    thumbnailSrc: 'assets/hospital/02-booking-160.webp',
    alt: 'Hospital Appointment System booking module with calendar and time choices',
    ...hospitalSize,
  },
  {
    src: 'assets/hospital/03-confirmation.webp',
    label: 'Booking confirmation',
    smallSrc: 'assets/hospital/03-confirmation-960.webp',
    smallWidth: 960,
    thumbnailSrc: 'assets/hospital/03-confirmation-160.webp',
    alt: 'Hospital Appointment System confirmation for a fictional appointment',
    ...hospitalSize,
  },
  {
    src: 'assets/hospital/04-schedule.webp',
    label: 'Appointment schedule',
    smallSrc: 'assets/hospital/04-schedule-960.webp',
    smallWidth: 960,
    thumbnailSrc: 'assets/hospital/04-schedule-160.webp',
    alt: 'Hospital Appointment System appointment schedule update screen',
    ...hospitalSize,
  },
];

export const hospitalTestScreen: ScreenshotAsset = {
  src: 'assets/hospital/05-tests.webp',
  label: 'JUnit test result',
  smallSrc: 'assets/hospital/05-tests-960.webp',
  smallWidth: 960,
  thumbnailSrc: 'assets/hospital/05-tests-160.webp',
  alt: 'JUnit terminal output showing the Hospital booking module test passing',
  width: 1880,
  height: 825,
};
