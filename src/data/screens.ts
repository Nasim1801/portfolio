export interface ScreenshotAsset {
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

const portraitSize = { width: 1179, height: 2556 } as const;
const portraitResponsive = {
  smallWidth: 640,
  sizes: '(max-width: 700px) 80vw, 360px',
} as const;

export const pathLifeScreens: ScreenshotAsset[] = [
  {
    src: 'assets/pathlife/01-main.webp',
    smallSrc: 'assets/pathlife/01-main-640.webp',
    fallbackSrc: 'assets/pathlife/01-main.png',
    alt: 'PathLife main life screen showing the character age and stat bars',
    ...portraitSize,
    ...portraitResponsive,
  },
  {
    src: 'assets/pathlife/02-event.webp',
    smallSrc: 'assets/pathlife/02-event-640.webp',
    fallbackSrc: 'assets/pathlife/02-event.png',
    alt: 'PathLife life event showing story text and choices',
    ...portraitSize,
    ...portraitResponsive,
  },
  {
    src: 'assets/pathlife/03-career.webp',
    smallSrc: 'assets/pathlife/03-career-640.webp',
    fallbackSrc: 'assets/pathlife/03-career.png',
    alt: 'PathLife career screen showing available jobs',
    ...portraitSize,
    ...portraitResponsive,
  },
  {
    src: 'assets/pathlife/04-education.webp',
    smallSrc: 'assets/pathlife/04-education-640.webp',
    fallbackSrc: 'assets/pathlife/04-education.png',
    alt: 'PathLife education screen showing study options',
    ...portraitSize,
    ...portraitResponsive,
  },
  {
    src: 'assets/pathlife/05-profile.webp',
    smallSrc: 'assets/pathlife/05-profile-640.webp',
    fallbackSrc: 'assets/pathlife/05-profile.png',
    alt: 'PathLife character profile and life summary screen',
    ...portraitSize,
    ...portraitResponsive,
  },
];

export const pawLifeScreens: ScreenshotAsset[] = [
  {
    src: 'assets/pawlife/01-home.webp',
    smallSrc: 'assets/pawlife/01-home-640.webp',
    fallbackSrc: 'assets/pawlife/01-home.png',
    alt: "PawLife home screen showing Maple's room, life stage and current story",
    ...portraitSize,
    ...portraitResponsive,
  },
  {
    src: 'assets/pawlife/02-minigame.webp',
    smallSrc: 'assets/pawlife/02-minigame-640.webp',
    fallbackSrc: 'assets/pawlife/02-minigame.png',
    alt: 'PawLife Tug of War minigame in action',
    ...portraitSize,
    ...portraitResponsive,
  },
  {
    src: 'assets/pawlife/03-minigames-list.webp',
    smallSrc: 'assets/pawlife/03-minigames-list-640.webp',
    fallbackSrc: 'assets/pawlife/03-minigames-list.png',
    alt: 'PawLife screen showing the choice of minigames',
    available: false,
    ...portraitSize,
    ...portraitResponsive,
  },
  {
    src: 'assets/pawlife/04-event.webp',
    smallSrc: 'assets/pawlife/04-event-640.webp',
    fallbackSrc: 'assets/pawlife/04-event.png',
    alt: 'PawLife care story for Maple showing three player choices',
    ...portraitSize,
    ...portraitResponsive,
  },
  {
    src: 'assets/pawlife/05-achievements.webp',
    smallSrc: 'assets/pawlife/05-achievements-640.webp',
    fallbackSrc: 'assets/pawlife/05-achievements.png',
    alt: 'PawLife Life Album showing the scores leaderboard',
    ...portraitSize,
    ...portraitResponsive,
  },
  {
    src: 'assets/pawlife/06-share-card.webp',
    smallSrc: 'assets/pawlife/06-share-card-640.webp',
    fallbackSrc: 'assets/pawlife/06-share-card.png',
    alt: 'PawLife shareable life results card',
    available: false,
    ...portraitSize,
    ...portraitResponsive,
  },
];

export const physioAiScreens: ScreenshotAsset[] = [
  {
    src: 'assets/physio-ai/01-live-squat.webp',
    fallbackSrc: 'assets/physio-ai/01-live-squat.png',
    alt: 'Physio-AI live squat session showing tracked pose landmarks, eleven repetitions and 100% session accuracy',
    width: 1179,
    height: 529,
  },
  {
    src: 'assets/physio-ai/02-live-standing.webp',
    fallbackSrc: 'assets/physio-ai/02-live-standing.png',
    alt: 'Physio-AI live session detecting the standing position before a squat',
    width: 988,
    height: 437,
  },
  {
    src: 'assets/physio-ai/03-progress-dashboard.webp',
    fallbackSrc: 'assets/physio-ai/03-progress-dashboard.png',
    alt: 'Physio-AI progress dashboard showing session accuracy, rep volume and joint performance',
    width: 902,
    height: 508,
  },
  {
    src: 'assets/physio-ai/04-session-history.webp',
    fallbackSrc: 'assets/physio-ai/04-session-history.png',
    alt: 'Physio-AI session history showing squat repetitions, accuracy and joint performance',
    width: 1206,
    height: 676,
  },
  {
    src: 'assets/physio-ai/05-profile-settings.webp',
    fallbackSrc: 'assets/physio-ai/05-profile-settings.png',
    alt: 'Physio-AI profile and recovery progress screen with personal account details redacted',
    width: 724,
    height: 408,
  },
  {
    src: 'assets/physio-ai/06-ai-feedback-panel.webp',
    fallbackSrc: 'assets/physio-ai/06-ai-feedback-panel.png',
    alt: 'Physio-AI session panel showing rep count, form score and live corrective feedback',
    width: 360,
    height: 674,
  },
];

export const gameIcons = {
  pathlife: {
    src: 'assets/pathlife/icon.webp',
    smallSrc: 'assets/pathlife/icon-192.webp',
    smallWidth: 192,
    sizes: '80px',
    fallbackSrc: 'assets/pathlife/icon.png',
    alt: 'PathLife app icon',
    width: 512,
    height: 512,
  },
  pawlife: {
    src: 'assets/pawlife/icon.webp',
    smallSrc: 'assets/pawlife/icon-192.webp',
    smallWidth: 192,
    sizes: '80px',
    fallbackSrc: 'assets/pawlife/icon.png',
    alt: 'PawLife app icon',
    width: 512,
    height: 512,
  },
} satisfies Record<string, ScreenshotAsset>;

const hospitalSize = { width: 2000, height: 1083 } as const;

export const co2TrackerScreens: ScreenshotAsset[] = [
  {
    src: 'assets/co2-tracker/01-customer-page.webp',
    fallbackSrc: 'assets/co2-tracker/01-customer-page.png',
    alt: 'ECOlution customer page with sidebar, product search, photo upload and barcode lookup controls',
    width: 2000,
    height: 1003,
  },
  {
    src: 'assets/co2-tracker/02-search-results.webp',
    fallbackSrc: 'assets/co2-tracker/02-search-results.png',
    alt: 'ECOlution search results showing three laptops and their carbon footprints: Apple MacBook, Dell XPS and Framework',
    width: 2000,
    height: 1233,
  },
  {
    src: 'assets/co2-tracker/03-barcode-result.webp',
    fallbackSrc: 'assets/co2-tracker/03-barcode-result.png',
    alt: 'ECOlution typed barcode lookup showing an Apple MacBook result with a 200 kg carbon footprint',
    width: 2000,
    height: 966,
  },
  {
    src: 'assets/co2-tracker/04-upload-simulated.webp',
    fallbackSrc: 'assets/co2-tracker/04-upload-simulated.png',
    alt: 'ECOlution prototype photo upload alert showing simulated recognition of Training Shoes',
    width: 2000,
    height: 863,
  },
];

export const hospitalScreens: ScreenshotAsset[] = [
  {
    src: 'assets/hospital/01-login.webp',
    fallbackSrc: 'assets/hospital/01-login.png',
    alt: 'Hospital Appointment System start screen for finding a hospital',
    ...hospitalSize,
  },
  {
    src: 'assets/hospital/02-booking.webp',
    fallbackSrc: 'assets/hospital/02-booking.png',
    alt: 'Hospital Appointment System booking module with calendar and time choices',
    ...hospitalSize,
  },
  {
    src: 'assets/hospital/03-confirmation.webp',
    fallbackSrc: 'assets/hospital/03-confirmation.png',
    alt: 'Hospital Appointment System confirmation for a fictional appointment',
    ...hospitalSize,
  },
  {
    src: 'assets/hospital/04-schedule.webp',
    fallbackSrc: 'assets/hospital/04-schedule.png',
    alt: 'Hospital Appointment System appointment schedule update screen',
    ...hospitalSize,
  },
];

export const hospitalTestScreen: ScreenshotAsset = {
  src: 'assets/hospital/05-tests.webp',
  fallbackSrc: 'assets/hospital/05-tests.png',
  alt: 'JUnit terminal output showing the Hospital booking module test passing',
  width: 1880,
  height: 825,
};
