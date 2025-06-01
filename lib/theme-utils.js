// Theme utility functions for complete theme customization
export function hslToString(hsl) {
  if (typeof hsl === "string") return hsl;
  if (typeof hsl === "object" && hsl.h !== undefined) {
    return `${hsl.h} ${hsl.s}% ${hsl.l}%`;
  }
  return hsl;
}

export function applyThemeToDocument(themeConfig, mode = "light") {
  if (typeof window === "undefined") return;

  const root = document.documentElement;
  const colors = themeConfig[mode];

  // Apply all color CSS variables
  Object.entries(colors).forEach(([key, value]) => {
    root.style.setProperty(`--${key}`, value);
  });

  // Apply theme-specific properties like radius
  if (themeConfig.radius) {
    root.style.setProperty("--radius", themeConfig.radius);

    // Also set radius variants that are commonly used
    const radiusValue = parseFloat(themeConfig.radius);
    const radiusUnit = themeConfig.radius.replace(radiusValue.toString(), "");

    root.style.setProperty(
      "--radius-sm",
      `${Math.max(0, radiusValue - 0.125)}${radiusUnit}`
    );
    root.style.setProperty(
      "--radius-md",
      `${Math.max(0, radiusValue - 0.0625)}${radiusUnit}`
    );
    root.style.setProperty("--radius-lg", themeConfig.radius);
    root.style.setProperty(
      "--radius-xl",
      `${radiusValue + 0.125}${radiusUnit}`
    );
  }

  // Apply shadows
  if (themeConfig.shadows) {
    Object.entries(themeConfig.shadows).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value);
    });
  }

  // Apply fonts with proper CSS variable names
  if (themeConfig.fonts) {
    Object.entries(themeConfig.fonts).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value);
    });
  }
}

// Alternative function if you want to also load Google Fonts dynamically
export function applyThemeWithFontLoading(themeConfig, mode = "light") {
  if (typeof window === "undefined") return;

  // Apply the theme first
  applyThemeToDocument(themeConfig, mode);

  // Load Google Fonts if specified
  if (themeConfig.fonts) {
    const googleFonts = [];

    Object.values(themeConfig.fonts).forEach((fontFamily) => {
      // Extract Google Font names (basic detection)
      const fonts = fontFamily
        .split(",")
        .map((f) => f.trim().replace(/['"]/g, ""));
      fonts.forEach((font) => {
        // Check if it might be a Google Font (not a generic font)
        if (
          ![
            "sans-serif",
            "serif",
            "monospace",
            "cursive",
            "fantasy",
            "ui-sans-serif",
            "ui-serif",
            "ui-monospace",
          ].includes(font.toLowerCase())
        ) {
          googleFonts.push(font);
        }
      });
    });

    // Load unique Google Fonts
    const uniqueFonts = [...new Set(googleFonts)];
    if (uniqueFonts.length > 0) {
      loadGoogleFonts(uniqueFonts);
    }
  }
}

// Helper function to load Google Fonts
function loadGoogleFonts(fontNames) {
  const fontQuery = fontNames.map((name) => name.replace(/ /g, "+")).join("|");

  const link = document.createElement("link");
  link.href = `https://fonts.googleapis.com/css2?family=${fontQuery}:wght@300;400;500;600;700&display=swap`;
  link.rel = "stylesheet";

  // Remove existing Google Fonts link if any
  const existing = document.querySelector('link[href*="fonts.googleapis.com"]');
  if (existing) {
    existing.remove();
  }

  document.head.appendChild(link);
}

export function saveThemePreference(themeId) {
  if (typeof window !== "undefined") {
    localStorage.setItem("selected-theme", themeId);
  }
}

export function loadThemePreference() {
  if (typeof window !== "undefined") {
    return localStorage.getItem("selected-theme") || "default";
  }
  return "default";
}
