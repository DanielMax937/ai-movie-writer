import { create } from 'zustand';
import { StoryState, ActivityLog, OrchestratorPhase, ScriptLine } from '@/types/script';

interface WritersRoomState extends StoryState {
  // Orchestrator state
  phase: OrchestratorPhase;
  isPaused: boolean;
  error: string | null;
  
  // Activity logs for the "Behind the Scenes" panel
  activityLogs: ActivityLog[];
  
  // Actions
  setTheme: (theme: string) => void;
  setCharacters: (characters: StoryState['characters']) => void;
  addScene: (scene: StoryState['generated_scenes'][0]) => void;
  addScriptLine: (line: ScriptLine) => void;
  addScriptLines: (lines: ScriptLine[]) => void;
  addSceneSummary: (summary: StoryState['scene_summaries'][0]) => void;
  setPhase: (phase: OrchestratorPhase) => void;
  setCurrentSceneIndex: (index: number) => void;
  setIsFinished: (finished: boolean) => void;
  setSummary: (summary: string) => void;
  addLog: (log: Omit<ActivityLog, 'id' | 'timestamp'>) => void;
  togglePause: () => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState: Omit<
  WritersRoomState,
  | 'setTheme'
  | 'setCharacters'
  | 'addScene'
  | 'addScriptLine'
  | 'addScriptLines'
  | 'addSceneSummary'
  | 'setPhase'
  | 'setCurrentSceneIndex'
  | 'setIsFinished'
  | 'setSummary'
  | 'addLog'
  | 'togglePause'
  | 'setError'
  | 'reset'
> = {
  theme: '',
  characters: [],
  generated_scenes: [],
  current_scene_index: 0,
  is_finished: false,
  summary_so_far: '',
  scene_summaries: [],
  script_lines: [],
  phase: 'idle',
  isPaused: false,
  error: null,
  activityLogs: [],
};

export const useWritersRoom = create<WritersRoomState>((set) => ({
  ...initialState,

  setTheme: (theme) => set({ theme }),

  setCharacters: (characters) => set({ characters }),

  addScene: (scene) =>
    set((state) => ({
      generated_scenes: [...state.generated_scenes, scene],
    })),

  addScriptLine: (line) =>
    set((state) => ({
      script_lines: [...state.script_lines, line],
    })),

  addScriptLines: (lines) =>
    set((state) => ({
      script_lines: [...state.script_lines, ...lines],
    })),

  addSceneSummary: (summary) =>
    set((state) => ({
      scene_summaries: [...state.scene_summaries, summary],
    })),

  setPhase: (phase) => set({ phase }),

  setCurrentSceneIndex: (index) => set({ current_scene_index: index }),

  setIsFinished: (finished) => set({ is_finished: finished }),

  setSummary: (summary) => set({ summary_so_far: summary }),

  addLog: (log) =>
    set((state) => ({
      activityLogs: [
        ...state.activityLogs,
        {
          ...log,
          id: `log_${Date.now()}_${Math.random()}`,
          timestamp: new Date(),
        },
      ],
    })),

  togglePause: () =>
    set((state) => ({
      isPaused: !state.isPaused,
      phase: !state.isPaused ? 'paused' : state.phase,
    })),

  setError: (error) => set({ error, phase: error ? 'error' : 'idle' }),

  reset: () => set(initialState),
}));
