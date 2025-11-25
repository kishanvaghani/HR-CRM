import { createSelector } from '@reduxjs/toolkit';

// BASIC SELECTORS
export const selectAllInterviews = (state) => state.interviews.items;
export const selectInterviewLoading = (state) => state.interviews.loading;
export const selectInterviewError = (state) => state.interviews.error;
export const selectSelectedInterview = (state) => state.interviews.selectedInterview;
export const selectModalState = (state) => state.interviews.modal;
export const selectInterviewFilters = (state) => state.interviews.filters;

// SELECT BY ID / STATUS / CANDIDATE / ROUND
export const selectInterviewById = (state, id) =>
  state.interviews.items.find(interview => interview._id === id);

export const selectInterviewsByStatus = (state, status) =>
  state.interviews.items.filter(interview => interview.status === status);

export const selectInterviewsByCandidate = (state, email) =>
  state.interviews.items.filter(interview => interview.email === email);

export const selectInterviewsByRound = (state, round) =>
  state.interviews.items.filter(interview => interview.round === round);

// FILTERED SELECTOR
export const selectFilteredInterviews = createSelector(
  [selectAllInterviews, selectInterviewFilters],
  (interviews, filters) => {
    let filtered = interviews;

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(interview =>
        interview.candidate?.toLowerCase().includes(searchTerm) ||
        interview.email?.toLowerCase().includes(searchTerm) ||
        interview.position?.toLowerCase().includes(searchTerm)
      );
    }

    if (filters.status) {
      filtered = filtered.filter(interview => interview.status === filters.status);
    }

    if (filters.round) {
      filtered = filtered.filter(interview => interview.round === filters.round);
    }

    return filtered;
  }
);

// GROUPED BY ROUND
export const selectInterviewsGroupedByRound = createSelector(
  [selectAllInterviews],
  (interviews) => ({
    firstRound: interviews.filter(i => i.round === "1st Round" && i.status !== "Completed"),
    secondRound: interviews.filter(i => i.round === "2nd Round" && i.status !== "Completed"),
    finalRound: interviews.filter(i => i.round === "Final Round" && i.status !== "Completed"),
    completed: interviews.filter(i => i.status === "Completed")
  })
);

// STATS
export const selectInterviewStats = createSelector(
  [selectAllInterviews],
  (interviews) => {
    const total = interviews.length;

    const byStatus = interviews.reduce((acc, i) => {
      acc[i.status] = (acc[i.status] || 0) + 1;
      return acc;
    }, {});

    const byRound = interviews.reduce((acc, i) => {
      acc[i.round] = (acc[i.round] || 0) + 1;
      return acc;
    }, {});

    return {
      total,
      byStatus,
      byRound,
      pending: interviews.filter(i => i.status === 'Pending').length,
      scheduled: interviews.filter(i => i.status === 'Scheduled').length,
      completed: interviews.filter(i => i.status === 'Completed').length,
    };
  }
);

// CALENDAR EVENTS
export const selectInterviewsForCalendar = createSelector(
  [selectAllInterviews],
  (interviews) =>
    interviews
      .filter(i => i.date && i.time)
      .map(i => ({
        id: i._id,
        title: `${i.candidate} - ${i.position}`,
        start: new Date(`${i.date}T${i.time}`),
        end: new Date(new Date(`${i.date}T${i.time}`).getTime() + 60 * 60 * 1000),
        candidate: i.candidate,
        position: i.position,
        round: i.round,
        status: i.status
      }))
);

// UPCOMING INTERVIEWS
export const selectUpcomingInterviews = createSelector(
  [selectAllInterviews],
  (interviews) => {
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    return interviews
      .filter(i => {
        if (!i.date) return false;
        const date = new Date(i.date);
        return date >= today && date <= nextWeek;
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }
);

// ACTION REQUIRED
export const selectPendingActionInterviews = createSelector(
  [selectAllInterviews],
  (interviews) => interviews.filter(i =>
    i.status === 'Pending' || i.status === 'Scheduled'
  )
);
