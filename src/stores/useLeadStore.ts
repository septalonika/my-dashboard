import { create } from "zustand";
import { toast } from "sonner";
import axios from "axios";
import { LeadInterface } from "@/interfaces/leads";

type LeadStoreState = {
  loading: boolean;
  leads: LeadInterface[];
  setLoading: (loading: boolean) => void;
  getLeads: () => Promise<LeadInterface[]>; // Fixed: returns array
  setLeads: (leads: LeadInterface[]) => void;

  // ✅ NEW: Full CRUD operations
  createLead: (
    leadData: Omit<
      LeadInterface,
      "id" | "createdAt" | "lastActivityAt" | "activities"
    >
  ) => Promise<LeadInterface>;
  updateLead: (
    id: string,
    leadData: Partial<LeadInterface>
  ) => Promise<LeadInterface>;
  deleteLead: (id: string) => Promise<void>;
  bulkUpdate: (ids: string[], data: Partial<LeadInterface>) => Promise<void>;
};

export const useLeadStore = create<LeadStoreState>((set, get) => ({
  loading: true,
  leads: [],

  setLoading: (loading: boolean) => set({ loading }),

  getLeads: async () => {
    try {
      set({ loading: true });
      const baseUrl =
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5047";

      // Handle both { leads: [...] } and direct array formats
      const { data } = await axios.get(`${baseUrl}/leads`);
      const leadsArray = Array.isArray(data) ? data : data.leads || [];

      set({ loading: false, leads: leadsArray });
      return leadsArray;
    } catch (error) {
      set({ loading: false });
      toast.error("Failed to fetch leads");
      console.error("getLeads error:", error);
      return [];
    }
  },

  setLeads: (leads: LeadInterface[]) => set({ leads }),

  // ✅ CREATE: POST /leads
  createLead: async (leadData) => {
    try {
      set({ loading: true });
      const baseUrl =
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5047";

      const payload = {
        ...leadData,
        id: `lead_${Date.now()}`, // Generate unique ID
        createdAt: new Date().toISOString(),
        lastActivityAt: new Date().toISOString(),
        activities: [],
      };

      const { data } = await axios.post<LeadInterface>(
        `${baseUrl}/leads`,
        payload
      );
      toast.success("Lead created successfully");

      // Refresh leads
      await get().getLeads();
      return data;
    } catch (error) {
      toast.error("Failed to create lead");
      console.error("createLead error:", error);
      throw error;
    }
  },

  // ✅ UPDATE: PUT /leads/:id
  updateLead: async (id, leadData) => {
    try {
      set({ loading: true });
      const baseUrl =
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5047";

      const { data } = await axios.put<LeadInterface>(
        `${baseUrl}/leads/${id}`,
        leadData
      );
      toast.success("Lead updated successfully");

      // Refresh leads
      await get().getLeads();
      return data;
    } catch (error) {
      toast.error("Failed to update lead");
      console.error("updateLead error:", error);
      throw error;
    }
  },

  // ✅ DELETE: DELETE /leads/:id
  deleteLead: async (id) => {
    try {
      set({ loading: true });
      const baseUrl =
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5047";

      await axios.delete(`${baseUrl}/leads/${id}`);
      toast.success("Lead deleted successfully");

      // Refresh leads
      await get().getLeads();
    } catch (error) {
      toast.error("Failed to delete lead");
      console.error("deleteLead error:", error);
      throw error;
    }
  },

  // ✅ BULK UPDATE: POST /leads/bulk-update
  bulkUpdate: async (ids, data) => {
    try {
      set({ loading: true });
      const baseUrl =
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5047";

      await axios.post(`${baseUrl}/leads/bulk-update`, { ids, data });
      toast.success(`Updated ${ids.length} leads`);

      // Refresh leads
      await get().getLeads();
    } catch (error) {
      toast.error("Failed to bulk update leads");
      console.error("bulkUpdate error:", error);
      throw error;
    }
  },
}));
