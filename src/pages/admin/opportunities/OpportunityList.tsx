import React, { useEffect, useMemo, useState } from 'react';
import {
  Calendar,
  Filter,
  Loader2,
  Plus,
  Search,
  Trash2
} from 'lucide-react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Badge from '../../../components/ui/Badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '../../../components/ui/Table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../../../components/ui/Dialog';
import { useToast } from '../../../components/ui/ToastProvider';
import OpportunityForm, { OpportunityFormValues } from '../../../components/admin/opportunities/OpportunityForm';
import OpportunityDrawer from '../../../components/admin/opportunities/OpportunityDrawer';
import type { AdminOpportunity } from '../../../types/adminOpportunity';
import { useAdminCheck } from '../../../hooks/useAdminCheck';
import {
  createOpportunity,
  deleteOpportunity,
  listenToOpportunities,
  updateOpportunity
} from '../../../services/admin/opportunities';

type DeadlineFilter = 'all' | 'this-month' | 'next-quarter' | 'past-due' | 'no-deadline';

const formatDeadline = (value: string | null) => {
  if (!value) {
    return 'No deadline';
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const OpportunityList: React.FC = () => {
  const { isAdmin, loading: adminLoading } = useAdminCheck();
  const { toast } = useToast();

  const [opportunities, setOpportunities] = useState<AdminOpportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [deadlineFilter, setDeadlineFilter] = useState<DeadlineFilter>('all');

  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [editingOpportunity, setEditingOpportunity] = useState<AdminOpportunity | null>(null);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeOpportunity, setActiveOpportunity] = useState<AdminOpportunity | null>(null);

  useEffect(() => {
    if (adminLoading) {
      return;
    }

    if (!isAdmin) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = listenToOpportunities(
      (payload) => {
        setOpportunities(payload);
        setLoading(false);
        setError(null);
      },
      (err) => {
        const message = err instanceof Error ? err.message : 'Unable to fetch opportunities.';
        setError(message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [adminLoading, isAdmin]);

  const categories = useMemo(() => {
    const unique = new Set<string>();
    opportunities.forEach((item) => {
      if (item.category) {
        unique.add(item.category);
      }
    });
    return Array.from(unique).sort((a, b) => a.localeCompare(b));
  }, [opportunities]);

  const filteredOpportunities = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    const now = new Date();

    const matchesDeadline = (deadline: string | null): boolean => {
      if (deadlineFilter === 'all') {
        return true;
      }

      if (deadlineFilter === 'no-deadline') {
        return !deadline;
      }

      if (!deadline) {
        return false;
      }

      const date = new Date(deadline);
      if (Number.isNaN(date.getTime())) {
        return false;
      }

      if (deadlineFilter === 'past-due') {
        return date < now;
      }

      if (deadlineFilter === 'this-month') {
        return (
          date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
        );
      }

      if (deadlineFilter === 'next-quarter') {
        const diff = date.getTime() - now.getTime();
        const ninetyDays = 1000 * 60 * 60 * 24 * 90;
        return diff >= 0 && diff <= ninetyDays;
      }

      return true;
    };

    return opportunities.filter((opportunity) => {
      const searchMatch =
        term.length === 0 ||
        opportunity.title.toLowerCase().includes(term) ||
        opportunity.description.toLowerCase().includes(term) ||
        opportunity.tags.some((tag) => tag.toLowerCase().includes(term));

      const categoryMatch = categoryFilter === 'all' || opportunity.category === categoryFilter;
      const statusMatch = statusFilter === 'all' || opportunity.status === statusFilter;

      const deadlineMatch = matchesDeadline(opportunity.deadline);

      return searchMatch && categoryMatch && statusMatch && deadlineMatch;
    });
  }, [opportunities, searchTerm, categoryFilter, statusFilter, deadlineFilter]);

  const handleCreateSubmit = async (values: OpportunityFormValues) => {
    await createOpportunity(values);
    toast({
      title: 'Opportunity published',
      description: 'The opportunity has been added to the catalog.',
      variant: 'success'
    });
  };

  const handleEditSubmit = async (values: OpportunityFormValues) => {
    if (!editingOpportunity) {
      return;
    }
    await updateOpportunity(editingOpportunity.id, values);
    toast({
      title: 'Opportunity updated',
      description: 'Changes have been saved successfully.',
      variant: 'success'
    });
    setEditingOpportunity(null);
  };

  const handleDelete = async (opportunity: AdminOpportunity) => {
    const confirmed = window.confirm(`Delete ${opportunity.title}? This action cannot be undone.`);
    if (!confirmed) {
      return;
    }
    await deleteOpportunity(opportunity.id);
    toast({
      title: 'Opportunity removed',
      description: 'The opportunity has been deleted from Firestore.',
      variant: 'success'
    });
    if (activeOpportunity?.id === opportunity.id) {
      setDrawerOpen(false);
      setActiveOpportunity(null);
    }
  };

  const openCreateModal = () => {
    setFormMode('create');
    setEditingOpportunity(null);
    setFormOpen(true);
  };

  const openEditModal = (opportunity: AdminOpportunity) => {
    setFormMode('edit');
    setEditingOpportunity(opportunity);
    setFormOpen(true);
  };

  const handleRowClick = (opportunity: AdminOpportunity) => {
    setActiveOpportunity(opportunity);
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setActiveOpportunity(null);
  };

  if (adminLoading) {
    return (
      <div className="flex h-[70vh] flex-col items-center justify-center gap-4 text-gray-500">
        <Loader2 className="h-6 w-6 animate-spin" />
        <p>Checking admin access…</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-xl rounded-2xl border border-red-100 bg-red-50 p-8 text-center text-sm text-red-600">
        <h2 className="text-lg font-semibold text-red-700">Admin access required</h2>
        <p className="mt-2">You need elevated permissions to manage opportunities.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 lg:p-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Opportunity Management</h1>
          <p className="text-sm text-gray-500">
            Review, publish, and curate the opportunities powering the learner experience.
          </p>
        </div>
        <Button onClick={openCreateModal}>
          <Plus size={16} />
          Add opportunity
        </Button>
      </header>

      <section className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600">
            <Calendar size={16} className="text-gray-400" />
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-400">Tracked</p>
              <p className="font-semibold text-gray-900">{opportunities.length}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600">
            <Filter size={16} className="text-gray-400" />
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-400">Categories</p>
              <p className="font-semibold text-gray-900">{categories.length}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600">
            <Search size={16} className="text-gray-400" />
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-400">Search results</p>
              <p className="font-semibold text-gray-900">{filteredOpportunities.length}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600">
            <Trash2 size={16} className="text-gray-400" />
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-400">Cleanup</p>
              <p className="font-semibold text-gray-900">
                {opportunities.filter((item) => item.status === 'expired').length} expired
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border border-gray-200 bg-white p-4 sm:p-5">
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search opportunities…"
              className="pl-9"
            />
          </div>
          <Select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}>
            <option value="all">All categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </Select>
          <Select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
            <option value="all">All statuses</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="expired">Expired</option>
          </Select>
          <Select value={deadlineFilter} onChange={(event) => setDeadlineFilter(event.target.value as DeadlineFilter)}>
            <option value="all">Any deadline</option>
            <option value="this-month">This month</option>
            <option value="next-quarter">Next 90 days</option>
            <option value="past-due">Past due</option>
            <option value="no-deadline">No deadline</option>
          </Select>
        </div>

        {loading ? (
          <div className="flex h-48 flex-col items-center justify-center gap-3 text-gray-500">
            <Loader2 className="h-6 w-6 animate-spin" />
            <p>Loading opportunities…</p>
          </div>
        ) : error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-600">
            {error}
          </div>
        ) : filteredOpportunities.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-200 p-10 text-center text-sm text-gray-500">
            <p className="font-medium text-gray-700">No opportunities found</p>
            <p className="mt-2 text-gray-500">
              Adjust your filters or add a new opportunity to get started.
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Opportunity</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Deadline</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOpportunities.map((opportunity) => (
                <TableRow key={opportunity.id} onClick={() => handleRowClick(opportunity)} className="cursor-pointer">
                  <TableCell>
                    <div className="space-y-1">
                      <p className="font-medium text-gray-900">{opportunity.title}</p>
                      <p className="text-xs text-gray-500 line-clamp-1">{opportunity.description}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">{opportunity.category}</TableCell>
                  <TableCell className="text-sm text-gray-600">{formatDeadline(opportunity.deadline)}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        opportunity.status === 'published'
                          ? 'success'
                          : opportunity.status === 'expired'
                            ? 'danger'
                            : 'outline'
                      }
                    >
                      {opportunity.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {opportunity.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline">
                          #{tag}
                        </Badge>
                      ))}
                      {opportunity.tags.length > 3 && (
                        <span className="text-xs text-gray-500">
                          +{opportunity.tags.length - 3} more
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={(event) => {
                          event.stopPropagation();
                          openEditModal(opportunity);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="border-red-200 text-red-600 hover:bg-red-50"
                        onClick={(event) => {
                          event.stopPropagation();
                          handleDelete(opportunity);
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </section>

      <Dialog open={formOpen} onOpenChange={(nextOpen) => setFormOpen(nextOpen)}>
        <DialogContent>
          <DialogHeader className="space-y-1">
            <DialogTitle>
              {formMode === 'create' ? 'Add opportunity' : 'Edit opportunity'}
            </DialogTitle>
            <DialogDescription>
              {formMode === 'create'
                ? 'Publish a new scholarship, internship, or fellowship opportunity.'
                : 'Update the details for this opportunity.'}
            </DialogDescription>
          </DialogHeader>
          <OpportunityForm
            mode={formMode}
            initialData={formMode === 'edit' ? editingOpportunity ?? undefined : undefined}
            onSubmit={formMode === 'create' ? handleCreateSubmit : handleEditSubmit}
            onClose={() => {
              setFormOpen(false);
              setEditingOpportunity(null);
            }}
          />
        </DialogContent>
      </Dialog>

      <OpportunityDrawer
        open={drawerOpen}
        opportunity={activeOpportunity}
        onClose={closeDrawer}
        onEdit={(opportunity) => {
          closeDrawer();
          openEditModal(opportunity);
        }}
        onDelete={(opportunity) => {
          closeDrawer();
          handleDelete(opportunity);
        }}
      />
    </div>
  );
};

export default OpportunityList;
