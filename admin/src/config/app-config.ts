import packageJson from "../../package.json";

const currentYear = new Date().getFullYear();

const appName = import.meta.env.VITE_APP_NAME || "An Chuyến Admin";
const appDesc = import.meta.env.VITE_APP_DESCRIPTION || "Trang quản trị hệ thống An Chuyến";

export const APP_CONFIG = {
  name: appName,
  version: packageJson.version,
  copyright: `© ${currentYear}, ${appName}.`,
  meta: {
    title: `${appName} - Dashboard`,
    description: appDesc,
  },
};
