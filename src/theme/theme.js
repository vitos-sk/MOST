/**
 * Theme Configuration
 *
 * Современная тема в стиле neo-glass / soft dark UI
 * Оптимизирована для Telegram Web App и мобильных устройств
 */

export const theme = {
  // Colors - Beige base with warm accent colors
  colors: {
    // Backgrounds
    bg: {
      primary: "#faf8f3", // Light beige base
      secondary: "#f5f1eb", // Slightly darker beige
      glass: "rgba(255, 255, 255, 0.7)", // Glass effect on beige
      glassHover: "rgba(255, 255, 255, 0.8)",
      card: "rgba(255, 255, 255, 0.85)", // White cards on beige
      cardHover: "rgba(255, 255, 255, 0.95)",
      overlay: "rgba(0, 0, 0, 0.3)",
    },

    // Accent colors (warm brown/terracotta palette for beige background)
    accent: {
      primary: "#C44536", // Warm terracotta red (primary accent)
      primaryHover: "#A6392D",
      secondary: "#D2691E", // Chocolate orange
      tertiary: "#CD5C5C", // Indian red
      gradient: "linear-gradient(135deg, #C44536 0%, #D2691E 100%)",
      gradientSoft:
        "linear-gradient(135deg, rgba(196, 69, 54, 0.15) 0%, rgba(210, 105, 30, 0.15) 100%)",
    },

    // Text
    text: {
      primary: "#2c2c2c", // Dark text on beige
      secondary: "rgba(44, 44, 44, 0.85)",
      tertiary: "rgba(44, 44, 44, 0.6)",
      muted: "rgba(44, 44, 44, 0.5)",
      inverse: "#faf8f3", // Beige for inverse (on dark elements)
    },

    // Status colors (warm tones for beige background)
    status: {
      success: "#27ae60", // Green (slightly warmer)
      error: "#C44536", // Terracotta red
      warning: "#e67e22", // Warm orange
      info: "#3498db", // Blue (kept for info)
    },

    // Border
    border: {
      default: "rgba(44, 44, 44, 0.15)", // Subtle dark borders on beige
      hover: "rgba(44, 44, 44, 0.25)",
      accent: "rgba(196, 69, 54, 0.4)", // Terracotta accent
      accentHover: "rgba(196, 69, 54, 0.6)",
    },

    // Progress bar colors (warm tones)
    progress: {
      optionA: "#C44536", // Terracotta red
      optionB: "#D2691E", // Chocolate orange
      bg: "rgba(44, 44, 44, 0.1)", // Subtle dark background
    },
  },

  // Spacing (mobile-first scale)
  spacing: {
    xs: "4px",
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "32px",
    xxl: "48px",
  },

  // Border radius
  radius: {
    sm: "8px",
    md: "12px",
    lg: "16px",
    xl: "24px",
    full: "9999px",
  },

  // Shadows (soft, subtle for beige background)
  shadow: {
    sm: "0 2px 8px rgba(0, 0, 0, 0.1)",
    md: "0 4px 16px rgba(0, 0, 0, 0.15)",
    lg: "0 8px 32px rgba(0, 0, 0, 0.2)",
    glow: "0 0 20px rgba(196, 69, 54, 0.3)",
    glowStrong: "0 0 32px rgba(196, 69, 54, 0.4)",
  },

  // Typography
  typography: {
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Helvetica Neue", sans-serif',
    sizes: {
      xs: "12px",
      sm: "14px",
      base: "16px",
      md: "18px",
      lg: "20px",
      xl: "24px",
      "2xl": "28px",
      "3xl": "32px",
    },
    weights: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeights: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.75,
    },
  },

  // Transitions
  transition: {
    fast: "150ms ease",
    base: "200ms ease",
    slow: "300ms ease",
    slower: "500ms ease",
  },

  // Z-index scale
  zIndex: {
    base: 1,
    dropdown: 10,
    sticky: 20,
    overlay: 30,
    modal: 40,
    tooltip: 50,
  },

  // Breakpoints (mobile-first)
  breakpoints: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
  },
};

/**
 * Helper function to apply glass morphism effect
 */
export const glassEffect = `
  background: ${theme.colors.bg.glass};
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid ${theme.colors.border.default};
`;

/**
 * Helper function to apply card glass effect
 */
export const cardGlass = `
  background: ${theme.colors.bg.card};
  backdrop-filter: blur(10px) saturate(120%);
  -webkit-backdrop-filter: blur(10px) saturate(120%);
  border: 1px solid ${theme.colors.border.default};
`;
