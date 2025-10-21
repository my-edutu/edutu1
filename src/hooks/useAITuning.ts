import { useCallback, useEffect, useMemo, useState } from 'react';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';

export interface AITuningWeights {
  regionMatch: number;
  goalAlignment: number;
  cvSkillsMatch: number;
}

const DEFAULT_WEIGHTS: AITuningWeights = {
  regionMatch: 0.6,
  goalAlignment: 0.8,
  cvSkillsMatch: 0.7
};

interface AITuningState {
  weights: AITuningWeights;
  loading: boolean;
  error: string | null;
}

const clampWeight = (value: number) => {
  if (!Number.isFinite(value)) {
    return 0;
  }
  if (value < 0) {
    return 0;
  }
  if (value > 1) {
    return 1;
  }
  return Number(Number(value).toFixed(2));
};

const ensureDb = () => {
  if (!db) {
    throw new Error('Firestore is not initialised. Check Firebase configuration.');
  }
  return db;
};

const withDefaultWeights = (payload: Partial<AITuningWeights>): AITuningWeights => ({
  regionMatch: clampWeight(payload.regionMatch ?? DEFAULT_WEIGHTS.regionMatch),
  goalAlignment: clampWeight(payload.goalAlignment ?? DEFAULT_WEIGHTS.goalAlignment),
  cvSkillsMatch: clampWeight(payload.cvSkillsMatch ?? DEFAULT_WEIGHTS.cvSkillsMatch)
});

export function useAITuning() {
  const [state, setState] = useState<AITuningState>({
    weights: DEFAULT_WEIGHTS,
    loading: true,
    error: null
  });

  const loadWeights = useCallback(async () => {
    try {
      const database = ensureDb();
      setState((previous) => ({ ...previous, loading: true, error: null }));

      const snapshot = await getDoc(doc(database, 'ai_tuning', 'weights'));
      if (!snapshot.exists()) {
        setState({
          weights: DEFAULT_WEIGHTS,
          loading: false,
          error: null
        });
        return DEFAULT_WEIGHTS;
      }

      const data = snapshot.data() as Record<string, unknown>;
      const weights = withDefaultWeights({
        regionMatch: typeof data.regionMatch === 'number' ? data.regionMatch : undefined,
        goalAlignment: typeof data.goalAlignment === 'number' ? data.goalAlignment : undefined,
        cvSkillsMatch: typeof data.cvSkillsMatch === 'number' ? data.cvSkillsMatch : undefined
      });

      setState({
        weights,
        loading: false,
        error: null
      });
      return weights;
    } catch (error) {
      console.error('Failed to load AI tuning weights', error);
      const message = error instanceof Error ? error.message : 'Unable to load AI tuning weights.';
      setState((previous) => ({
        ...previous,
        loading: false,
        error: message
      }));
      throw error instanceof Error ? error : new Error(message);
    }
  }, []);

  const saveWeights = useCallback(
    async (weights: AITuningWeights) => {
      try {
        const database = ensureDb();
        const nextWeights = withDefaultWeights(weights);
        setState((previous) => ({
          ...previous,
          loading: true,
          error: null
        }));

        await setDoc(
          doc(database, 'ai_tuning', 'weights'),
          {
            ...nextWeights,
            updatedAt: serverTimestamp()
          },
          { merge: true }
        );

        setState({
          weights: nextWeights,
          loading: false,
          error: null
        });
        return nextWeights;
      } catch (error) {
        console.error('Failed to save AI tuning weights', error);
        const message = error instanceof Error ? error.message : 'Unable to save AI tuning weights.';
        setState((previous) => ({
          ...previous,
          loading: false,
          error: message
        }));
        throw error instanceof Error ? error : new Error(message);
      }
    },
    []
  );

  const resetWeights = useCallback(async () => {
    return saveWeights(DEFAULT_WEIGHTS);
  }, [saveWeights]);

  useEffect(() => {
    void loadWeights();
  }, [loadWeights]);

  const latestWeights = useMemo(() => state.weights, [state.weights]);

  return {
    weights: latestWeights,
    loading: state.loading,
    error: state.error,
    refresh: loadWeights,
    saveWeights,
    resetWeights
  };
}

export default useAITuning;
