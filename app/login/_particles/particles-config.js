export const particlesConfig = {
  fullScreen: false,
  background: {
    opacity: 0,
  },
  fpsLimit: 60,
  interactivity: {
    events: {
      onHover: {
        enable: true,
        mode: "bubble",
      },
      resize: true,
    },
    modes: {
      bubble: {
        distance: 100,
        duration: 2,
        opacity: 0.4,
        size: 3,
        speed: 1,
      },
    },
  },
  particles: {
    number: {
      value: 50,
      density: {
        enable: true,
        area: 800,
      },
    },
    color: {
      value: "#d1d5db", // light gray → Premium SaaS feel
    },
    links: {
      enable: false, // airy feel -> no connecting lines
    },
    move: {
      enable: true,
      speed: 0.6,
      direction: "none",
      outModes: {
        default: "out",
      },
    },
    opacity: {
      value: 0.3,
      random: true,
    },
    size: {
      value: { min: 1, max: 3 },
      random: true,
    },
  },
  detectRetina: true,
};
