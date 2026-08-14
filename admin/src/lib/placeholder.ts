// Self-contained fallback thumbnail — no third-party image service, so it can
// never 404/502 (via.placeholder.com went offline; we used to rely on it here).
export const IMAGE_PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='80' viewBox='0 0 150 80'%3E%3Crect width='150' height='80' fill='%23e2e8f0'/%3E%3Cpath d='M60 30h30v20H60z' fill='%23cbd5e1'/%3E%3Ccircle cx='68' cy='38' r='4' fill='%23e2e8f0'/%3E%3Cpath d='M60 46l8-8 6 6 8-8 8 10H60z' fill='%23e2e8f0'/%3E%3C/svg%3E";
