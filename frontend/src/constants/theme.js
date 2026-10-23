/**
 * =========================================================================
 * SINGLE SOURCE OF TRUTH: GLOBAL THEME & COLOR COMBINATIONS ARCHITECTURE
 * =========================================================================
 * Yaha sabhi color combinations ek structured array aur object me define hain.
 * Kisi bhi naye combination ko test karne ke liye sirf ACTIVE_PALETTE_NAME
 * ko change karna hoga (e.g. "combo1" ya "combo2").
 * Poore application ke sabhi components, cards, buttons, charts bina kisi
 * doosri file ko chhue automatically update ho jayenge!
 * =========================================================================
 */

export const COLOR_COMBINATIONS = [
  {
    id: "combo1",
    name: "Ice Cyan & Midnight Obsidian",
    raw: {
      accent: "#a8dce7",
      navy: "#101422",
      white: "#ffffff",
      charcoal: "#272b3b",
    },
    // Dark mode variables
    dark: {
      "--color-bg-base": "#101422",
      "--color-surface": "#171c2e",
      "--color-surface-elevated": "#272b3b",
      "--color-border": "#272b3b",
      "--color-border-subtle": "rgba(39, 43, 59, 0.7)",
      "--color-border-focus": "#a8dce7",
      "--color-primary": "#a8dce7",
      "--color-primary-hover": "#92cdd9",
      "--color-primary-text": "#101422",
      "--color-text-main": "#ffffff",
      "--color-text-secondary": "#a8dce7",
      "--color-text-muted": "#8896af",
      "--color-accent": "#a8dce7",
      "--glow-primary": "rgba(168, 220, 231, 0.35)",
    },
    // Light mode variables
    light: {
      "--color-bg-base": "#f3f7fa",
      "--color-surface": "#ffffff",
      "--color-surface-elevated": "#ffffff",
      "--color-border": "#d4e3eb",
      "--color-border-subtle": "#e5eff4",
      "--color-border-focus": "#a8dce7",
      "--color-primary": "#101422",
      "--color-primary-hover": "#272b3b",
      "--color-primary-text": "#ffffff",
      "--color-text-main": "#101422",
      "--color-text-secondary": "#272b3b",
      "--color-text-muted": "#62718a",
      "--color-accent": "#a8dce7",
      "--glow-primary": "rgba(168, 220, 231, 0.25)",
    },
    charts: [
      "#a8dce7",
      "#10b981",
      "#f59e0b",
      "#ec4899",
      "#8b5cf6",
      "#3b82f6",
      "#f43f5e",
    ],
  },

  {
    id: "combo2",
    name: "Blue (Skin), Cornflower, Periwinkle & Pearl",
    raw: {
      blueSkin: "#10276b",
      cornflower: "#588dd2",
      periwinkle: "#c0cfff",
      pearl: "#f4f1ee",
    },
    // Dark mode variables
    dark: {
      "--color-bg-base": "#10276b",
      "--color-surface": "#16317b",
      "--color-surface-elevated": "#1e3e94",
      "--color-border": "#284fa8",
      "--color-border-subtle": "rgba(192, 207, 255, 0.2)",
      "--color-border-focus": "#588dd2",
      "--color-primary": "#588dd2",
      "--color-primary-hover": "#4778b8",
      "--color-primary-text": "#ffffff",
      "--color-text-main": "#f4f1ee",
      "--color-text-secondary": "#c0cfff",
      "--color-text-muted": "#c0cfff",
      "--color-accent": "#c0cfff",
      "--glow-primary": "rgba(88, 141, 210, 0.45)",
    },
    // Light mode variables
    light: {
      "--color-bg-base": "#f4f1ee",
      "--color-surface": "#ffffff",
      "--color-surface-elevated": "#ffffff",
      "--color-border": "#c0cfff",
      "--color-border-subtle": "rgba(192, 207, 255, 0.5)",
      "--color-border-focus": "#588dd2",
      "--color-primary": "#588dd2",
      "--color-primary-hover": "#4778b8",
      "--color-primary-text": "#ffffff",
      "--color-text-main": "#10276b",
      "--color-text-secondary": "#10276b",
      "--color-text-muted": "#4a6096",
      "--color-accent": "#588dd2",
      "--glow-primary": "rgba(88, 141, 210, 0.25)",
    },
    charts: [
      "#588dd2",
      "#c0cfff",
      "#10276b",
      "#10b981",
      "#f59e0b",
      "#f43f5e",
      "#8b5cf6",
    ],
  },

  // -------------------------------------------------------------------------
  // COMBO 3: Image 1 - COLOUR PALETTE (Ocean, Sun & Sky / Gold & Navy)
  // White: #FFFFFF, Sun: #F2A900, Ocean: #003087, Sand: #FFE264, Sky: #307FE2, Midnight: #00205B
  // -------------------------------------------------------------------------
  {
    id: "combo3",
    name: "Ocean, Sun & Sky (Blue & Gold)",
    raw: {
      white: "#FFFFFF",
      sun: "#F2A900",
      ocean: "#003087",
      sand: "#FFE264",
      sky: "#307FE2",
      midnight: "#00205B",
      black: "#000000",
    },
    dark: {
      "--color-bg-base": "#00205B",
      "--color-surface": "#003087",
      "--color-surface-elevated": "#083b99",
      "--color-border": "#307FE2",
      "--color-border-subtle": "rgba(48, 127, 226, 0.25)",
      "--color-border-focus": "#F2A900",
      "--color-primary": "#F2A900",
      "--color-primary-hover": "#d99700",
      "--color-primary-text": "#00205B",
      "--color-text-main": "#FFFFFF",
      "--color-text-secondary": "#FFE264",
      "--color-text-muted": "#9ec1f7",
      "--color-accent": "#307FE2",
      "--glow-primary": "rgba(242, 169, 0, 0.45)",
    },
    light: {
      "--color-bg-base": "#f4f8fe",
      "--color-surface": "#FFFFFF",
      "--color-surface-elevated": "#ffffff",
      "--color-border": "#c2d8f8",
      "--color-border-subtle": "rgba(48, 127, 226, 0.2)",
      "--color-border-focus": "#307FE2",
      "--color-primary": "#003087",
      "--color-primary-hover": "#00205B",
      "--color-primary-text": "#FFFFFF",
      "--color-text-main": "#00205B",
      "--color-text-secondary": "#003087",
      "--color-text-muted": "#506894",
      "--color-accent": "#F2A900",
      "--glow-primary": "rgba(0, 48, 135, 0.25)",
    },
    charts: [
      "#F2A900",
      "#307FE2",
      "#003087",
      "#FFE264",
      "#00205B",
      "#10b981",
      "#f43f5e",
    ],
  },

  // -------------------------------------------------------------------------
  // COMBO 4: Image 2 - Alex Cristache #MINDFULPALETTES NO. 245
  // Alabaster: #EFF0F0, Buttercup: #EEDD55, Amber: #E9AD17, Marine: #095BAF, Navy: #062A78, Midnight: #000741
  // -------------------------------------------------------------------------
  {
    id: "combo4",
    name: "Mindful Marine & Golden Amber (Alex Cristache)",
    raw: {
      alabaster: "#EFF0F0",
      buttercup: "#EEDD55",
      goldenAmber: "#E9AD17",
      marineBlue: "#095BAF",
      royalNavy: "#062A78",
      midnightIndigo: "#000741",
    },
    dark: {
      "--color-bg-base": "#000741",
      "--color-surface": "#062A78",
      "--color-surface-elevated": "#095BAF",
      "--color-border": "#1a4bb5",
      "--color-border-subtle": "rgba(9, 91, 175, 0.35)",
      "--color-border-focus": "#E9AD17",
      "--color-primary": "#E9AD17",
      "--color-primary-hover": "#d1990e",
      "--color-primary-text": "#000741",
      "--color-text-main": "#EFF0F0",
      "--color-text-secondary": "#EEDD55",
      "--color-text-muted": "#8fa8d6",
      "--color-accent": "#095BAF",
      "--glow-primary": "rgba(233, 173, 23, 0.45)",
    },
    light: {
      "--color-bg-base": "#EFF0F0",
      "--color-surface": "#FFFFFF",
      "--color-surface-elevated": "#ffffff",
      "--color-border": "#cdd7eb",
      "--color-border-subtle": "rgba(9, 91, 175, 0.15)",
      "--color-border-focus": "#095BAF",
      "--color-primary": "#095BAF",
      "--color-primary-hover": "#062A78",
      "--color-primary-text": "#FFFFFF",
      "--color-text-main": "#000741",
      "--color-text-secondary": "#062A78",
      "--color-text-muted": "#4d648d",
      "--color-accent": "#E9AD17",
      "--glow-primary": "rgba(9, 91, 175, 0.25)",
    },
    charts: [
      "#E9AD17",
      "#095BAF",
      "#062A78",
      "#EEDD55",
      "#000741",
      "#10b981",
      "#f43f5e",
    ],
  },

  // -------------------------------------------------------------------------
  // COMBO 5: Image 3 - Uxintace Palette
  // Graphite: #31393C, Electric Blue: #2176FF, Sky Blue: #33A1FD, Sunglow: #FDCA40, Tangerine: #F79824
  // -------------------------------------------------------------------------
  {
    id: "combo5",
    name: "Uxintace Electric Blue & Sunset Amber",
    raw: {
      graphite: "#31393C",
      electricBlue: "#2176FF",
      skyBlue: "#33A1FD",
      sunglow: "#FDCA40",
      tangerine: "#F79824",
    },
    dark: {
      "--color-bg-base": "#1a1f22",
      "--color-surface": "#31393C",
      "--color-surface-elevated": "#3d474b",
      "--color-border": "#4c595e",
      "--color-border-subtle": "rgba(51, 161, 253, 0.2)",
      "--color-border-focus": "#2176FF",
      "--color-primary": "#2176FF",
      "--color-primary-hover": "#1b63db",
      "--color-primary-text": "#ffffff",
      "--color-text-main": "#ffffff",
      "--color-text-secondary": "#33A1FD",
      "--color-text-muted": "#94a5ac",
      "--color-accent": "#FDCA40",
      "--glow-primary": "rgba(33, 118, 255, 0.45)",
    },
    light: {
      "--color-bg-base": "#f4f7fb",
      "--color-surface": "#FFFFFF",
      "--color-surface-elevated": "#ffffff",
      "--color-border": "#d0dbe8",
      "--color-border-subtle": "rgba(33, 118, 255, 0.15)",
      "--color-border-focus": "#2176FF",
      "--color-primary": "#2176FF",
      "--color-primary-hover": "#1b63db",
      "--color-primary-text": "#ffffff",
      "--color-text-main": "#31393C",
      "--color-text-secondary": "#2176FF",
      "--color-text-muted": "#5d6e75",
      "--color-accent": "#F79824",
      "--glow-primary": "rgba(33, 118, 255, 0.25)",
    },
    charts: [
      "#2176FF",
      "#F79824",
      "#33A1FD",
      "#FDCA40",
      "#31393C",
      "#10b981",
      "#f43f5e",
    ],
  },
];

