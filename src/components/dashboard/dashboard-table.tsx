"use client";

import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useEffect, useState, useMemo } from "react";
import { useLeadStore } from "@/stores/useLeadStore";
import { LeadInterface } from "@/interfaces/leads";
import { useDebouncedCallback } from "use-debounce";
import { TABLE_HEAD_LEADS } from "@/consts/data-leads";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardFilters } from "@/components/dashboard/dashboard-filters";
import { BulkActions } from "@/components/dashboard/bulk-actions";
import { LeadsTableHeader } from "@/components/dashboard/leads-table-header";
import { LeadTableRow } from "@/components/dashboard/lead-table-row";
import { Pagination } from "@/components/dashboard/pagination";
import { LeadFormDialog } from "@/components/dashboard/lead-form-dialog";
import { LeadDetailDialog } from "@/components/dashboard/lead-detail-dialog";
import { useLeadFilters } from "@/hooks/useLeadFilters";
import { useLeadForm } from "@/hooks/useLeadForm";

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
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedLeads, setSelectedLeads] = useState<Set<string>>(new Set());
  const [bulkStatus, setBulkStatus] = useState("");
  const [selectedLead, setSelectedLead] = useState<LeadInterface | null>(null);

  const { form, updateForm, resetForm, setFormFromLead } = useLeadForm();
  const {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    sourceFilter,
    setSourceFilter,
    sortConfig,
    handleSort,
    sortedLeads,
  } = useLeadFilters(leads);

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

  // Pagination
  const paginatedLeads = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sortedLeads.slice(start, start + pageSize);
  }, [sortedLeads, page, pageSize]);

  const totalPages = Math.ceil(sortedLeads.length / pageSize);

  // Selection handlers
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedLeads(new Set(paginatedLeads.map((l) => l.id)));
    } else {
      setSelectedLeads(new Set());
    }
  };

  const handleSelectLead = (leadId: string, checked: boolean) => {
    const newSet = new Set(selectedLeads);
    if (checked) {
      newSet.add(leadId);
    } else {
      newSet.delete(leadId);
    }
    setSelectedLeads(newSet);
  };

  // Bulk update
  const handleBulkUpdate = async () => {
    if (bulkStatus && selectedLeads.size > 0) {
      console.log("Bulk update:", Array.from(selectedLeads), {
        status: bulkStatus,
      });
      setSelectedLeads(new Set());
      setBulkStatus("");
    }
  };

  // CRUD operations
  const handleAddLead = () => {
    resetForm();
    setIsAddOpen(true);
  };

  const handleCreateLead = async () => {
    await createLead({
      name: form.name,
      email: form.email,
      phone: form.phone,
      status: form.status,
      source: form.source,
      owner: {
        id: `user_${Date.now()}`,
        name: form.ownerName || "Unassigned",
      },
      tags: [],
    });
    setIsAddOpen(false);
    resetForm();
  };

  const handleEditLead = (lead: LeadInterface) => {
    setEditLead(lead);
    setFormFromLead(lead);
    setIsEditOpen(true);
  };

  const handleUpdateLead = async () => {
    if (!editLead) return;
    await updateLead(editLead.id, {
      name: form.name,
      email: form.email,
      phone: form.phone,
      status: form.status,
      source: form.source,
      owner: {
        id: editLead.owner?.id ?? `user_${Date.now()}`,
        name: form.ownerName || "Unassigned",
      },
    });
    setIsEditOpen(false);
    setEditLead(null);
    resetForm();
  };

  const handleDeleteLead = async (leadId: string) => {
    await deleteLead(leadId);
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
        <DashboardHeader
          totalLeads={leads.length}
          filteredLeads={sortedLeads.length}
          currentPage={page}
          totalPages={totalPages}
          onAddLead={handleAddLead}
        />

        <DashboardFilters
          searchTerm={searchTerm}
          statusFilter={statusFilter}
          sourceFilter={sourceFilter}
          pageSize={pageSize}
          onSearchChange={setSearchTerm}
          onStatusChange={setStatusFilter}
          onSourceChange={setSourceFilter}
          onPageSizeChange={setPageSize}
        />
      </div>

      {/* Bulk Actions */}
      <BulkActions
        selectedCount={selectedLeads.size}
        totalCount={paginatedLeads.length}
        bulkStatus={bulkStatus}
        onSelectAll={handleSelectAll}
        onBulkStatusChange={setBulkStatus}
        onBulkUpdate={handleBulkUpdate}
      />

      {/* Table */}
      <div className="bg-white/80 dark:bg-black/30 backdrop-blur-sm rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xl overflow-hidden">
        <Table>
          <LeadsTableHeader
            headers={TABLE_HEAD_LEADS}
            sortConfig={sortConfig}
            allSelected={
              selectedLeads.size === paginatedLeads.length &&
              paginatedLeads.length > 0
            }
            onSort={handleSort}
            onSelectAll={handleSelectAll}
          />
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
                <LeadTableRow
                  key={lead.id}
                  lead={lead}
                  isSelected={selectedLeads.has(lead.id)}
                  onSelect={(checked) => handleSelectLead(lead.id, checked)}
                  onClick={() => setSelectedLead(lead)}
                  onEdit={() => handleEditLead(lead)}
                  onDelete={() => handleDeleteLead(lead.id)}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {sortedLeads.length > pageSize && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          pageSize={pageSize}
          totalItems={sortedLeads.length}
          onPageChange={setPage}
        />
      )}

      {/* Add Lead Dialog */}
      <LeadFormDialog
        open={isAddOpen}
        title="Add Lead"
        formData={form}
        onOpenChange={setIsAddOpen}
        onFormChange={updateForm}
        onSubmit={handleCreateLead}
      />

      {/* Edit Lead Dialog */}
      <LeadFormDialog
        open={isEditOpen}
        title="Edit Lead"
        formData={form}
        onOpenChange={setIsEditOpen}
        onFormChange={updateForm}
        onSubmit={handleUpdateLead}
      />

      {/* Detail Modal */}
      <LeadDetailDialog
        lead={selectedLead}
        onOpenChange={() => setSelectedLead(null)}
      />
    </div>
  );
}
