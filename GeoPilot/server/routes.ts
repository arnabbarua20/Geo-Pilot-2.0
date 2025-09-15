import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertDroneZoneSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all drone zones
  app.get("/api/drone-zones", async (req, res) => {
    try {
      const zones = await storage.getAllDroneZones();
      res.json(zones);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch drone zones" });
    }
  });

  // Get single drone zone
  app.get("/api/drone-zones/:id", async (req, res) => {
    try {
      const zone = await storage.getDroneZone(req.params.id);
      if (!zone) {
        return res.status(404).json({ message: "Zone not found" });
      }
      res.json(zone);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch drone zone" });
    }
  });

  // Create new drone zone
  app.post("/api/drone-zones", async (req, res) => {
    try {
      const validation = insertDroneZoneSchema.safeParse(req.body);
      if (!validation.success) {
        const error = fromZodError(validation.error);
        return res.status(400).json({ message: error.message });
      }

      const zone = await storage.createDroneZone(validation.data);
      res.status(201).json(zone);
    } catch (error) {
      res.status(500).json({ message: "Failed to create drone zone" });
    }
  });

  // Update drone zone
  app.patch("/api/drone-zones/:id", async (req, res) => {
    try {
      const zone = await storage.updateDroneZone(req.params.id, req.body);
      if (!zone) {
        return res.status(404).json({ message: "Zone not found" });
      }
      res.json(zone);
    } catch (error) {
      res.status(500).json({ message: "Failed to update drone zone" });
    }
  });

  // Delete drone zone
  app.delete("/api/drone-zones/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteDroneZone(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Zone not found" });
      }
      res.json({ message: "Zone deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete drone zone" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
