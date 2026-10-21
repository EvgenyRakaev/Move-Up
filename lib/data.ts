// Mock data for the first iteration. Replace with API/DB calls later.

export type JobStatus = "in-progress" | "scheduled" | "completed" | "needs-crew";

export type InventoryCategory = {
  key: "boxes" | "living" | "bedroom" | "dining" | "appliances";
  name: string;
  details: string;
  qty: number;
};

export type Address = {
  line1: string;
  line2: string;
  area: string;
};

export type Job = {
  id: string;
  customer: string;
  initials: string;
  phone: string;
  email: string;
  customerSince: string;
  size: string;
  sizeShort: string;
  moveType: string;
  createdAt: string;
  start: string;
  end: string;
  /** decimal hours from midnight, used by the dispatch timeline */
  startH: number;
  endH: number;
  durationLabel: string;
  status: JobStatus;
  crewId: string | null;
  moversNeeded: number;
  estimate: number;
  pickup: Address;
  delivery: Address;
  distance: string;
  driveTime: string;
  items: number;
  volume: number;
  fragile: number;
  inventory: InventoryCategory[];
  accessNote: string;
  handlingNote: string;
  startedAt?: string;
};

export type Crew = {
  id: string;
  name: string;
  letter: string;
  members: { name: string; initials: string; role: "Lead" | "Mover" }[];
  truck: string;
  truckDesc: string;
  truckCapacity: string;
};

export const TODAY_LABEL = "Sun, Oct 4, 2026";
export const TODAY_LONG = "Sunday, October 4";
export const NOW_LABEL = "9:41 AM";
export const NOW_H = 9 + 41 / 60;

export const org = { name: "Northline Moving", initials: "NM", city: "Austin, TX" };
export const manager = { name: "Jamie Lee", first: "Jamie", initials: "JL", role: "Operations manager" };

export const crews: Crew[] = [
  {
    id: "alpha",
    name: "Alpha crew",
    letter: "A",
    members: [
      { name: "Marcus Reed", initials: "MR", role: "Lead" },
      { name: "Luis Garcia", initials: "LG", role: "Mover" },
      { name: "Andre Taylor", initials: "AT", role: "Mover" },
    ],
    truck: "T-03",
    truckDesc: "26 ft box truck",
    truckCapacity: "1,600 cu ft",
  },
  {
    id: "bravo",
    name: "Bravo crew",
    letter: "B",
    members: [
      { name: "Daniel Price", initials: "DP", role: "Lead" },
      { name: "Chris Allen", initials: "CA", role: "Mover" },
      { name: "Theo Brooks", initials: "TB", role: "Mover" },
    ],
    truck: "T-07",
    truckDesc: "26 ft box truck",
    truckCapacity: "1,600 cu ft",
  },
  {
    id: "charlie",
    name: "Charlie crew",
    letter: "C",
    members: [
      { name: "Nina Patel", initials: "NP", role: "Lead" },
      { name: "Omar Haddad", initials: "OH", role: "Mover" },
    ],
    truck: "T-02",
    truckDesc: "16 ft box truck",
    truckCapacity: "800 cu ft",
  },
];

const inv = (boxes: number, living: number, bedroom: number, dining: number, appliances: number): InventoryCategory[] => [
  { key: "boxes", name: "Boxes & bins", details: "Packed cartons, wardrobe boxes", qty: boxes },
  { key: "living", name: "Sofa & living room", details: "Sofa, bookcase, framed mirror • Fragile", qty: living },
  { key: "bedroom", name: "Bedroom furniture", details: "Queen bed, dressers, nightstands", qty: bedroom },
  { key: "dining", name: "Dining & office", details: "Glass table, desk, office chair • Fragile", qty: dining },
  { key: "appliances", name: "Appliances", details: "Washer & dryer • Disconnect before move", qty: appliances },
];

