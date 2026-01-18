import { useCallback, useRef } from 'react';
import { useWritersRoom } from '@/lib/store';
import {
  generateCharacters,
  planNextScene,
  generateDialogueLine,
  summarizeScene,
  determineNextSpeaker,
  shouldEndScene,
} from '@/app/actions';
import { ScenePlan, ScriptLine } from '@/types/script';

export function useWritersRoomOrchestrator() {
  const isRunningRef = useRef(false);
  const shouldStopRef = useRef(false);

  /**
   * Initialize the writers' room with character generation
   */
  const initializeRoom = useCallback(async (theme: string) => {
    if (isRunningRef.current) return;
    
    try {
      isRunningRef.current = true;
      const currentStore = useWritersRoom.getState();
      
      currentStore.setTheme(theme);
      currentStore.setPhase('initializing');
      currentStore.addLog({
        agent: 'system',
        message: '正在初始化编剧室...',
        type: 'info',
      });

      // Phase 1: Generate characters
      currentStore.setPhase('casting');
      currentStore.addLog({
        agent: 'system',
        message: '正在召集演员...',
        type: 'action',
      });

      const characters = await generateCharacters(theme);
      useWritersRoom.getState().setCharacters(characters);

      useWritersRoom.getState().addLog({
        agent: 'system',
        message: `已召集 ${characters.length} 位演员：${characters.map((c) => c.name).join('、')}`,
        type: 'complete',
      });

      // Add title
      const titleLine: ScriptLine = {
        type: 'header',
        content: `《${theme}》`,
      };
      useWritersRoom.getState().addScriptLine(titleLine);

      isRunningRef.current = false;
      return characters;
    } catch (error) {
      console.error('Initialization error:', error);
      const currentStore = useWritersRoom.getState();
      currentStore.setError('初始化失败：' + (error as Error).message);
      isRunningRef.current = false;
      throw error;
    }
  }, []); // Remove store from dependencies

  /**
   * Start the automatic writing process
   */
  const startWriting = useCallback(async () => {
    if (isRunningRef.current) return;
    
    const currentStore = useWritersRoom.getState();
    if (currentStore.characters.length === 0) {
      currentStore.setError('请先初始化角色');
      return;
    }

    isRunningRef.current = true;
    shouldStopRef.current = false;

    const runDirectorLoop = async () => {
      // Always get fresh state by calling useWritersRoom.getState()
      const getState = () => useWritersRoom.getState();
      
      while (!getState().is_finished && !shouldStopRef.current && !getState().isPaused) {
        // Step A: Scene Planning
        const scenePlan = await planScene();
        
        if (!scenePlan) break;

        // Step B: Acting Loop
        await runActingLoop(scenePlan);

        // Step C: Summarization
        await summarizeCurrentScene(scenePlan);

        // Check if story should end
        if (scenePlan.is_final_scene) {
          getState().setIsFinished(true);
          getState().setPhase('completed');
          getState().addLog({
            agent: 'system',
            message: '剧本创作完成！',
            type: 'complete',
          });
          break;
        }

        // Move to next scene
        const currentState = getState();
        currentState.setCurrentSceneIndex(currentState.current_scene_index + 1);

        // Small delay between scenes
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    };

    try {
      await runDirectorLoop();
    } catch (error) {
      console.error('Writing error:', error);
      useWritersRoom.getState().setError('写作过程出错：' + (error as Error).message);
    } finally {
      isRunningRef.current = false;
    }
  }, []); // Remove store from dependencies

  /**
   * Plan the next scene
   */
  const planScene = async (): Promise<ScenePlan | null> => {
    try {
      const currentStore = useWritersRoom.getState();
      currentStore.setPhase('planning_scene');
      const sceneNumber = currentStore.current_scene_index + 1;

      currentStore.addLog({
        agent: 'director',
        message: `导演正在规划第 ${sceneNumber} 场戏...`,
        type: 'thinking',
      });

      const scenePlan = await planNextScene(
        currentStore.theme,
        currentStore.characters,
        currentStore.scene_summaries,
        sceneNumber
      );

      currentStore.addLog({
        agent: 'director',
        message: `第 ${sceneNumber} 场：${scenePlan.heading}`,
        type: 'complete',
      });

      // Add scene to state
      currentStore.addScene({
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
      currentStore.addScriptLine(sceneHeading);

      // Add opening action
      const openingAction: ScriptLine = {
        type: 'action',
        content: scenePlan.opening_action,
      };
      currentStore.addScriptLine(openingAction);

      return scenePlan;
    } catch (error) {
      console.error('Scene planning error:', error);
      const currentStore = useWritersRoom.getState();
      currentStore.setError('场景规划失败：' + (error as Error).message);
      return null;
    }
  };

  /**
   * Run the acting loop for a scene
   */
  const runActingLoop = async (scenePlan: ScenePlan) => {
    const currentStore = useWritersRoom.getState();
    currentStore.setPhase('acting');
    currentStore.addLog({
      agent: 'director',
      message: `开拍第 ${scenePlan.scene_number} 场！`,
      type: 'action',
    });

    const recentSpeakers: string[] = [];
    const recentLines: string[] = [];
    let turnCount = 0;
    const maxTurns = 12;

    while (turnCount < maxTurns && !shouldStopRef.current && !useWritersRoom.getState().isPaused) {
      const freshStore = useWritersRoom.getState();
      
      // Determine next speaker
      const speakerId = await determineNextSpeaker(
        freshStore.characters,
        scenePlan,
        recentSpeakers,
        turnCount
      );

      const character = freshStore.characters.find((c) => c.id === speakerId);
      if (!character) break;

      // Log actor thinking
      freshStore.addLog({
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
      useWritersRoom.getState().addScriptLine(dialogueLine);

      // Update tracking
      recentSpeakers.push(speakerId);
      recentLines.push(`${character.name}: ${dialogue.dialogue}`);
      turnCount++;

      useWritersRoom.getState().addLog({
        agent: 'actor',
        agent_name: character.name,
        message: `${character.name}: ${dialogue.dialogue.substring(0, 50)}${dialogue.dialogue.length > 50 ? '...' : ''}`,
        type: 'action',
      });

      // Check if scene should end (after minimum turns)
      if (turnCount >= 8) {
        const shouldEnd = await shouldEndScene(scenePlan, turnCount, recentLines);
        if (shouldEnd) {
          useWritersRoom.getState().addLog({
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
      const currentStore = useWritersRoom.getState();
      currentStore.setPhase('summarizing');
      currentStore.addLog({
        agent: 'summarizer',
        message: `正在总结第 ${scenePlan.scene_number} 场...`,
        type: 'thinking',
      });

      // Get script lines for this scene
      const freshStore = useWritersRoom.getState();
      const sceneStartIndex = freshStore.script_lines.findIndex(
        (line) => line.type === 'scene_heading' && line.content === scenePlan.heading
      );
      
      const nextSceneIndex = freshStore.script_lines.findIndex(
        (line, idx) => idx > sceneStartIndex && line.type === 'scene_heading'
      );

      const sceneLines = freshStore.script_lines.slice(
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

      const finalStore = useWritersRoom.getState();
      finalStore.addSceneSummary(summary);

      // Update overall summary
      const newSummary = finalStore.summary_so_far
        ? `${finalStore.summary_so_far}\n\n第${scenePlan.scene_number}场：${summary.summary}`
        : `第${scenePlan.scene_number}场：${summary.summary}`;
      
      finalStore.setSummary(newSummary);

      finalStore.addLog({
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
    const currentStore = useWritersRoom.getState();
    currentStore.togglePause();
    currentStore.addLog({
      agent: 'system',
      message: '已暂停',
      type: 'info',
    });
  }, []);

  /**
   * Resume the writing process
   */
  const resume = useCallback(async () => {
    const currentStore = useWritersRoom.getState();
    if (currentStore.isPaused) {
      currentStore.togglePause();
      currentStore.addLog({
        agent: 'system',
        message: '继续创作...',
        type: 'info',
      });
      shouldStopRef.current = false;
      await startWriting();
    }
  }, [startWriting]);

  /**
   * Reset the entire room
   */
  const reset = useCallback(() => {
    shouldStopRef.current = true;
    isRunningRef.current = false;
    useWritersRoom.getState().reset();
  }, []);

  return {
    initializeRoom,
    startWriting,
    pause,
    resume,
    reset,
    isRunning: isRunningRef.current,
  };
}
