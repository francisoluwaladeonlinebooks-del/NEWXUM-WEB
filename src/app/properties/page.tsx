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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero banner */}
      <div className="rounded-2xl bg-gradient-to-br from-[#1B3A6B] to-[#2563EB] text-white p-8 mb-8">
        <h1 className="text-3xl font-bold mb-2">Redemption City Accommodation</h1>
        <p className="text-blue-100 text-lg">
          Browse approved guest properties for Holy Ghost Congress and monthly services
        </p>
        <p className="text-blue-200 text-sm mt-2">
          {backendOffline ? 'Connect your backend to see available properties' : `${totalCount} properties available · No login required to browse`}
        </p>
      </div>

      {/* Backend offline banner */}
      {backendOffline && (
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
          <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <div className="font-medium text-amber-800">Backend not connected</div>
            <div className="text-sm text-amber-700 mt-1">
              Start the .NET API with <code className="bg-amber-100 px-1.5 py-0.5 rounded text-xs font-mono">dotnet run</code> from <code className="bg-amber-100 px-1.5 py-0.5 rounded text-xs font-mono">nexum-backend/src/Nexum.Api</code>,
              then set <code className="bg-amber-100 px-1.5 py-0.5 rounded text-xs font-mono">NEXT_PUBLIC_API_URL</code> in your <code className="bg-amber-100 px-1.5 py-0.5 rounded text-xs font-mono">.env.local</code>.
            </div>
          </div>
        </div>
      )}

      {/* Property grid */}
      {properties.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Building2 className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p>{backendOffline ? 'Properties will appear here once the backend is running' : 'No properties available yet'}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map(property => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <Link key={p} href={`/properties?page=${p}`}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                p === page
                  ? 'bg-primary text-white'
                  : 'bg-white border hover:bg-gray-50'
              }`}>
              {p}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function PropertyCard({ property }: { property: Property }) {
  const photo = property.photoUrls?.[0];

  return (
    <Link href={`/properties/${property.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full">
        <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
          {photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photo} alt={property.name} className="w-full h-full object-cover" />
          ) : (
            <div className="flex items-center justify-center h-full">
              <Building2 className="h-12 w-12 text-gray-300" />
            </div>
          )}
          <div className="absolute top-3 right-3">
            <Badge variant={property.status === 'Approved' ? 'success' : 'secondary'}>
              {property.status}
            </Badge>
          </div>
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-base mb-1 line-clamp-1">{property.name}</h3>
          <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
            <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
            <span className="line-clamp-1">{property.address}</span>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">{property.description}</p>
          <div className="mt-3 pt-3 border-t flex items-center justify-between">
            <div className="text-xs text-muted-foreground">Host: {property.hostName}</div>
            <span className="text-sm font-medium text-primary">View rooms →</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