export const jobs: Job[] = [
  {
    id: "MV-1042",
    customer: "Sarah Johnson",
    initials: "SJ",
    phone: "(512) 555-0142",
    email: "sarah.johnson@email.com",
    customerSince: "Customer since Sep 2026 · First move",
    size: "2-bedroom apartment",
    sizeShort: "2 bed",
    moveType: "Local residential move",
    createdAt: "Sep 25, 2026",
    start: "8:00 AM",
    end: "12:00 PM",
    startH: 8,
    endH: 12,
    durationLabel: "4 hours estimated",
    status: "in-progress",
    crewId: "alpha",
    moversNeeded: 3,
    estimate: 1250,
    pickup: { line1: "4201 Avenue B, Apt 204", line2: "Austin, TX 78751 · 2nd floor, stairs", area: "Hyde Park" },
    delivery: { line1: "1912 Riverview St", line2: "Austin, TX 78723 · Ground floor", area: "Mueller" },
    distance: "6.2 miles",
    driveTime: "18 min",
    items: 42,
    volume: 650,
    fragile: 2,
    inventory: inv(28, 3, 6, 3, 2),
    accessNote: "Delivery gate code: 4826. Use the loading entrance on Riverview. Call Sarah 15 minutes before arrival.",
    handlingNote: "Wrap the glass dining table and framed mirror. Keep upright in the truck.",
    startedAt: "8:12 AM",
  },
  {
    id: "MV-1043",
    customer: "David Chen",
    initials: "DC",
    phone: "(512) 555-0187",
    email: "david.chen@email.com",
    customerSince: "Customer since Aug 2026 · First move",
    size: "3-bedroom house",
    sizeShort: "3 bed",
    moveType: "Local residential move",
    createdAt: "Sep 21, 2026",
    start: "9:00 AM",
    end: "1:30 PM",
    startH: 9,
    endH: 13.5,
    durationLabel: "4.5 hours estimated",
    status: "in-progress",
    crewId: "bravo",
    moversNeeded: 3,
    estimate: 1875,
    pickup: { line1: "2210 S Lamar Blvd", line2: "Austin, TX 78704 · Ground floor", area: "South Lamar" },
    delivery: { line1: "1504 Kinney Ave", line2: "Austin, TX 78704 · Ground floor", area: "Zilker" },
    distance: "2.4 miles",
    driveTime: "9 min",
    items: 64,
    volume: 980,
    fragile: 1,
    inventory: inv(41, 5, 9, 5, 4),
    accessNote: "Driveway fits one truck. Park on Kinney Ave if blocked.",
    handlingNote: "Piano bench and antique dresser need blankets and extra care.",
    startedAt: "9:05 AM",
  },
  {
    id: "MV-1044",
    customer: "Emma Wilson",
    initials: "EW",
    phone: "(512) 555-0119",
    email: "emma.wilson@email.com",
    customerSince: "Customer since Sep 2026 · First move",
    size: "2-bedroom house",
    sizeShort: "2 bed",
    moveType: "Local residential move",
    createdAt: "Sep 27, 2026",
    start: "10:30 AM",
    end: "2:30 PM",
    startH: 10.5,
    endH: 14.5,
    durationLabel: "4 hours estimated",
    status: "scheduled",
    crewId: "charlie",
    moversNeeded: 2,
    estimate: 1400,
    pickup: { line1: "805 Sunrise Rd", line2: "Round Rock, TX 78664 · Ground floor", area: "Round Rock" },
    delivery: { line1: "1310 Cypress Creek Rd", line2: "Cedar Park, TX 78613 · Ground floor", area: "Cedar Park" },
    distance: "11.8 miles",
    driveTime: "22 min",
    items: 38,
    volume: 600,
    fragile: 1,
    inventory: inv(24, 3, 6, 3, 2),
    accessNote: "Gate is open during the day. Ring the office if closed.",
    handlingNote: "Wall-mounted TV needs its original box.",
  },
  {
    id: "MV-1045",
    customer: "Michael Rivera",
    initials: "MR",
    phone: "(512) 555-0163",
    email: "michael.rivera@email.com",
    customerSince: "Customer since Sep 2026 · First move",
    size: "Studio apartment",
    sizeShort: "Studio",
    moveType: "Local residential move",
    createdAt: "Sep 29, 2026",
    start: "1:00 PM",
    end: "3:30 PM",
    startH: 13,
    endH: 15.5,
    durationLabel: "2.5 hours estimated",
    status: "scheduled",
    crewId: "alpha",
    moversNeeded: 3,
    estimate: 650,
    pickup: { line1: "300 Bowie St, Unit 1802", line2: "Austin, TX 78703 · 18th floor, elevator", area: "Downtown" },
    delivery: { line1: "1108 E 12th St", line2: "Austin, TX 78702 · Ground floor", area: "East Austin" },
    distance: "2.1 miles",
    driveTime: "10 min",
    items: 18,
    volume: 250,
    fragile: 0,
    inventory: inv(12, 2, 2, 1, 1),
    accessNote: "Book the freight elevator at the front desk. Reservation is under Rivera.",
    handlingNote: "No special handling requested.",
  },
  {
    id: "MV-1046",
    customer: "Olivia Brooks",
    initials: "OB",
    phone: "(512) 555-0128",
    email: "olivia.brooks@email.com",
    customerSince: "Customer since Sep 2026 · First move",
    size: "3-bedroom house",
    sizeShort: "3 bed",
    moveType: "Local residential move",
    createdAt: "Sep 30, 2026",
    start: "2:00 PM",
    end: "6:00 PM",
    startH: 14,
    endH: 18,
    durationLabel: "4 hours estimated",
    status: "needs-crew",
    crewId: null,
    moversNeeded: 3,
    estimate: 1650,
    pickup: { line1: "4 Lost Creek Blvd", line2: "Austin, TX 78746 · 2 floors, stairs", area: "Westlake" },
    delivery: { line1: "2401 Barton Hills Dr", line2: "Austin, TX 78704 · Ground floor", area: "Barton Hills" },
    distance: "5.3 miles",
    driveTime: "14 min",
    items: 71,
    volume: 1100,
    fragile: 3,
    inventory: inv(45, 6, 10, 6, 4),
    accessNote: "Steep driveway. Use the dolly ramp.",
    handlingNote: "Glass curio cabinet and two framed paintings.",
  },
];

export const upcomingJobs = [
  { day: "MON", date: "05", customer: "James Miller", summary: "3-bedroom home • Pflugerville → Austin", time: "9:00 AM", status: "confirmed" as const },
  { day: "MON", date: "05", customer: "Sophia Garcia", summary: "2-bedroom apartment • Riverside → Mueller", time: "1:00 PM", status: "confirmed" as const },
  { day: "TUE", date: "06", customer: "Noah Williams", summary: "Office relocation • Downtown → Domain", time: "8:00 AM", status: "deposit-due" as const },
];

export const TOTAL_JOBS_TODAY = 8;

export function getJob(id: string) {
  return jobs.find((j) => j.id.toLowerCase() === id.toLowerCase());
}

export function getCrew(id: string | null) {
  return id ? crews.find((c) => c.id === id) : undefined;
}

export function routeLabel(job: Job) {
  return `${job.pickup.area} → ${job.delivery.area}`;
}

export function money(n: number, cents = false) {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: cents ? 2 : 0,
    maximumFractionDigits: cents ? 2 : 0,
  });
}

export function firstName(full: string) {
  return full.split(" ")[0];
}
