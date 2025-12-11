"use client";

import { useState } from "react";

export interface LeadFormData {
  name: string;
  email: string;
  phone: string;
  status: string;
  source: string;
  ownerName: string;
}

const initialFormData: LeadFormData = {
  name: "",
  email: "",
  phone: "",
  status: "contacted",
  source: "landing_page",
  ownerName: "",
};

export function useLeadForm() {
  const [form, setForm] = useState<LeadFormData>(initialFormData);

  const updateForm = (data: Partial<LeadFormData>) => {
    setForm((prev) => ({ ...prev, ...data }));
  };

  const resetForm = () => {
    setForm(initialFormData);
  };

  const setFormFromLead = (lead: any) => {
    setForm({
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      status: lead.status,
      source: lead.source,
      ownerName: lead.owner?.name || "",
    });
  };

  return {
    form,
    updateForm,
    resetForm,
    setFormFromLead,
  };
}
