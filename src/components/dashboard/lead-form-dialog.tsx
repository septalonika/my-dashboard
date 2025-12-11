"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface LeadFormData {
  name: string;
  email: string;
  phone: string;
  status: string;
  source: string;
  ownerName: string;
}

interface LeadFormDialogProps {
  open: boolean;
  title: string;
  formData: LeadFormData;
  onOpenChange: (open: boolean) => void;
  onFormChange: (data: Partial<LeadFormData>) => void;
  onSubmit: () => void;
}

export function LeadFormDialog({
  open,
  title,
  formData,
  onOpenChange,
  onFormChange,
  onSubmit,
}: LeadFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Name"
            value={formData.name}
            onChange={(e) => onFormChange({ name: e.target.value })}
          />
          <Input
            placeholder="Email"
            value={formData.email}
            onChange={(e) => onFormChange({ email: e.target.value })}
          />
          <Input
            placeholder="Phone"
            value={formData.phone}
            onChange={(e) => onFormChange({ phone: e.target.value })}
          />
          <Select
            value={formData.status}
            onValueChange={(v) => onFormChange({ status: v })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="contacted">Contacted</SelectItem>
              <SelectItem value="qualified">Qualified</SelectItem>
              <SelectItem value="proposal">Proposal</SelectItem>
              <SelectItem value="negotiation">Negotiation</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
              <SelectItem value="lost">Lost</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={formData.source}
            onValueChange={(v) => onFormChange({ source: v })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="landing_page">Landing Page</SelectItem>
              <SelectItem value="referral">Referral</SelectItem>
              <SelectItem value="social_media">Social Media</SelectItem>
              <SelectItem value="email_campaign">Email Campaign</SelectItem>
            </SelectContent>
          </Select>
          <Input
            placeholder="Owner name"
            value={formData.ownerName}
            onChange={(e) => onFormChange({ ownerName: e.target.value })}
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={onSubmit}>Save</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
