// ---------------------------------------------------------------------------
// Green & Clean — client-side data layer.
// No backend database and no external APIs are used: everything is persisted
// in the browser via localStorage. This keeps the app fully functional and
// demo-able without any server-side storage, per project constraints.
// Note: password "hashing" below is a trivial demo-only obfuscation, not
// real cryptography — there is no backend to do this properly.
// ---------------------------------------------------------------------------

export type Role = "user" | "worker" | "admin";
export type ReportStatus = "reported" | "assigned" | "cleaned" | "rejected";

export interface StoredUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: Role;
  state: string;
  city: string;
  points: number;
  verified: boolean; // workers require admin approval; users/admin auto-verified
  createdAt: string;
}

export interface WasteReport {
  id: string;
  userId: string;
  userName: string;
  category: "streetWaste" | "oldHousehold";
  itemType?: string;
  weight?: number;
  description: string;
  photoDataUrl?: string;
  lat: number;
  lng: number;
  city: string;
  status: ReportStatus;
  points: number;
  assignedWorkerId?: string;
  assignedWorkerName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  userId: string;
  description: string;
  points: number; // positive = earned, negative = redeemed
  type: "earned" | "redeemed" | "bonus";
  createdAt: string;
}

export interface Donation {
  id: string;
  userId: string;
  userName: string;
  itemType: string;
  quantity: number;
  condition: string;
  description: string;
  photoDataUrl?: string;
  status: "listed" | "collected";
  createdAt: string;
}

export interface AppNotification {
  id: string;
  userId: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface Reward {
  id: string;
  title: string;
  description: string;
  points: number;
  category: string;
}

const KEYS = {
  users: "gc_users",
  reports: "gc_reports",
  transactions: "gc_transactions",
  donations: "gc_donations",
  notifications: "gc_notifications",
  rewards: "gc_rewards",
  session: "gc_session",
  seeded: "gc_seeded_v1",
};

// ---------------------------------------------------------------------------
// generic helpers
// ---------------------------------------------------------------------------

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // localStorage unavailable (e.g. private mode) — fail silently, app still
    // works in-memory for the current session via React state.
  }
}

