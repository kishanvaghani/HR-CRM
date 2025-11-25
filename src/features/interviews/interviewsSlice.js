import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { interviewService } from '../../services/interviewService';

export const fetchInterviews = createAsyncThunk(
  'interviews/fetchInterviews',
  async (_, { rejectWithValue }) => {
    try {
      const response = await interviewService.getAllInterviews();
      
      if (response.data && response.data.success) {
        return response.data.data; 
      } else {
        return response.data || []; 
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch interviews');
    }
  }
);

export const addInterview = createAsyncThunk(
  'interviews/addInterview',
  async (interviewData, { rejectWithValue }) => {
    try {
      const response = await interviewService.createInterview(interviewData);
      
      if (response.data && response.data.success) {
        return response.data.data; 
      } else {
        return response.data; 
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add interview');
    }
  }
);

export const updateInterview = createAsyncThunk(
  'interviews/updateInterview',
  async ({ id, interviewData }, { rejectWithValue }) => {
    try {
      const response = await interviewService.updateInterview(id, interviewData);
     
      if (response.data && response.data.success) {
        return response.data.data; 
      } else {
        return response.data; 
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update interview');
    }
  }
);

export const deleteInterview = createAsyncThunk(
  'interviews/deleteInterview',
  async (id, { rejectWithValue }) => {
    try {
      const response = await interviewService.deleteInterview(id);
      
      if (response.data && response.data.success) {
        return id; 
      } else {
        return id; 
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete interview');
    }
  }
);

const interviewsSlice = createSlice({
  name: 'interviews',
  initialState: {
    items: [],
    selectedInterview: null,
    loading: false,
    error: null,
    modal: {
      show: false,
      editing: false,
    },
    // Add filters state
    filters: {
      search: '',
      status: '',
      round: ''
    }
  },
  reducers: {
    showModal: (state, action) => {
      state.modal.show = true;
      state.modal.editing = !!action.payload;
      state.selectedInterview = action.payload || null;
    },
    hideModal: (state) => {
      state.modal.show = false;
      state.modal.editing = false;
      state.selectedInterview = null;
      state.error = null;
    },
    setSelectedInterview: (state, action) => {
      state.selectedInterview = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetInterviews: (state) => {
      state.items = [];
      state.selectedInterview = null;
      state.loading = false;
      state.error = null;
    },
    // Add filter actions
    setInterviewFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearInterviewFilters: (state) => {
      state.filters = {
        search: '',
        status: '',
        round: ''
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch interviews
      .addCase(fetchInterviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInterviews.fulfilled, (state, action) => {
        state.loading = false;
        // Ensure we're always setting an array
        state.items = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchInterviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.items = []; // Reset items on error
      })
      
      // Add interview
      .addCase(addInterview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addInterview.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.items.push(action.payload);
        }
        state.modal.show = false;
        state.selectedInterview = null;
      })
      .addCase(addInterview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update interview
      .addCase(updateInterview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateInterview.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload && action.payload._id) {
          const index = state.items.findIndex(item => item._id === action.payload._id);
          if (index !== -1) {
            state.items[index] = action.payload;
          }
        }
        state.modal.show = false;
        state.selectedInterview = null;
      })
      .addCase(updateInterview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete interview
      .addCase(deleteInterview.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item._id !== action.payload);
      })
      .addCase(deleteInterview.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const {
  showModal,
  hideModal,
  setSelectedInterview,
  clearError,
  resetInterviews,
  setInterviewFilters,
  clearInterviewFilters,
} = interviewsSlice.actions;

export default interviewsSlice.reducer;