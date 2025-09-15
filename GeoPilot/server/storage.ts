import { type DroneZone, type InsertDroneZone } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<any | undefined>;
  getUserByUsername(username: string): Promise<any | undefined>;
  createUser(user: any): Promise<any>;
  
  // Drone zone methods
  getAllDroneZones(): Promise<DroneZone[]>;
  getDroneZone(id: string): Promise<DroneZone | undefined>;
  createDroneZone(zone: InsertDroneZone): Promise<DroneZone>;
  updateDroneZone(id: string, zone: Partial<DroneZone>): Promise<DroneZone | undefined>;
  deleteDroneZone(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, any>;
  private droneZones: Map<string, DroneZone>;

  constructor() {
    this.users = new Map();
    this.droneZones = new Map();
    
    // Initialize with mock no-fly zones
    this.initializeMockZones();
  }

  private initializeMockZones() {
    const mockZones: DroneZone[] = [
      {
        id: "1",
        title: "Auckland International Airport",
        latitude: -36.8485,
        longitude: 174.7633,
        reason: "airport",
        details: "Flight operations active 24/7. Minimum 5km clearance required for all unmanned aircraft.",
        emergencyContact: null,
        status: "active",
        zoneType: "restricted",
        createdAt: new Date("2024-01-15"),
        updatedAt: new Date("2024-01-15"),
      },
      {
        id: "2",
        title: "Wellington Hospital Helipad",
        latitude: -41.3054,
        longitude: 174.7794,
        reason: "hospital",
        details: "Emergency helicopter operations. Contact hospital security before flights.",
        emergencyContact: "+64-4-385-5999",
        status: "active",
        zoneType: "controlled",
        createdAt: new Date("2024-01-12"),
        updatedAt: new Date("2024-01-12"),
      },
      {
        id: "3",
        title: "Christchurch Airport",
        latitude: -43.4894,
        longitude: 172.5320,
        reason: "airport",
        details: "Major commercial airport. No drone flights within 4km radius.",
        emergencyContact: null,
        status: "active",
        zoneType: "restricted",
        createdAt: new Date("2024-01-10"),
        updatedAt: new Date("2024-01-10"),
      },
      {
        id: "4",
        title: "Fiordland National Park",
        latitude: -45.4000,
        longitude: 167.7000,
        reason: "nature",
        details: "Protected wildlife area. Special permits required for aerial photography.",
        emergencyContact: null,
        status: "active",
        zoneType: "protected",
        createdAt: new Date("2024-01-08"),
        updatedAt: new Date("2024-01-08"),
      },
    ];

    mockZones.forEach(zone => {
      this.droneZones.set(zone.id, zone);
    });
  }

  async getUser(id: string): Promise<any | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<any | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: any): Promise<any> {
    const id = randomUUID();
    const user: any = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getAllDroneZones(): Promise<DroneZone[]> {
    return Array.from(this.droneZones.values());
  }

  async getDroneZone(id: string): Promise<DroneZone | undefined> {
    return this.droneZones.get(id);
  }

  async createDroneZone(insertZone: InsertDroneZone): Promise<DroneZone> {
    const id = randomUUID();
    const now = new Date();
    const zone: DroneZone = {
      ...insertZone,
      id,
      status: "pending",
      createdAt: now,
      updatedAt: now,
      details: insertZone.details || null,
      emergencyContact: insertZone.emergencyContact || null,
    };
    this.droneZones.set(id, zone);
    return zone;
  }

  async updateDroneZone(id: string, updates: Partial<DroneZone>): Promise<DroneZone | undefined> {
    const existing = this.droneZones.get(id);
    if (!existing) return undefined;

    const updated: DroneZone = {
      ...existing,
      ...updates,
      updatedAt: new Date(),
    };
    this.droneZones.set(id, updated);
    return updated;
  }

  async deleteDroneZone(id: string): Promise<boolean> {
    return this.droneZones.delete(id);
  }
}

export const storage = new MemStorage();
