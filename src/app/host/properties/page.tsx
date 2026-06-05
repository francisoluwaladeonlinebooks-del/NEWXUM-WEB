'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { propertyApi } from '@/lib/api';
import {
  Badge, Button, Card, CardContent, Input, Label, Spinner,
} from '@/components/ui';
import { formatDate } from '@/lib/utils';
import { toast } from 'sonner';
import { Building2, Plus } from 'lucide-react';

const STATUS_BADGE: Record<string, any> = {
  PendingApproval: 'warning', Approved: 'success',
  Rejected: 'destructive', Suspended: 'secondary',
};

export default function HostPropertiesPage() {
  const { data: session } = useSession();
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', address: '' });

  useEffect(() => {
    if (!session) return;
    // List all properties and filter by host
    propertyApi.list({ page: 1, pageSize: 50 }).then(res => {
      if (res.success) {
        const all = (res.data as any)?.items ?? [];
        setProperties(all.filter((p: any) => p.hostId === session.user.id));
      }
      setLoading(false);
    });
  }, [session]);

  async function handleCreate() {
    if (!form.name || !form.description || !form.address) {
      toast.error('Fill in all fields');
      return;
    }
    setSubmitting(true);
    const res = await propertyApi.create(session!.accessToken, form);
    setSubmitting(false);
    if (res.success) {
      setProperties(prev => [res.data, ...prev]);
      setShowForm(false);
      setForm({ name: '', description: '', address: '' });
      toast.success('Property submitted for admin approval');
    } else {
      toast.error((res as any).error?.message ?? 'Failed to create property');
    }
  }

  if (loading) return <div className="flex items-center justify-center h-64"><Spinner /></div>;

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Properties</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Properties must be approved by admin before guests can book
          </p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4" /> Add Property
        </Button>
      </div>

      {/* Create form */}
      {showForm && (
        <Card className="mb-6 border-teal-200">
          <CardContent className="p-5">
            <h3 className="font-semibold mb-4">New Property</h3>
            <div className="space-y-4">
              <div>
                <Label className="mb-1 block">Property Name</Label>
                <Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  placeholder="Adebayo Guest House" />
              </div>
              <div>
                <Label className="mb-1 block">Address</Label>
                <Input value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))}
                  placeholder="5 Redemption Road, Zone A, RCCG Camp" />
              </div>
              <div>
                <Label className="mb-1 block">Description</Label>
                <textarea
                  value={form.description}
                  onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                  placeholder="Clean, comfortable rooms with 24/7 security..."
                  rows={3}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <Button onClick={handleCreate} disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit for Approval'}
              </Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Properties list */}
      {properties.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <Building2 className="h-12 w-12 mb-3 opacity-30" />
            <p>No properties yet</p>
            <p className="text-xs mt-1">Add a property above to start receiving bookings</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {properties.map((property: any) => (
            <Card key={property.id}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold">{property.name}</h3>
                      <Badge variant={STATUS_BADGE[property.status] ?? 'secondary'}>
                        {property.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{property.address}</p>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {property.description}
                    </p>
                    {property.status === 'PendingApproval' && (
                      <p className="text-xs text-amber-600 mt-2">
                        ⏳ Awaiting admin review — you will be notified by email
                      </p>
                    )}
                    {property.lastSupervisedAt && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Last supervised: {formatDate(property.lastSupervisedAt)}
                        {property.nextSupervisionDue && ` · Next due: ${formatDate(property.nextSupervisionDue)}`}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
