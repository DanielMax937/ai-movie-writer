import { useCallback, useEffect, useRef } from 'react';
import { useWritersRoom } from '@/lib/store';
import {
  generateCharacters,
  planNextScene,
  generateDialogueLine,
  summarizeScene,
  determineNextSpeaker,
  shouldEndScene,
} from '@/app/actions';
import { ScriptLine, Character, ScenePlan } from '@/types/script';

export function useWritersRoomOrchestrator() {
  const store = useWritersRoom();
  const isRunningRef = useRef(false);
  const shouldStopRef = useRef(false);

  /**
   * Initialize the writers' room with character generation
   */
  const initializeRoom = useCallback(async (theme: string) => {
    if (isRunningRef.current) return;
    
    try {
      isRunningRef.current = true;
      store.setTheme(theme);
      store.setPhase('initializing');
      store.addLog({
        agent: 'system',
        message: '正在初始化编剧室...',
        type: 'info',
      });

      // Phase 1: Generate characters
      store.setPhase('casting');
      store.addLog({
        agent: 'system',
        message: '正在召集演员...',
        type: 'action',
      });

      const characters = await generateCharacters(theme);
      store.setCharacters(characters);

      store.addLog({
        agent: 'system',
        message: `已召集 ${characters.length} 位演员：${characters.map((c) => c.name).join('、')}`,
        type: 'complete',
      });

      // Add title
      const titleLine: ScriptLine = {
        type: 'header',
        content: `《${theme}》`,
      };
      store.addScriptLine(titleLine);

      isRunningRef.current = false;
      return characters;
    } catch (error) {
      console.error('Initialization error:', error);
      store.setError('初始化失败：' + (error as Error).message);
      isRunningRef.current = false;
      throw error;
    }
  }, [store]);

  /**
   * Start the automatic writing process
   */
  const startWriting = useCallback(async () => {
    if (isRunningRef.current) return;
    if (store.characters.length === 0) {
      store.setError('请先初始化角色');
      return;
    }

    isRunningRef.current = true;
    shouldStopRef.current = false;

    try {
      await runDirectorLoop();
    } catch (error) {
      console.error('Writing error:', error);
      store.setError('写作过程出错：' + (error as Error).message);
    } finally {
      isRunningRef.current = false;
    }
  }, [store]);

  /**
   * The main director loop - runs continuously until story is finished
   */
  const runDirectorLoop = async () => {
    while (!store.is_finished && !shouldStopRef.current && !store.isPaused) {
      // Step A: Scene Planning
      const scenePlan = await planScene();
      
      if (!scenePlan) break;

      // Step B: Acting Loop
      await runActingLoop(scenePlan);

      // Step C: Summarization
      await summarizeCurrentScene(scenePlan);

      // Check if story should end
      if (scenePlan.is_final_scene) {
        store.setIsFinished(true);
        store.setPhase('completed');
        store.addLog({
          agent: 'system',
          message: '剧本创作完成！',
          type: 'complete',
        });
        break;
      }

      // Move to next scene
      store.setCurrentSceneIndex(store.current_scene_index + 1);

      // Small delay between scenes
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  };

  /**
   * Plan the next scene
   */
  const planScene = async (): Promise<ScenePlan | null> => {
    try {
      store.setPhase('planning_scene');
      const sceneNumber = store.current_scene_index + 1;

      store.addLog({
        agent: 'director',
        message: `导演正在规划第 ${sceneNumber} 场戏...`,
        type: 'thinking',
      });

      const scenePlan = await planNextScene(
        store.theme,
        store.characters,
        store.scene_summaries,
        sceneNumber
      );

      store.addLog({
        agent: 'director',
        message: `第 ${sceneNumber} 场：${scenePlan.heading}`,
        type: 'complete',
      });

      // Add scene to state
      store.addScene({
        id: `scene_${sceneNumber}`,
        heading: scenePlan.heading,
        setting: scenePlan.setting,
        objective: scenePlan.objective,
        characters_present: scenePlan.characters_present,
        mood: scenePlan.mood,
      });

      // Add scene heading to script
      const sceneHeading: ScriptLine = {
        type: 'scene_heading',
        content: scenePlan.heading,
      };
      store.addScriptLine(sceneHeading);

      // Add opening action
      const openingAction: ScriptLine = {
        type: 'action',
        content: scenePlan.opening_action,
      };
      store.addScriptLine(openingAction);

      return scenePlan;
    } catch (error) {
      console.error('Scene planning error:', error);
      store.setError('场景规划失败：' + (error as Error).message);
      return null;
    }
  };

  /**
   * Run the acting loop for a scene
   */
  const runActingLoop = async (scenePlan: ScenePlan) => {
    store.setPhase('acting');
    store.addLog({
      agent: 'director',
      message: `开拍第 ${scenePlan.scene_number} 场！`,
      type: 'action',
    });

    const recentSpeakers: string[] = [];
    const recentLines: string[] = [];
    let turnCount = 0;
    const maxTurns = 12;

    while (turnCount < maxTurns && !shouldStopRef.current && !store.isPaused) {
      // Determine next speaker
      const speakerId = await determineNextSpeaker(
        store.characters,
        scenePlan,
        recentSpeakers,
        turnCount
      );

      const character = store.characters.find((c) => c.id === speakerId);
      if (!character) break;

      // Log actor thinking
      store.addLog({
        agent: 'actor',
        agent_name: character.name,
        message: `${character.name} 正在思考台词...`,
        type: 'thinking',
      });

      // Generate dialogue
      const dialogue = await generateDialogueLine(
        character,
        scenePlan,
        recentLines,
        scenePlan.objective
      );

      // Add dialogue to script
      const dialogueLine: ScriptLine = {
        type: 'dialogue',
        content: dialogue.dialogue,
        speaker: character.name,
        character_id: character.id,
      };
      store.addScriptLine(dialogueLine);

      // Update tracking
      recentSpeakers.push(speakerId);
      recentLines.push(`${character.name}: ${dialogue.dialogue}`);
      turnCount++;

      store.addLog({
        agent: 'actor',
        agent_name: character.name,
        message: `${character.name}: ${dialogue.dialogue.substring(0, 50)}${dialogue.dialogue.length > 50 ? '...' : ''}`,
        type: 'action',
      });

      // Check if scene should end (after minimum turns)
      if (turnCount >= 8) {
        const shouldEnd = await shouldEndScene(scenePlan, turnCount, recentLines);
        if (shouldEnd) {
          store.addLog({
            agent: 'director',
            message: '导演喊停！这场戏完成了。',
            type: 'action',
          });
          break;
        }
      }

      // Small delay between lines
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  };

  /**
   * Summarize the current scene
   */
  const summarizeCurrentScene = async (scenePlan: ScenePlan) => {
    try {
      store.setPhase('summarizing');
      store.addLog({
        agent: 'summarizer',
        message: `正在总结第 ${scenePlan.scene_number} 场...`,
        type: 'thinking',
      });

      // Get script lines for this scene
      const sceneStartIndex = store.script_lines.findIndex(
        (line) => line.type === 'scene_heading' && line.content === scenePlan.heading
      );
      
      const nextSceneIndex = store.script_lines.findIndex(
        (line, idx) => idx > sceneStartIndex && line.type === 'scene_heading'
      );

      const sceneLines = store.script_lines.slice(
        sceneStartIndex,
        nextSceneIndex === -1 ? undefined : nextSceneIndex
      );

      const scriptContent = sceneLines
        .map((line) => {
          if (line.type === 'dialogue') {
            return `${line.speaker}: ${line.content}`;
          }
          return line.content;
        })
        .join('\n');

      const summary = await summarizeScene(
        scenePlan.scene_number,
        scenePlan,
        [scriptContent]
      );

      store.addSceneSummary(summary);

      // Update overall summary
      const newSummary = store.summary_so_far
        ? `${store.summary_so_far}\n\n第${scenePlan.scene_number}场：${summary.summary}`
        : `第${scenePlan.scene_number}场：${summary.summary}`;
      
      store.setSummary(newSummary);

      store.addLog({
        agent: 'summarizer',
        message: `第 ${scenePlan.scene_number} 场总结完成`,
        type: 'complete',
      });
    } catch (error) {
      console.error('Summarization error:', error);
      // Non-critical, continue
    }
  };

  /**
   * Pause the writing process
   */
  const pause = useCallback(() => {
    shouldStopRef.current = true;
    store.togglePause();
    store.addLog({
      agent: 'system',
      message: '已暂停',
      type: 'info',
    });
  }, [store]);

  /**
   * Resume the writing process
   */
  const resume = useCallback(async () => {
    if (store.isPaused) {
      store.togglePause();
      store.addLog({
        agent: 'system',
        message: '继续创作...',
        type: 'info',
      });
      shouldStopRef.current = false;
      await startWriting();
    }
  }, [store, startWriting]);

  /**
   * Reset the entire room
   */
  const reset = useCallback(() => {
    shouldStopRef.current = true;
    isRunningRef.current = false;
    store.reset();
  }, [store]);

  return {
    initializeRoom,
    startWriting,
    pause,
    resume,
    reset,
    isRunning: isRunningRef.current,
  };
}
