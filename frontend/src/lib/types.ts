export type DeviceCategory =
  | "electrical"
  | "mechanical"
  | "hvac"
  | "plumbing"
  | "other";

export type ComplaintStatus =
  | "received"
  | "dispatched"
  | "en-route"
  | "in-progress"
  | "resolved"
  | "closed";

export interface Complaint {
  id: string;
  category: DeviceCategory;
  title: string;
  description: string;
  customerName: string;
  customerPhone: string;
  address: string;
  createdAt: string;
  status: ComplaintStatus;
  technician?: Technician;
  scheduledAt?: string;
}

export interface Technician {
  id: string;
  name: string;
  trade: "electrician" | "mechanic";
  phone: string;
}

export interface NewComplaintInput {
  category: DeviceCategory;
  title: string;
  description: string;
  customerName: string;
  customerPhone: string;
  address: string;
}

export const STATUS_LABELS: Record<ComplaintStatus, string> = {
  received: "Received",
  dispatched: "Dispatched",
  "en-route": "En route",
  "in-progress": "In progress",
  resolved: "Resolved",
  closed: "Closed",
};
