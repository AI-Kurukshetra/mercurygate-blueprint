export const APP_NAME = "NextGen Transportation Management System (TMS)";
export const APP_SHORT_NAME = "NextGen TMS";

export const ROLE_LABELS = {
  admin: "Admin",
  ops: "Operations",
  customer: "Customer"
} as const;

export const SHIPMENT_STATUSES = [
  "planned",
  "in_transit",
  "delivered",
  "delayed",
  "cancelled"
] as const;

export const ORDER_STATUSES = [
  "draft",
  "planned",
  "shipped",
  "delivered",
  "cancelled"
] as const;

export const TRACKING_STATUSES = [
  "created",
  "picked_up",
  "in_transit",
  "delayed",
  "out_for_delivery",
  "delivered"
] as const;