/**
 * Object lookup for fast indexing by key:
 * Automatically populated from COLOR_COMBINATIONS array!
 */
export const THEME_PALETTES = COLOR_COMBINATIONS.reduce((acc, combo) => {
  acc[combo.id] = combo;
  return acc;
}, {});

/**
 * =========================================================================
 * >>> ACTIVE THEME SELECTOR <<<
 * Theme switch karne ke liye sirf yaha name change karo:
 *   "combo1" -> Ice Cyan & Midnight Obsidian
 *   "combo2" -> Blue (Skin), Cornflower, Periwinkle & Pearl
 *   "combo3" -> Ocean, Sun & Sky (Blue & Gold) [Image 1] (NEW)
 *   "combo4" -> Mindful Marine & Golden Amber [Image 2 - Alex Cristache] (NEW)
 *   "combo5" -> Uxintace Electric Blue & Sunset Amber [Image 3] (NEW)
 * 
 * Koi bhi doosri file ko change karne ki bilkul zaroorat nahi hai!
 * =========================================================================
 */
export const ACTIVE_PALETTE_NAME = "combo5";

// Exported active theme combination
export const ACTIVE_PALETTE =
  THEME_PALETTES[ACTIVE_PALETTE_NAME] || COLOR_COMBINATIONS[0];

