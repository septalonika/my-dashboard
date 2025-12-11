"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronDown,
  Search,
  Filter,
  ChevronsUpDown,
  Loader2,
  Activity,
  Users2,
} from "lucide-react";
import { useEffect, useState, useMemo, useCallback } from "react";
import { useLeadStore } from "@/stores/useLeadStore";
import { LeadInterface } from "@/interfaces/leads";
import { useDebouncedCallback } from "use-debounce";
import { TABLE_HEAD_LEADS } from "@/consts/data-leads";
import { format, formatDistanceToNow } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";

const statusConfig = {
  contacted: "default",
  qualified: "default",
  proposal: "outline",
  negotiation: "secondary",
  closed: "success",
  lost: "destructive",
};

const sourceConfig = {
  landing_page: "sky",
  referral: "violet",
  social_media: "pink",
  email_campaign: "orange",
};

// Safe date formatters
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

interface SortConfig {
  key: string;
  direction: "asc" | "desc";
}

export default function DashboardTable() {
  const {
    leads,
    loading,
    getLeads,
    setLeads,
    createLead,
    updateLead,
    deleteLead,
  } = useLeadStore();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editLead, setEditLead] = useState<LeadInterface | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "createdAt",
    direction: "desc",
  });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedLeads, setSelectedLeads] = useState<Set<string>>(new Set());
  const [bulkStatus, setBulkStatus] = useState("");
  const [selectedLead, setSelectedLead] = useState<LeadInterface | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    status: "contacted",
    source: "landing_page",
    ownerName: "",
  });
  const resetForm = () => {
    setForm({
      name: "",
      email: "",
      phone: "",
      status: "contacted",
      source: "landing_page",
      ownerName: "",
    });
  };

  const handleFetchLeads = useDebouncedCallback(async () => {
    try {
      const data = await getLeads();
      setLeads(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching leads: ", error);
    }
  }, 500);

  useEffect(() => {
    handleFetchLeads();
  }, []);

  // Filtered & Sorted data
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchesSearch =
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.phone.includes(searchTerm);
      const matchesStatus =
        statusFilter === "all" || lead.status === statusFilter;
      const matchesSource =
        sourceFilter === "all" || lead.source === sourceFilter;
      return matchesSearch && matchesStatus && matchesSource;
    });
  }, [leads, searchTerm, statusFilter, sourceFilter]);

  const sortedLeads = useMemo(() => {
    return [...filteredLeads].sort((a, b) => {
      let aVal = a[sortConfig.key as keyof LeadInterface];
      let bVal = b[sortConfig.key as keyof LeadInterface];

      if (sortConfig.key === "owner") {
        aVal = a.owner?.name || "";
        bVal = b.owner?.name || "";
      }

      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortConfig.direction === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      const aNum = new Date(aVal as string).getTime();
      const bNum = new Date(bVal as string).getTime();

      return sortConfig.direction === "asc" ? aNum - bNum : bNum - aNum;
    });
  }, [filteredLeads, sortConfig]);

  const paginatedLeads = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sortedLeads.slice(start, start + pageSize);
  }, [sortedLeads, page, pageSize]);

  const handleSort = (key: string) => {
    setSortConfig({
      key,
      direction:
        sortConfig.key === key && sortConfig.direction === "asc"
          ? "desc"
          : "asc",
    });
  };

  const handleBulkUpdate = async () => {
    if (bulkStatus && selectedLeads.size > 0) {
      // Call your bulk update API
      console.log("Bulk update:", Array.from(selectedLeads), {
        status: bulkStatus,
      });
      // await bulkUpdate(Array.from(selectedLeads), { status: bulkStatus });
      setSelectedLeads(new Set());
      setBulkStatus("");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zinc-900 dark:border-zinc-100"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Leads Pipeline
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">
            {filteredLeads.length} of {leads.length} leads • Page {page} of{" "}
            {Math.ceil(filteredLeads.length / pageSize)}
          </p>
          <Button
            variant="default"
            onClick={() => {
              resetForm();
              setIsAddOpen(true);
            }}
          >
            + Add Lead
          </Button>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
            <Input
              placeholder="Search name, email, phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-44">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="contacted">Contacted</SelectItem>
              <SelectItem value="qualified">Qualified</SelectItem>
              <SelectItem value="proposal">Proposal</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
              <SelectItem value="lost">Lost</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sourceFilter} onValueChange={setSourceFilter}>
            <SelectTrigger className="w-44">
              <Users2 className="w-4 h-4 mr-2" />
              <SelectValue placeholder="All Sources" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sources</SelectItem>
              <SelectItem value="landing_page">Landing Page</SelectItem>
              <SelectItem value="referral">Referral</SelectItem>
              <SelectItem value="social_media">Social Media</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={pageSize.toString()}
            onValueChange={(v) => setPageSize(Number(v))}
          >
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5 per page</SelectItem>
              <SelectItem value="10">10 per page</SelectItem>
              <SelectItem value="25">25 per page</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedLeads.size > 0 && (
        <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-xl">
          <Checkbox
            checked={selectedLeads.size === paginatedLeads.length}
            onCheckedChange={(checked) => {
              if (checked) {
                setSelectedLeads(new Set(paginatedLeads.map((l) => l.id)));
              } else {
                setSelectedLeads(new Set());
              }
            }}
          />
          <span className="font-medium">{selectedLeads.size} selected</span>
          <Select value={bulkStatus} onValueChange={setBulkStatus}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Change status to..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="qualified">Qualified</SelectItem>
              <SelectItem value="proposal">Proposal</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
              <SelectItem value="lost">Lost</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleBulkUpdate} variant="default" size="sm">
            Update {selectedLeads.size}
          </Button>
        </div>
      )}

      {/* Table */}
      <div className="bg-white/80 dark:bg-black/30 backdrop-blur-sm rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-b-2 border-zinc-200 dark:border-zinc-700">
              <TableHead className="w-12">
                <Checkbox
                  checked={
                    selectedLeads.size === paginatedLeads.length &&
                    paginatedLeads.length > 0
                  }
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedLeads(
                        new Set(paginatedLeads.map((l) => l.id))
                      );
                    } else {
                      setSelectedLeads(new Set());
                    }
                  }}
                />
              </TableHead>
              {TABLE_HEAD_LEADS.map((tableHead) => (
                <TableHead
                  key={tableHead.key}
                  className="group cursor-pointer font-semibold text-zinc-700 dark:text-zinc-300 py-6 text-left hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                  onClick={() => handleSort(tableHead.key)}
                >
                  <div className="flex items-center gap-2">
                    {tableHead.label}
                    {sortConfig.key === tableHead.key && (
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${
                          sortConfig.direction === "desc" ? "rotate-180" : ""
                        }`}
                      />
                    )}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedLeads.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={TABLE_HEAD_LEADS.length + 1}
                  className="h-32 text-center"
                >
                  <div className="text-zinc-500 dark:text-zinc-400 py-8">
                    <p className="text-lg font-medium mb-2">No leads found</p>
                    <p className="text-sm">
                      Try adjusting your search or filters
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              paginatedLeads.map((lead) => (
                <TableRow
                  key={lead.id}
                  className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/50 transition-all duration-200 border-b border-zinc-100 dark:border-zinc-800 last:border-b-0 cursor-pointer group hover:shadow-md"
                  onClick={() => setSelectedLead(lead)}
                >
                  <TableCell>
                    <Checkbox
                      checked={selectedLeads.has(lead.id)}
                      onCheckedChange={(checked) => {
                        const newSet = new Set(selectedLeads);
                        if (checked) {
                          newSet.add(lead.id);
                        } else {
                          newSet.delete(lead.id);
                        }
                        setSelectedLeads(newSet);
                      }}
                    />
                  </TableCell>
                  <TableCell className="font-semibold text-zinc-900 dark:text-white py-5">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-zinc-400 to-zinc-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {lead.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                      <span>{lead.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-zinc-900 dark:text-zinc-100 font-medium">
                    {lead.email}
                  </TableCell>
                  <TableCell className="text-zinc-700 dark:text-zinc-300">
                    {lead.phone}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={statusConfig[lead.status] || "default"}
                      className="px-3 py-1 text-xs font-semibold"
                    >
                      {lead.status.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={sourceConfig[lead.source] || "outline"}
                      className="px-3 py-1 text-xs font-semibold"
                    >
                      {lead.source.replace("_", " ").toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium text-zinc-900 dark:text-zinc-100">
                    {lead.owner?.name || "—"}
                  </TableCell>
                  <TableCell className="text-sm text-zinc-600 dark:text-zinc-400">
                    {safeDistance(lead.lastActivityAt)}
                  </TableCell>
                  <TableCell className="text-sm text-zinc-500 dark:text-zinc-400">
                    {safeFormat(lead.createdAt, "MMM dd")}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        asChild
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Button variant="ghost" size="icon">
                          <ChevronsUpDown className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditLead(lead);
                            setForm({
                              name: lead.name,
                              email: lead.email,
                              phone: lead.phone,
                              status: lead.status,
                              source: lead.source,
                              ownerName: lead.owner?.name || "",
                            });
                            setIsEditOpen(true);
                          }}
                        >
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={async (e) => {
                            e.stopPropagation();
                            await deleteLead(lead.id);
                          }}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {filteredLeads.length > pageSize && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-zinc-500 dark:text-zinc-400">
            Showing {(page - 1) * pageSize + 1} to{" "}
            {Math.min(page * pageSize, filteredLeads.length)} of{" "}
            {filteredLeads.length} leads
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setPage((p) =>
                  Math.min(p + 1, Math.ceil(filteredLeads.length / pageSize))
                )
              }
              disabled={page === Math.ceil(filteredLeads.length / pageSize)}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      <Dialog open={!!selectedLead} onOpenChange={() => setSelectedLead(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-zinc-400 to-zinc-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-lg">
                  {selectedLead?.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </span>
              </div>
              {selectedLead?.name}
            </DialogTitle>
          </DialogHeader>
          {selectedLead && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-zinc-500 mb-1 block">
                    Email
                  </label>
                  <p className="font-semibold">{selectedLead.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-zinc-500 mb-1 block">
                    Phone
                  </label>
                  <p className="font-semibold">{selectedLead.phone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-zinc-500 mb-1 block">
                    Status
                  </label>
                  <Badge
                    variant={statusConfig[selectedLead.status] || "default"}
                    className="px-3 py-1"
                  >
                    {selectedLead.status.toUpperCase()}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-zinc-500 mb-1 block">
                    Source
                  </label>
                  <Badge
                    variant={sourceConfig[selectedLead.source] || "outline"}
                    className="px-3 py-1"
                  >
                    {selectedLead.source.replace("_", " ").toUpperCase()}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-zinc-500 mb-1 block">
                    Owner
                  </label>
                  <p>{selectedLead.owner?.name || "Unassigned"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-zinc-500 mb-1 block">
                    Tags
                  </label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedLead.tags.map((tag) => (
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
                  {selectedLead.activities.map((activity) => (
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
          )}
        </DialogContent>
      </Dialog>
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Lead</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
            <Input
              placeholder="Email"
              value={form.email}
              onChange={(e) =>
                setForm((f) => ({ ...f, email: e.target.value }))
              }
            />
            <Input
              placeholder="Phone"
              value={form.phone}
              onChange={(e) =>
                setForm((f) => ({ ...f, phone: e.target.value }))
              }
            />
            <Select
              value={form.status}
              onValueChange={(v) => setForm((f) => ({ ...f, status: v }))}
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
              value={form.source}
              onValueChange={(v) => setForm((f) => ({ ...f, source: v }))}
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
              value={form.ownerName}
              onChange={(e) =>
                setForm((f) => ({ ...f, ownerName: e.target.value }))
              }
            />
            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsAddOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={async () => {
                  await createLead({
                    name: form.name,
                    email: form.email,
                    phone: form.phone,
                    status: form.status as any,
                    source: form.source as any,
                    owner: {
                      id: `user_${Date.now()}`,
                      name: form.ownerName || "Unassigned",
                    },
                    tags: [],
                  });
                  setIsAddOpen(false);
                  resetForm();
                }}
              >
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Lead Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Lead</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
            <Input
              placeholder="Email"
              value={form.email}
              onChange={(e) =>
                setForm((f) => ({ ...f, email: e.target.value }))
              }
            />
            <Input
              placeholder="Phone"
              value={form.phone}
              onChange={(e) =>
                setForm((f) => ({ ...f, phone: e.target.value }))
              }
            />
            <Select
              value={form.status}
              onValueChange={(v) => setForm((f) => ({ ...f, status: v }))}
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
              value={form.source}
              onValueChange={(v) => setForm((f) => ({ ...f, source: v }))}
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
              value={form.ownerName}
              onChange={(e) =>
                setForm((f) => ({ ...f, ownerName: e.target.value }))
              }
            />
            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditOpen(false);
                  setEditLead(null);
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={async () => {
                  if (!editLead) return;
                  await updateLead(editLead.id, {
                    name: form.name,
                    email: form.email,
                    phone: form.phone,
                    status: form.status as any,
                    source: form.source as any,
                    owner: {
                      id: editLead.owner?.id ?? `user_${Date.now()}`,
                      name: form.ownerName || "Unassigned",
                    },
                  });
                  setIsEditOpen(false);
                  setEditLead(null);
                  resetForm();
                }}
              >
                Save changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
