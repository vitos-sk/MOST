/**
 * Custom hook for votes data
 */

import { useState, useEffect, useCallback } from "react";
import { votesService } from "../services/api";

/**
 * Hook for fetching votes by question ID
 * @param {string} questionId - Question ID
 * @returns {Object} Votes data and loading state
 */
export const useVotesByQuestion = (questionId) => {
  const [votes, setVotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchVotes = useCallback(async () => {
    if (!questionId) return;

    setLoading(true);
    setError(null);
    try {
      const data = await votesService.getByQuestionId(questionId);
      setVotes(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [questionId]);

  useEffect(() => {
    fetchVotes();
  }, [fetchVotes]);

  return {
    votes,
    loading,
    error,
    refetch: fetchVotes,
  };
};

/**
 * Hook for submitting a vote
 * @returns {Function} Submit vote function
 */
export const useSubmitVote = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const submitVote = useCallback(async (userId, questionId, choice) => {
    setLoading(true);
    setError(null);
    try {
      const result = await votesService.addVote(userId, questionId, choice);
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    submitVote,
    loading,
    error,
  };
};