// Alias for convenience
export const ACTIVE_THEME = ACTIVE_PALETTE_NAME;

/**
 * Dynamically applies the CSS properties of the active combination to the DOM.
 */
export function applyThemeVariables(isDark = true) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  const activeVars = isDark ? ACTIVE_PALETTE.dark : ACTIVE_PALETTE.light;
  Object.entries(activeVars).forEach(([key, val]) => {
    root.style.setProperty(key, val);
  });
}

/**
 * Semantic Color Mapping
 */
export const THEME_COLORS = {
  primary: {
    DEFAULT: "var(--color-primary)",
    hover: "var(--color-primary-hover)",
    text: "var(--color-primary-text)",
    surface: "var(--color-surface-elevated)",
    dark: "var(--color-bg-base)",
    light: "var(--color-surface)",
  },
  income: {
    DEFAULT: "#10b981", // Emerald
    hover: "#059669",
    light: "#d1fae5",
    subtleBg: "rgba(16, 185, 129, 0.12)",
    border: "rgba(16, 185, 129, 0.3)",
  },
  expense: {
    DEFAULT: "#f43f5e", // Rose
    hover: "#e11d48",
    light: "#ffe4e6",
    subtleBg: "rgba(244, 63, 94, 0.12)",
    border: "rgba(244, 63, 94, 0.3)",
  },
  warning: {
    DEFAULT: "#f59e0b", // Amber
    hover: "#d97706",
    light: "#fef3c7",
    subtleBg: "rgba(245, 158, 11, 0.12)",
    border: "rgba(245, 158, 11, 0.3)",
  },
  info: {
    DEFAULT: "var(--color-primary)",
    hover: "var(--color-primary-hover)",
    light: "var(--color-surface-elevated)",
    subtleBg: "rgba(88, 141, 210, 0.15)",
    border: "var(--color-border)",
  },
};

