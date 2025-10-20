import type { Opportunity } from '../types/opportunity';

const DEFAULT_ENDPOINT = '/data/opportunities.json';

let cachedOpportunities: Opportunity[] | null = null;

interface FetchOptions {
  signal?: AbortSignal;
  force?: boolean;
}

const getEndpoint = () => {
  const envUrl = import.meta.env.VITE_OPPORTUNITIES_API_URL;
  return typeof envUrl === 'string' && envUrl.trim().length > 0
    ? envUrl.trim()
    : DEFAULT_ENDPOINT;
};

export async function fetchOpportunities(options: FetchOptions = {}): Promise<Opportunity[]> {
  const { signal, force } = options;

  if (!force && cachedOpportunities) {
    return cachedOpportunities;
  }

  const response = await fetch(getEndpoint(), { signal });

  if (!response.ok) {
    throw new Error(`Unable to fetch opportunities (status ${response.status})`);
  }

  const payload = await response.json();

  if (!Array.isArray(payload)) {
    throw new Error('Received malformed opportunities payload');
  }

  // Basic runtime validation to guard against incomplete records.
  const normalised = payload.filter((item): item is Opportunity => {
    return (
      item &&
      typeof item.id === 'string' &&
      typeof item.title === 'string' &&
      typeof item.organization === 'string'
    );
  });

  cachedOpportunities = normalised;
  return normalised;
}

export function clearOpportunitiesCache() {
  cachedOpportunities = null;
}
