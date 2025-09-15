import { sql } from "drizzle-orm";
import { pgTable, text, varchar, real, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const droneZones = pgTable("drone_zones", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  reason: text("reason").notNull(),
  details: text("details"),
  emergencyContact: text("emergency_contact"),
  status: text("status").notNull().default("pending"),
  zoneType: text("zone_type").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertDroneZoneSchema = createInsertSchema(droneZones).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  status: true,
}).extend({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  title: z.string().min(1, "Title is required"),
  reason: z.string().min(1, "Reason is required"),
  zoneType: z.string().min(1, "Zone type is required"),
  details: z.string().optional(),
  emergencyContact: z.string().optional(),
});

export type InsertDroneZone = z.infer<typeof insertDroneZoneSchema>;
export type DroneZone = typeof droneZones.$inferSelect;
