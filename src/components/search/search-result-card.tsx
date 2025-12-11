"use client";

import { LeadInterface } from "@/interfaces/leads";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, User, Calendar } from "lucide-react";
import { format } from "date-fns";

interface SearchResultCardProps {
  lead: LeadInterface;
  onClick?: () => void;
}

const statusConfig: Record<string, string> = {
  contacted: "default",
  qualified: "default",
  proposal: "outline",
  negotiation: "secondary",
  closed: "success",
  lost: "destructive",
};

const sourceConfig: Record<string, string> = {
  landing_page: "sky",
  referral: "violet",
  social_media: "pink",
  email_campaign: "orange",
};

export function SearchResultCard({ lead, onClick }: SearchResultCardProps) {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch {
      return "—";
    }
  };

  return (
    <div
      onClick={onClick}
      className="p-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:shadow-lg hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-200 cursor-pointer group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-sm">
              {lead.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </span>
          </div>
          <div>
            <h3 className="font-semibold text-lg text-zinc-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {lead.name}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <Badge
                variant={statusConfig[lead.status] || "default"}
                className="text-xs"
              >
                {lead.status.toUpperCase()}
              </Badge>
              <Badge
                variant={sourceConfig[lead.source] || "outline"}
                className="text-xs"
              >
                {lead.source.replace("_", " ").toUpperCase()}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
        <div className="flex items-center space-x-2 text-zinc-600 dark:text-zinc-400">
          <Mail className="w-4 h-4" />
          <span>{lead.email}</span>
        </div>
        <div className="flex items-center space-x-2 text-zinc-600 dark:text-zinc-400">
          <Phone className="w-4 h-4" />
          <span>{lead.phone}</span>
        </div>
        <div className="flex items-center space-x-2 text-zinc-600 dark:text-zinc-400">
          <User className="w-4 h-4" />
          <span>{lead.owner?.name || "Unassigned"}</span>
        </div>
        <div className="flex items-center space-x-2 text-zinc-600 dark:text-zinc-400">
          <Calendar className="w-4 h-4" />
          <span>{formatDate(lead.createdAt)}</span>
        </div>
      </div>

      {lead.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-3">
          {lead.tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="text-xs bg-zinc-100 dark:bg-zinc-800"
            >
              {tag}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
