import { createSelector } from '@reduxjs/toolkit';

// Basic selectors
export const selectAllCandidates = (state) => state.candidates.items;
export const selectCandidateLoading = (state) => state.candidates.loading;
export const selectCandidateError = (state) => state.candidates.error;
export const selectSelectedCandidate = (state) => state.candidates.selectedCandidate;
export const selectCandidateModalState = (state) => state.candidates.modal;
export const selectCandidateFilters = (state) => state.candidates.filters;

// Memoized selectors
export const selectCandidateById = (state, candidateId) =>
  state.candidates.items.find(candidate => candidate._id === candidateId);

export const selectCandidatesByStatus = (state, status) =>
  state.candidates.items.filter(candidate => candidate.status === status);

export const selectCandidatesByPosition = (state, position) =>
  state.candidates.items.filter(candidate => candidate.position === position);

// Complex filtered candidates selector
export const selectFilteredCandidates = createSelector(
  [selectAllCandidates, selectCandidateFilters],
  (candidates, filters) => {
    let filtered = candidates;

    // Filter by status
    if (filters.status) {
      filtered = filtered.filter(candidate => 
        candidate.status === filters.status
      );
    }

    // Filter by position
    if (filters.position) {
      filtered = filtered.filter(candidate => 
        candidate.position.toLowerCase().includes(filters.position.toLowerCase())
      );
    }

    // Filter by search term (name or email)
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(candidate => 
        candidate.name.toLowerCase().includes(searchTerm) ||
        candidate.email.toLowerCase().includes(searchTerm) ||
        candidate.position.toLowerCase().includes(searchTerm)
      );
    }

    return filtered;
  }
);

// Statistics selectors
export const selectCandidatesStats = createSelector(
  [selectAllCandidates],
  (candidates) => {
    const total = candidates.length;
    const byStatus = candidates.reduce((acc, candidate) => {
      acc[candidate.status] = (acc[candidate.status] || 0) + 1;
      return acc;
    }, {});

    const byPosition = candidates.reduce((acc, candidate) => {
      acc[candidate.position] = (acc[candidate.position] || 0) + 1;
      return acc;
    }, {});

    return {
      total,
      byStatus,
      byPosition,
    };
  }
);

// Select candidates for dropdown (id, name, email)
export const selectCandidatesForDropdown = createSelector(
  [selectAllCandidates],
  (candidates) => 
    candidates.map(candidate => ({
      _id: candidate._id,
      name: candidate.name,
      email: candidate.email,
      position: candidate.position
    }))
);

// Select recent candidates (last 7 days)
export const selectRecentCandidates = createSelector(
  [selectAllCandidates],
  (candidates) => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    return candidates.filter(candidate => 
      new Date(candidate.createdAt) > oneWeekAgo
    ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }
);