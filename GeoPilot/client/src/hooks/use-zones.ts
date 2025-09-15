import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { collection, addDoc, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { DroneZone, InsertDroneZone } from "@shared/schema";

export const useZones = () => {
  return useQuery<DroneZone[]>({
    queryKey: ["/api/drone-zones"],
  });
};

export const useCreateZone = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: InsertDroneZone) => {
      // Save to both local API and Firebase
      const response = await fetch("/api/drone-zones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to create zone");
      }

      const result = await response.json();

      // Also save to Firebase if available
      try {
        await addDoc(collection(db, "droneZones"), {
          ...data,
          createdAt: new Date(),
          updatedAt: new Date(),
          status: "pending",
        });
      } catch (error) {
        console.warn("Firebase save failed, but local save succeeded:", error);
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/drone-zones"] });
    },
  });
};

export const useFirebaseZones = () => {
  return useQuery({
    queryKey: ["firebase-zones"],
    queryFn: async () => {
      try {
        const q = query(collection(db, "droneZones"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
      } catch (error) {
        console.error("Firebase query failed:", error);
        return [];
      }
    },
  });
};
