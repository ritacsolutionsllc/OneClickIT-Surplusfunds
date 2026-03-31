export interface County {
  id: string;
  rank: number;
  name: string;
  state: string;
  population: number;
  listUrl: string | null;
  source: string | null;
  notes: string | null;
  rulesText: string | null;
  claimDeadline: string | null;
  lastScraped: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface FundEntry {
  property: string;
  claimant?: string;
  amount?: string;
  date?: string;
}

export interface FundsList {
  id: string;
  countyId: string;
  scrapeDate: Date;
  status: 'pending' | 'success' | 'error';
  fundsData: FundEntry[] | null;
  errorMsg: string | null;
  createdAt: Date;
}

export interface CountyWithFunds extends County {
  fundsLists: FundsList[];
}

export interface User {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  role: 'user' | 'admin';
  savedSearches: SavedSearch[];
}

export interface SavedSearch {
  id: string;
  query: string;
  filters: Record<string, string>;
  createdAt: string;
}

export interface Alert {
  id: string;
  userId: string;
  countyId: string;
  minAmount: number | null;
  active: boolean;
  createdAt: Date;
  county?: County;
}

export interface SearchResult {
  counties: County[];
  total: number;
  page: number;
  limit: number;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}