/**
 * Chart & Visual Analytics Palette
 */
export const CHART_COLORS = ACTIVE_PALETTE.charts;

/**
 * Dynamic Gradients
 */
export const GRADIENTS = {
  primary:
    "bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-hover)] text-[var(--color-primary-text)]",
  emerald: "bg-gradient-to-r from-emerald-500 to-teal-600 text-white",
  rose: "bg-gradient-to-r from-rose-500 to-pink-600 text-white",
  amber: "bg-gradient-to-r from-amber-500 to-orange-500 text-white",
  darkSurface:
    "from-[var(--color-bg-base)] via-[var(--color-surface)] to-[var(--color-surface-elevated)]",
};

/**
 * Badge Styles
 */
export const BADGE_STYLES = {
  primary:
    "bg-[var(--color-primary)]/15 text-[var(--color-text-main)] dark:text-[var(--color-text-secondary)] border-[var(--color-border)]",
  success:
    "bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60",
  danger:
    "bg-rose-50 text-rose-700 border-rose-200/80 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/60",
  warning:
    "bg-amber-50 text-amber-700 border-amber-200/80 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60",
  info:
    "bg-[var(--color-primary)]/15 text-[var(--color-text-main)] dark:text-[var(--color-text-secondary)] border-[var(--color-border)]",
  purple:
    "bg-purple-50 text-purple-700 border-purple-200/80 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800/60",
  neutral:
    "bg-slate-100 text-slate-700 border-slate-200 dark:bg-[var(--color-surface-elevated)] dark:text-slate-200 dark:border-[var(--color-border)]",
};

export const BADGE_DOT_COLORS = {
  primary: "bg-[var(--color-primary)]",
  success: "bg-emerald-500",
  danger: "bg-rose-500",
  warning: "bg-amber-500",
  info: "bg-[var(--color-primary)]",
  purple: "bg-purple-500",
  neutral: "bg-slate-400",
};

/**
 * StatCard Variant Styles
 */
export const STAT_CARD_STYLES = {
  balance: {
    iconBg:
      "bg-[var(--color-primary)]/20 text-[var(--color-text-main)] dark:bg-[var(--color-surface)] dark:text-[var(--color-text-secondary)] border border-[var(--color-border)]",
    glow: "hover:border-[var(--color-primary)]/70",
    badge: "bg-[var(--color-primary)]/15 text-[var(--color-text-secondary)]",
  },
  income: {
    iconBg:
      "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-800/50",
    glow: "hover:border-emerald-300 dark:hover:border-emerald-700/80",
    badge:
      "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300",
  },
  expense: {
    iconBg:
      "bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-200/50 dark:border-rose-800/50",
    glow: "hover:border-rose-300 dark:hover:border-rose-700/80",
    badge:
      "bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300",
  },
  warning: {
    iconBg:
      "bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-200/50 dark:border-amber-800/50",
    glow: "hover:border-amber-300 dark:hover:border-amber-700/80",
    badge:
      "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300",
  },
  default: {
    iconBg:
      "bg-slate-100 text-slate-700 dark:bg-[var(--color-surface-elevated)] dark:text-slate-300 border border-slate-200 dark:border-[var(--color-border)]",
    glow: "hover:border-slate-300 dark:hover:border-[var(--color-primary)]/40",
    badge:
      "bg-slate-100 text-slate-700 dark:bg-[var(--color-surface-elevated)] dark:text-slate-300",
  },
};

/**
 * Button Styles
 */
export const BUTTON_STYLES = {
  primary:
    "bg-[var(--color-primary)] text-[var(--color-primary-text)] font-black shadow-sm hover:opacity-90 active:scale-95 shadow-[var(--color-primary)]/20",
  gradient:
    "bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-hover)] text-[var(--color-primary-text)] font-black shadow-md hover:opacity-95 active:scale-95 shadow-[var(--color-primary)]/25 border-0",
  outline:
    "border border-[var(--color-border)] text-[var(--color-text-main)] bg-[var(--color-surface)]/60 hover:bg-[var(--color-surface-elevated)]",
  ghost:
    "text-[var(--color-text-main)] hover:bg-[var(--color-surface-elevated)]",
  danger:
    "bg-rose-600 text-white shadow-sm hover:bg-rose-700 active:bg-rose-800 dark:bg-rose-500 dark:hover:bg-rose-600 shadow-rose-500/20",
  success:
    "bg-emerald-600 text-white shadow-sm hover:bg-emerald-700 active:bg-emerald-800 dark:bg-emerald-500 dark:hover:bg-emerald-600 shadow-emerald-500/20",
};
