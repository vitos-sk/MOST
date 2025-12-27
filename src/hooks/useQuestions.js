/**
 * Custom hook for questions data
 */

import { useState, useEffect, useCallback } from "react";
import { questionsService } from "../services/api";

/**
 * Hook for fetching questions by category
 * @param {string} categoryId - Category ID
 * @returns {Object} Questions data and loading state
 */
export const useQuestionsByCategory = (categoryId) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchQuestions = useCallback(async () => {
    if (!categoryId) return;

    setLoading(true);
    setError(null);
    try {
      const data = await questionsService.getByCategory(categoryId);
      setQuestions(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [categoryId]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  return {
    questions,
    loading,
    error,
    refetch: fetchQuestions,
  };
};

/**
 * Hook for fetching unanswered questions for a user in a category
 * @param {string} userId - User ID
 * @param {string} categoryId - Category ID
 * @returns {Object} Unanswered questions data and loading state
 */
export const useUnansweredQuestions = (userId, categoryId) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUnansweredQuestions = useCallback(async () => {
    if (!userId || !categoryId) return;

    setLoading(true);
    setError(null);
    try {
      // Import votesService dynamically to avoid circular dependency
      const { votesService } = await import("../services/api");
      // Get user votes first
      const userVotes = await votesService.getByUserId(userId);
      // Then get unanswered questions
      const data = await questionsService.getUnansweredByCategory(
        userId,
        categoryId,
        userVotes
      );
      setQuestions(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [userId, categoryId]);

  useEffect(() => {
    fetchUnansweredQuestions();
  }, [fetchUnansweredQuestions]);

  return {
    questions,
    loading,
    error,
    refetch: fetchUnansweredQuestions,
  };
};

/**
 * Hook for fetching all questions
 * @returns {Object} Questions data and loading state
 */
export const useAllQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchQuestions = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await questionsService.getAll();
      setQuestions(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  return {
    questions,
    loading,
    error,
    refetch: fetchQuestions,
  };
};

/**
 * Hook for fetching a single question
 * @param {string} questionId - Question ID
 * @returns {Object} Question data and loading state
 */
export const useQuestion = (questionId) => {
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchQuestion = useCallback(async () => {
    if (!questionId) return;

    setLoading(true);
    setError(null);
    try {
      const data = await questionsService.getById(questionId);
      setQuestion(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [questionId]);

  useEffect(() => {
    fetchQuestion();
  }, [fetchQuestion]);

  return {
    question,
    loading,
    error,
    refetch: fetchQuestion,
  };
};