export function uid(prefix = ""): string {
  return `${prefix}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

export function hashPassword(pw: string): string {
  // NOT secure — demo-only obfuscation since there is no backend to hash on.
  let h = 0;
  for (let i = 0; i < pw.length; i++) {
    h = (h * 31 + pw.charCodeAt(i)) | 0;
  }
  return h.toString(36);
}

export function haversineMeters(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function osmLink(lat: number, lng: number): string {
  return `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=17/${lat}/${lng}`;
}

export function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min${mins > 1 ? "s" : ""} ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hour${hrs > 1 ? "s" : ""} ago`;
  const days = Math.floor(hrs / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
}

// ---------------------------------------------------------------------------
// seed data — only runs once so the dashboard/admin views aren't empty, and
// so there's a ready-made demo admin account to log in with.
// ---------------------------------------------------------------------------

export function seedIfNeeded() {
  if (read(KEYS.seeded, false)) return;

  const admin: StoredUser = {
    id: uid("u_"),
    name: "Admin",
    email: "admin@greenclean.in",
    passwordHash: hashPassword("admin123"),
    role: "admin",
    state: "Uttar Pradesh",
    city: "Meerut",
    points: 0,
    verified: true,
    createdAt: new Date().toISOString(),
  };

  const demoUser: StoredUser = {
    id: uid("u_"),
    name: "Demo Citizen",
    email: "demo@greenclean.in",
    passwordHash: hashPassword("demo123"),
    role: "user",
    state: "Uttar Pradesh",
    city: "Meerut",
    points: 40,
    verified: true,
    createdAt: new Date().toISOString(),
  };

  const demoWorker: StoredUser = {
    id: uid("u_"),
    name: "Demo Worker",
    email: "worker@greenclean.in",
    passwordHash: hashPassword("worker123"),
    role: "worker",
    state: "Uttar Pradesh",
    city: "Meerut",
    points: 0,
    verified: true,
    createdAt: new Date().toISOString(),
  };

  write(KEYS.users, [admin, demoUser, demoWorker]);

  const rewards: Reward[] = [
    { id: uid("r_"), title: "Plant a Tree", description: "Sponsor a tree plantation in your city", points: 100, category: "Environment" },
    { id: uid("r_"), title: "Eco-friendly Bag", description: "Reusable cotton shopping bag", points: 50, category: "Products" },
    { id: uid("r_"), title: "Coffee Shop Voucher", description: "₹200 voucher for sustainable cafes", points: 150, category: "Food" },
    { id: uid("r_"), title: "Public Transport Pass", description: "1-day free metro/bus pass", points: 80, category: "Transport" },
    { id: uid("r_"), title: "Shopping of Daily Needs", description: "Essential household and daily items", points: 100, category: "Products" },
    { id: uid("r_"), title: "Order Food Discount", description: "Discount coupon for food delivery", points: 300, category: "Food" },
  ];
  write(KEYS.rewards, rewards);

  write(KEYS.reports, []);
  write(KEYS.transactions, []);
  write(KEYS.donations, []);
  write(KEYS.notifications, []);
  write(KEYS.seeded, true);
}

// ---------------------------------------------------------------------------
// users / auth
// ---------------------------------------------------------------------------

export function getUsers(): StoredUser[] {
  return read<StoredUser[]>(KEYS.users, []);
}
function saveUsers(users: StoredUser[]) {
  write(KEYS.users, users);
}

export function getCurrentUser(): StoredUser | null {
  const id = read<string | null>(KEYS.session, null);
  if (!id) return null;
  return getUsers().find((u) => u.id === id) || null;
}

export function setSession(userId: string | null) {
  write(KEYS.session, userId);
}

export function signup(input: {
  name: string;
  email: string;
  password: string;
  role: Role;
  state: string;
  city: string;
}): { ok: true; user: StoredUser } | { ok: false; error: string } {
  const email = input.email.trim().toLowerCase();
  if (!input.name.trim()) return { ok: false, error: "Please enter your name." };
  if (!/^\S+@\S+\.\S+$/.test(email)) return { ok: false, error: "Please enter a valid email address." };
  if (input.password.length < 6) return { ok: false, error: "Password must be at least 6 characters." };

  const users = getUsers();
  if (users.some((u) => u.email === email)) {
    return { ok: false, error: "An account with this email already exists." };
  }

  const user: StoredUser = {
    id: uid("u_"),
    name: input.name.trim(),
    email,
    passwordHash: hashPassword(input.password),
    role: input.role === "admin" ? "user" : input.role, // admin accounts are seeded only
    state: input.state,
    city: input.city,
    points: 0,
    verified: input.role !== "worker", // workers need admin approval
    createdAt: new Date().toISOString(),
  };
  saveUsers([...users, user]);
  return { ok: true, user };
}

export function login(email: string, password: string): { ok: true; user: StoredUser } | { ok: false; error: string } {
  const users = getUsers();
  const user = users.find((u) => u.email === email.trim().toLowerCase());
  if (!user || user.passwordHash !== hashPassword(password)) {
    return { ok: false, error: "Invalid email or password." };
  }
  setSession(user.id);
  return { ok: true, user };
}

export function logout() {
  setSession(null);
}

export function updateUser(userId: string, patch: Partial<StoredUser>) {
  const users = getUsers().map((u) => (u.id === userId ? { ...u, ...patch } : u));
  saveUsers(users);
}

export function deleteUser(userId: string) {
  saveUsers(getUsers().filter((u) => u.id !== userId));
}

// ---------------------------------------------------------------------------
// reports
// ---------------------------------------------------------------------------

export function getReports(): WasteReport[] {
  return read<WasteReport[]>(KEYS.reports, []);
}
function saveReports(reports: WasteReport[]) {
  write(KEYS.reports, reports);
}

export function findNearbyDuplicate(lat: number, lng: number, withinMeters = 60, withinHours = 24): WasteReport | null {
  const cutoff = Date.now() - withinHours * 3600 * 1000;
  const reports = getReports().filter((r) => new Date(r.createdAt).getTime() >= cutoff && r.status !== "rejected");
  for (const r of reports) {
    if (haversineMeters(lat, lng, r.lat, r.lng) <= withinMeters) return r;
  }
  return null;
}

export function addReport(input: Omit<WasteReport, "id" | "status" | "createdAt" | "updatedAt">): WasteReport {
  const report: WasteReport = {
    ...input,
    id: uid("WR"),
    status: "reported",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  saveReports([report, ...getReports()]);
  addPoints(input.userId, input.points, `Waste Report #${report.id}`, "earned");
  return report;
}

export function updateReportStatus(
  reportId: string,
  status: ReportStatus,
  worker?: { id: string; name: string }
) {
  const reports = getReports().map((r) => {
    if (r.id !== reportId) return r;
    return {
      ...r,
      status,
      assignedWorkerId: worker?.id ?? r.assignedWorkerId,
      assignedWorkerName: worker?.name ?? r.assignedWorkerName,
      updatedAt: new Date().toISOString(),
    };
  });
  saveReports(reports);

  const report = reports.find((r) => r.id === reportId);
  if (report) {
    const label =
      status === "assigned" ? "is being picked up by a worker" :
      status === "cleaned" ? "has been cleaned up — thank you!" :
      status === "rejected" ? "was rejected (could not be verified as waste)" : "was updated";
    addNotification(report.userId, `Your report #${report.id} ${label}.`);
  }
}

export function deleteReport(reportId: string) {
  saveReports(getReports().filter((r) => r.id !== reportId));
}

// ---------------------------------------------------------------------------
// wallet / transactions
// ---------------------------------------------------------------------------

export function getTransactions(userId?: string): Transaction[] {
  const all = read<Transaction[]>(KEYS.transactions, []);
  return userId ? all.filter((t) => t.userId === userId) : all;
}

export function addPoints(userId: string, delta: number, description: string, type: Transaction["type"]) {
  const users = getUsers().map((u) => (u.id === userId ? { ...u, points: Math.max(0, u.points + delta) } : u));
  saveUsers(users);

  const tx: Transaction = {
    id: uid("tx_"),
    userId,
    description,
    points: delta,
    type,
    createdAt: new Date().toISOString(),
  };
  write(KEYS.transactions, [tx, ...read<Transaction[]>(KEYS.transactions, [])]);
}

export function redeemReward(userId: string, reward: Reward): { ok: boolean; error?: string } {
  const user = getUsers().find((u) => u.id === userId);
  if (!user) return { ok: false, error: "Not logged in." };
  if (user.points < reward.points) return { ok: false, error: "Not enough points." };
  addPoints(userId, -reward.points, `Redeemed: ${reward.title}`, "redeemed");
  return { ok: true };
}

// ---------------------------------------------------------------------------
// rewards catalog (admin-editable)
// ---------------------------------------------------------------------------

export function getRewards(): Reward[] {
  return read<Reward[]>(KEYS.rewards, []);
}
export function saveRewards(rewards: Reward[]) {
  write(KEYS.rewards, rewards);
}
export function addReward(reward: Omit<Reward, "id">) {
  saveRewards([...getRewards(), { ...reward, id: uid("r_") }]);
}
export function deleteReward(id: string) {
  saveRewards(getRewards().filter((r) => r.id !== id));
}

// ---------------------------------------------------------------------------
// donations
// ---------------------------------------------------------------------------

export function getDonations(userId?: string): Donation[] {
  const all = read<Donation[]>(KEYS.donations, []);
  return userId ? all.filter((d) => d.userId === userId) : all;
}
export function addDonation(input: Omit<Donation, "id" | "status" | "createdAt">): Donation {
  const donation: Donation = {
    ...input,
    id: uid("DN"),
    status: "listed",
    createdAt: new Date().toISOString(),
  };
  write(KEYS.donations, [donation, ...getDonations()]);
  return donation;
}
export function markDonationCollected(id: string) {
  write(
    KEYS.donations,
    getDonations().map((d) => (d.id === id ? { ...d, status: "collected" as const } : d))
  );
}

// ---------------------------------------------------------------------------
// notifications
// ---------------------------------------------------------------------------

export function getNotifications(userId: string): AppNotification[] {
  return read<AppNotification[]>(KEYS.notifications, []).filter((n) => n.userId === userId);
}
export function addNotification(userId: string, message: string) {
  const n: AppNotification = { id: uid("n_"), userId, message, read: false, createdAt: new Date().toISOString() };
  write(KEYS.notifications, [n, ...read<AppNotification[]>(KEYS.notifications, [])]);
}
export function markAllNotificationsRead(userId: string) {
  const all = read<AppNotification[]>(KEYS.notifications, []);
  write(
    KEYS.notifications,
    all.map((n) => (n.userId === userId ? { ...n, read: true } : n))
  );
}
