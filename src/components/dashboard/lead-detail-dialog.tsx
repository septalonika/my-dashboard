"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Activity } from "lucide-react";
import { LeadInterface } from "@/interfaces/leads";
import { LeadAvatar } from "@/components/dashboard/lead-avatar";
import { format, formatDistanceToNow } from "date-fns";

const safeFormat = (dateString: string, formatStr: string) => {
  try {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "—" : format(date, formatStr);
  } catch {
    return "—";
  }
};

const safeDistance = (dateString: string) => {
  try {
    const date = new Date(dateString);
    return isNaN(date.getTime())
      ? "—"
      : formatDistanceToNow(date, { addSuffix: true });
  } catch {
    return "—";
  }
};

const statusConfig: Record<string, any> = {
  contacted: "default",
  qualified: "default",
  proposal: "outline",
  negotiation: "secondary",
  closed: "success",
  lost: "destructive",
};

const sourceConfig: Record<string, any> = {
  landing_page: "sky",
  referral: "violet",
  social_media: "pink",
  email_campaign: "orange",
};

interface LeadDetailDialogProps {
  lead: LeadInterface | null;
  onOpenChange: (open: boolean) => void;
}

export function LeadDetailDialog({
  lead,
  onOpenChange,
}: LeadDetailDialogProps) {
  if (!lead) return null;

  return (
    <Dialog open={!!lead} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <LeadAvatar name={lead.name} size="lg" />
            {lead.name}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-zinc-500 mb-1 block">
                Email
              </label>
              <p className="font-semibold">{lead.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-zinc-500 mb-1 block">
                Phone
              </label>
              <p className="font-semibold">{lead.phone}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-zinc-500 mb-1 block">
                Status
              </label>
              <Badge
                variant={statusConfig[lead.status] || "default"}
                className="px-3 py-1"
              >
                {lead.status.toUpperCase()}
              </Badge>
            </div>
            <div>
              <label className="text-sm font-medium text-zinc-500 mb-1 block">
                Source
              </label>
              <Badge
                variant={sourceConfig[lead.source] || "outline"}
                className="px-3 py-1"
              >
                {lead.source.replace("_", " ").toUpperCase()}
              </Badge>
            </div>
            <div>
              <label className="text-sm font-medium text-zinc-500 mb-1 block">
                Owner
              </label>
              <p>{lead.owner?.name || "Unassigned"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-zinc-500 mb-1 block">
                Tags
              </label>
              <div className="flex flex-wrap gap-1 mt-1">
                {lead.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Activity History
            </h4>
            <div className="space-y-3">
              {lead.activities.map((activity) => (
                <div
                  key={activity.id}
                  className="p-4 bg-zinc-50 dark:bg-zinc-900/50 rounded-lg border-l-4 border-blue-500"
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-medium capitalize">
                      {activity.type}
                    </span>
                    <span className="text-sm text-zinc-500">
                      {safeDistance(activity.at)}
                    </span>
                  </div>
                  <p className="text-zinc-700 dark:text-zinc-300">
                    {activity.summary}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
