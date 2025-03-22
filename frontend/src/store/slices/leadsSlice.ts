import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../services/api';

interface Lead {
  id: string;
  companyName: string;
  industry: string;
  contactName: string;
  email: string;
  phone: string;
  status: 'new' | 'contacted' | 'qualified' | 'unqualified';
  score: number;
  source: string;
  createdAt: string;
  updatedAt: string;
  lastActivity?: string;
  notes?: string;
  tags: string[];
}

interface LeadsState {
  leads: Lead[];
  filteredLeads: Lead[];
  selectedLead: Lead | null;
  isLoading: boolean;
  error: string | null;
  filters: {
    status: string | null;
    minScore: number | null;
    industry: string | null;
    source: string | null;
    searchQuery: string;
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
  sortBy: {
    field: string;
    direction: 'asc' | 'desc';
  };
}

const initialState: LeadsState = {
  leads: [],
  filteredLeads: [],
  selectedLead: null,
  isLoading: false,
  error: null,
  filters: {
    status: null,
    minScore: null,
    industry: null,
    source: null,
    searchQuery: '',
  },
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
  },
  sortBy: {
    field: 'score',
    direction: 'desc',
  },
};

export const fetchLeads = createAsyncThunk(
  'leads/fetchLeads',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { leads } = getState() as { leads: LeadsState };
      const { page, limit } = leads.pagination;
      const { field, direction } = leads.sortBy;
      const { status, minScore, industry, source, searchQuery } = leads.filters;
      
      const params = new URLSearchParams();
      params.append('page', String(page));
      params.append('limit', String(limit));
      params.append('sortBy', field);
      params.append('sortDirection', direction);
      
      if (status) params.append('status', status);
      if (minScore !== null) params.append('minScore', String(minScore));
      if (industry) params.append('industry', industry);
      if (source) params.append('source', source);
      if (searchQuery) params.append('search', searchQuery);
      
      const response = await api.get(`/leads?${params.toString()}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch leads');
    }
  }
);

export const fetchLeadById = createAsyncThunk(
  'leads/fetchLeadById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/leads/${id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch lead');
    }
  }
);

export const createLead = createAsyncThunk(
  'leads/createLead',
  async (leadData: Partial<Lead>, { rejectWithValue }) => {
    try {
      const response = await api.post('/leads', leadData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create lead');
    }
  }
);

export const updateLead = createAsyncThunk(
  'leads/updateLead',
  async ({ id, data }: { id: string; data: Partial<Lead> }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/leads/${id}`, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update lead');
    }
  }
);

export const deleteLead = createAsyncThunk(
  'leads/deleteLead',
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`/leads/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete lead');
    }
  }
);

const leadsSlice = createSlice({
  name: 'leads',
  initialState,
  reducers: {
    setFilter(state, action: PayloadAction<{ key: string; value: any }>) {
      const { key, value } = action.payload;
      (state.filters as any)[key] = value;
      state.pagination.page = 1; // Reset to first page when filter changes
    },
    clearFilters(state) {
      state.filters = {
        status: null,
        minScore: null,
        industry: null,
        source: null,
        searchQuery: '',
      };
      state.pagination.page = 1;
    },
    setPage(state, action: PayloadAction<number>) {
      state.pagination.page = action.payload;
    },
    setLimit(state, action: PayloadAction<number>) {
      state.pagination.limit = action.payload;
      state.pagination.page = 1;
    },
    setSortBy(state, action: PayloadAction<{ field: string; direction: 'asc' | 'desc' }>) {
      state.sortBy = action.payload;
    },
    clearSelectedLead(state) {
      state.selectedLead = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch leads
      .addCase(fetchLeads.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchLeads.fulfilled,
        (state, action: PayloadAction<{ leads: Lead[]; total: number }>) => {
          state.isLoading = false;
          state.leads = action.payload.leads;
          state.filteredLeads = action.payload.leads;
          state.pagination.total = action.payload.total;
        }
      )
      .addCase(fetchLeads.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Fetch lead by ID
      .addCase(fetchLeadById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchLeadById.fulfilled, (state, action: PayloadAction<Lead>) => {
        state.isLoading = false;
        state.selectedLead = action.payload;
      })
      .addCase(fetchLeadById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Create lead
      .addCase(createLead.fulfilled, (state, action: PayloadAction<Lead>) => {
        state.leads.unshift(action.payload);
        state.filteredLeads = [...state.leads];
        state.pagination.total += 1;
      })
      
      // Update lead
      .addCase(updateLead.fulfilled, (state, action: PayloadAction<Lead>) => {
        const index = state.leads.findIndex((lead) => lead.id === action.payload.id);
        if (index !== -1) {
          state.leads[index] = action.payload;
          state.filteredLeads = [...state.leads];
          if (state.selectedLead?.id === action.payload.id) {
            state.selectedLead = action.payload;
          }
        }
      })
      
      // Delete lead
      .addCase(deleteLead.fulfilled, (state, action: PayloadAction<string>) => {
        state.leads = state.leads.filter((lead) => lead.id !== action.payload);
        state.filteredLeads = [...state.leads];
        state.pagination.total -= 1;
        if (state.selectedLead?.id === action.payload) {
          state.selectedLead = null;
        }
      });
  },
});

export const { setFilter, clearFilters, setPage, setLimit, setSortBy, clearSelectedLead } =
  leadsSlice.actions;

export default leadsSlice.reducer;
