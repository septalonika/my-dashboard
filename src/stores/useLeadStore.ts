import { create } from "zustand";
import { toast } from "sonner";
import axios from "axios";
import { LeadInterface } from "@/interfaces/leads";

type LeadStoreState = {
  loading: boolean;
  leads: LeadInterface[];
  setLoadingLocation: (loadingLocation: boolean) => void;
  getLeads: () => Promise<LeadInterface>;
  setLeads: (leads: LeadInterface[]) => void;
};

export const useLeadStore = create<LeadStoreState>((set, get) => ({
  loading: true,
  leads: [],
  setLoadingLocation: (loadingLocation: boolean) =>
    set({ loading: loadingLocation }),
  getLeads: async () => {
    try {
      set({ loading: true });
      const baseUrl =
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5047";
      const response = await axios.get<LeadInterface>(`${baseUrl}/leads`);
      set({ loading: false });
      return response.data;
    } catch (error) {
      set({ loading: false });
      toast.error("Failed to fetch leads");
      throw error;
    }
  },
  setLeads: (leads: LeadInterface[]) => set({ leads }),
}));
