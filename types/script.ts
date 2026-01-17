/**
 * Character interface for AI actors in the writers' room
 */
export interface Character {
  id: string;
  name: string;
  bio: string;
  personality_traits: string[];
  speaking_style: string;
}

/**
 * Scene structure for the screenplay
 */
export interface Scene {
  id: string;
  heading: string; // e.g., "INT. DETECTIVE'S OFFICE - NIGHT"
  setting: string;
  objective: string;
  characters_present: string[]; // Character IDs
  mood: string;
}

/**
 * Individual script line (action, dialogue, or header)
 */
export interface ScriptLine {
  type: 'action' | 'dialogue' | 'header' | 'scene_heading';
  content: string;
  speaker?: string; // Character name for dialogue
  character_id?: string; // Character ID for dialogue
}

/**
 * Scene summary after completion
 */
export interface SceneSummary {
  scene_id: string;
  scene_number: number;
  summary: string;
  key_events: string[];
}

/**
 * Overall story state for the writers' room
 */
export interface StoryState {
  theme: string;
  characters: Character[];
  generated_scenes: Scene[];
  current_scene_index: number;
  is_finished: boolean;
  summary_so_far: string;
  scene_summaries: SceneSummary[];
  script_lines: ScriptLine[];
}

/**
 * Log entry for the "Behind the Scenes" panel
 */
export interface ActivityLog {
  id: string;
  timestamp: Date;
  agent: 'director' | 'actor' | 'scribe' | 'summarizer' | 'system';
  agent_name?: string; // For actor logs (character name)
  message: string;
  type: 'info' | 'action' | 'thinking' | 'complete';
}

/**
 * Orchestrator state for managing the multi-agent loop
 */
export type OrchestratorPhase = 
  | 'idle'
  | 'initializing'
  | 'casting'
  | 'planning_scene'
  | 'acting'
  | 'summarizing'
  | 'completed'
  | 'paused'
  | 'error';

/**
 * Director's scene plan output
 */
export interface ScenePlan {
  scene_number: number;
  heading: string;
  setting: string;
  objective: string;
  characters_present: string[];
  mood: string;
  opening_action: string;
  is_final_scene: boolean;
}

/**
 * Actor's dialogue output
 */
export interface DialogueOutput {
  character_id: string;
  character_name: string;
  dialogue: string;
  action?: string; // Optional action/parenthetical
}

/**
 * Export format options
 */
export type ExportFormat = 'pdf' | 'txt' | 'fountain';
