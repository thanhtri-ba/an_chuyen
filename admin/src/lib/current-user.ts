export function getCurrentAdminUser() {
  try {
    const raw = localStorage.getItem("admin_user");
    if (!raw) throw new Error("no stored user");
    const stored = JSON.parse(raw);
    return {
      id: stored.id as string,
      name: (stored.fullName || stored.email) as string,
      email: stored.email as string,
      avatar: "",
      role: (stored.role || "admin") as string,
    };
  } catch {
    return { id: "unknown", name: "Admin", email: "", avatar: "", role: "admin" };
  }
}
