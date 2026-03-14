import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export const customerSchema = z.object({
  name: z.string().min(2),
  accountCode: z.string().min(2),
  contactName: z.string().min(2),
  contactEmail: z.string().email(),
  contactPhone: z.string().min(7),
  billingTerms: z.string().min(2)
});

export const orderSchema = z.object({
  customerId: z.string().uuid(),
  mode: z.enum(["FTL", "LTL", "Parcel", "Intermodal"]),
  commodity: z.string().min(2),
  weightLb: z.coerce.number().positive(),
  originCity: z.string().min(2),
  originState: z.string().min(2).max(2),
  destinationCity: z.string().min(2),
  destinationState: z.string().min(2).max(2),
  pickupDate: z.string().min(2),
  deliveryDate: z.string().optional(),
  notes: z.string().optional()
});

export const shipmentSchema = z.object({
  orderId: z.string().uuid(),
  customerId: z.string().uuid(),
  pickupEta: z.string().optional(),
  deliveryEta: z.string().optional()
});

export const carrierSchema = z.object({
  name: z.string().min(2),
  scacCode: z.string().max(10).optional(),
  serviceArea: z.string().min(2),
  contactName: z.string().min(2),
  contactEmail: z.string().email(),
  contactPhone: z.string().min(7)
});

export const assignCarrierSchema = z.object({
  shipmentId: z.string().uuid(),
  carrierId: z.string().uuid()
});

export const rateSchema = z.object({
  carrierId: z.string().uuid(),
  mode: z.enum(["FTL", "LTL", "Parcel", "Intermodal"]),
  originRegion: z.string().min(2),
  destinationRegion: z.string().min(2),
  baseRate: z.coerce.number().nonnegative(),
  ratePerMile: z.coerce.number().nonnegative()
});

export const trackingSchema = z.object({
  shipmentId: z.string().uuid(),
  eventType: z.enum([
    "created",
    "picked_up",
    "in_transit",
    "delayed",
    "out_for_delivery",
    "delivered"
  ]),
  description: z.string().optional(),
  location: z.string().optional()
});

export const userAccessSchema = z.object({
  profileId: z.string().uuid(),
  role: z.enum(["admin", "ops", "customer"]),
  customerId: z.string().uuid().nullable()
});

export type LoginInput = z.infer<typeof loginSchema>;
export type CustomerInput = z.infer<typeof customerSchema>;
export type OrderInput = z.infer<typeof orderSchema>;
export type ShipmentInput = z.infer<typeof shipmentSchema>;
export type CarrierInput = z.infer<typeof carrierSchema>;
export type AssignCarrierInput = z.infer<typeof assignCarrierSchema>;
export type RateInput = z.infer<typeof rateSchema>;
export type TrackingInput = z.infer<typeof trackingSchema>;
export type UserAccessInput = z.infer<typeof userAccessSchema>;
