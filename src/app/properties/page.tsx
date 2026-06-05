import { propertyApi } from '@/lib/api';
import { Property } from '@/types';
import { Badge, Card, CardContent } from '@/components/ui';
import Link from 'next/link';
import { Building2, MapPin, AlertCircle } from 'lucide-react';

export const revalidate = 60;

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const page = Number(searchParams.page ?? 1);

  // Gracefully handle backend being offline
  let properties: Property[] = [];
  let totalPages = 0;
  let totalCount = 0;
  let backendOffline = false;

  try {
    const res = await propertyApi.list({ page, pageSize: 12 });
    if (res.success && res.data) {
      properties = res.data.items ?? [];
      totalPages = res.data.totalPages ?? 0;
      totalCount = res.data.totalCount ?? 0;
    }
  } catch {
    backendOffline = true;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid gap-8 xl:grid-cols-[1.75fr_1fr]">
        <div className="rounded-[2rem] bg-gradient-to-br from-[#1B3A6B] to-[#2563EB] p-10 text-white shadow-2xl shadow-slate-900/10">
          <p className="text-sm uppercase tracking-[0.3em] text-blue-200">Guest accommodation</p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">Approved properties for Redemption City.</h1>
          <p className="mt-4 max-w-xl text-base leading-8 text-slate-200">
            Browse verified guest accommodation with live status, host details, and access to the latest room availability.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl bg-white/10 p-6">
              <p className="text-sm text-slate-200">Properties listed</p>
              <p className="mt-2 text-3xl font-semibold">{backendOffline ? '—' : totalCount}</p>
            </div>
            <div className="rounded-3xl bg-white/10 p-6">
              <p className="text-sm text-slate-200">Browse without login</p>
              <p className="mt-2 text-3xl font-semibold">Open access</p>
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Search properties</p>
              <p className="mt-2 text-sm text-slate-600">Filter by name, host, or address.</p>
            </div>
            <Badge variant="info">Browse only</Badge>
          </div>
          <div className="mt-6 space-y-4">
            <label className="block text-sm font-medium text-slate-700">Search</label>
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                type="search"
                placeholder="Search by property, host, or address"
                className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#1B3A6B] focus:ring-2 focus:ring-[#1B3A6B]/10"
              />
              <button
                type="button"
                className="rounded-2xl bg-[#1B3A6B] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#2563EB]"
              >
                Search
              </button>
            </div>
            <p className="text-xs text-slate-500">Search is read-only in this demo. Browse any listing directly below.</p>
          </div>
        </div>
      </div>

      {backendOffline && (
        <div className="mt-8 rounded-3xl border border-amber-200 bg-amber-50 p-6 text-amber-900 shadow-sm">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-1 h-5 w-5" />
            <div>
              <p className="font-semibold">Backend not connected</p>
              <p className="mt-2 text-sm leading-6 text-amber-800">
                Start the .NET API with <code className="rounded bg-amber-100 px-1.5 py-0.5 text-xs font-mono">dotnet run</code> from <code className="rounded bg-amber-100 px-1.5 py-0.5 text-xs font-mono">nexum-backend/src/Nexum.Api</code>, then set <code className="rounded bg-amber-100 px-1.5 py-0.5 text-xs font-mono">NEXT_PUBLIC_API_URL</code> in <code className="rounded bg-amber-100 px-1.5 py-0.5 text-xs font-mono">.env.local</code>.
              </p>
            </div>
          </div>
        </div>
      )}

      <section className="mt-10">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Available listings</p>
            <p className="mt-2 text-base text-slate-600">{backendOffline ? 'Waiting for backend data.' : `${totalCount} properties available`}</p>
          </div>
          <Link href="/">
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-[#1B3A6B] hover:text-[#1B3A6B]">
              Back to homepage
            </span>
          </Link>
        </div>

        {properties.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-14 text-center text-slate-500 shadow-sm">
            <Building2 className="mx-auto mb-4 h-12 w-12 text-slate-300" />
            <p>{backendOffline ? 'Properties will appear here once the backend is running' : 'No properties available yet'}</p>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-3">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-10 flex flex-wrap justify-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Link
                key={p}
                href={`/properties?page=${p}`}
                className={`rounded-2xl px-4 py-2 text-sm font-medium transition ${p === page ? 'bg-[#1B3A6B] text-white' : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}
              >
                {p}
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function PropertyCard({ property }: { property: Property }) {
  const photo = property.photoUrls?.[0];

  return (
    <Link href={`/properties/${property.id}`}>
      <Card className="group overflow-hidden rounded-[2rem] border border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-2xl">
        <div className="relative h-56 overflow-hidden bg-slate-100">
          {photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photo} alt={property.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
          ) : (
            <div className="flex h-full items-center justify-center">
              <Building2 className="h-12 w-12 text-slate-300" />
            </div>
          )}
          <div className="absolute inset-x-4 top-4 flex justify-end">
            <Badge variant={property.status === 'Approved' ? 'success' : 'secondary'}>
              {property.status}
            </Badge>
          </div>
        </div>
        <CardContent className="p-6">
          <h3 className="line-clamp-2 text-lg font-semibold text-slate-900">{property.name}</h3>
          <div className="mt-3 flex items-center gap-2 text-sm text-slate-500">
            <MapPin className="h-4 w-4" />
            <span className="line-clamp-1">{property.address}</span>
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-600 line-clamp-3">{property.description}</p>
          <div className="mt-6 flex items-center justify-between border-t border-slate-200 pt-4 text-sm text-slate-600">
            <span>Host: {property.hostName}</span>
            <span className="font-semibold text-[#1B3A6B]">View rooms →</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
