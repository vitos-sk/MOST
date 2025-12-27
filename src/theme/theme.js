export const theme = {
  colors: {
    bg: {
      primary: "#1e1e1e",
      secondary: "#252526",
      card: "#252526",
      cardHover: "#2d2d30",
      overlay: "rgba(0, 0, 0, 0.7)",
    },

    accent: {
      primary: "#007acc",
      primaryHover: "#005a9e",
      secondary: "#4ec9b0",
      tertiary: "#569cd6",
    },

    text: {
      primary: "#cccccc",
      secondary: "rgba(204, 204, 204, 0.85)",
      tertiary: "rgba(204, 204, 204, 0.6)",
      muted: "rgba(204, 204, 204, 0.5)",
    },

    status: {
      success: "#4ec9b0",
      error: "#f48771",
      warning: "#dcdcaa",
      info: "#569cd6",
    },
    border: {
      default: "rgba(255, 255, 255, 0.1)",
      hover: "rgba(255, 255, 255, 0.2)",
      accent: "rgba(0, 122, 204, 0.5)",
      accentHover: "rgba(0, 122, 204, 0.7)",
    },
    progress: {
      optionA: "#007acc",
      optionB: "#4ec9b0",
      bg: "rgba(255, 255, 255, 0.08)",
    },
  },

  spacing: {
    xs: "4px",
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "32px",
    xxl: "48px",
  },

  typography: {
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", "SF Pro Display", "Roboto", "Helvetica Neue", sans-serif',
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

  transition: {
    fast: "150ms ease",
    base: "200ms ease",
    slow: "300ms ease",
    slower: "500ms ease",
  },

  zIndex: {
    base: 1,
    dropdown: 10,
    sticky: 20,
    overlay: 30,
    modal: 40,
    tooltip: 50,
  },

  breakpoints: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
  },
};

export const cardGlass = `background: ${theme.colors.bg.card};`;
