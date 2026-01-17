'use server';

import { generateText } from 'ai';
import { z } from 'zod';
import { customAI, getModelName } from '@/lib/ai-provider';
import { smartGenerateObject } from '@/lib/ai-helpers';
import { Character, ScenePlan, DialogueOutput, SceneSummary } from '@/types/script';

// Schemas for structured outputs
const CharacterSchema = z.object({
  name: z.string().describe('角色名字（中文）'),
  bio: z.string().describe('角色背景故事（2-3句话）'),
  personality_traits: z.array(z.string()).describe('性格特征列表（3-4个特征）'),
  speaking_style: z.string().describe('说话风格描述'),
});

const ScenePlanSchema = z.object({
  scene_number: z.number().describe('场景编号'),
  heading: z.string().describe('场景标题，格式：内景/外景. 地点 - 时间'),
  setting: z.string().describe('场景设定的详细描述'),
  objective: z.string().describe('本场景的戏剧目标'),
  characters_present: z.array(z.string()).describe('出场角色名字列表'),
  mood: z.string().describe('场景氛围'),
  opening_action: z.string().describe('场景开场的动作描述'),
  is_final_scene: z.boolean().describe('是否为最后一场戏'),
});

/**
 * Generate characters based on the story theme
 */
export async function generateCharacters(theme: string): Promise<Character[]> {
  const schema = z.object({
    characters: z.array(CharacterSchema).length(4).describe('4个独特的角色'),
  });

  const result = await smartGenerateObject(
    schema,
    `你是一位资深的角色设计师。基于以下电影主题，创造4个独特且互补的角色。

主题：${theme}

要求：
1. 角色必须多样化且有冲突潜力
2. 每个角色都有清晰的动机和背景
3. 性格特征要具体且可执行
4. 说话风格要有辨识度
5. 所有内容必须使用中文

请创造4个角色。`,
    { temperature: 0.8 }
  );

  return result.characters.map((char, index) => ({
    id: `char_${index + 1}`,
    ...char,
  }));
}

/**
 * Plan the next scene based on story history
 */
export async function planNextScene(
  theme: string,
  characters: Character[],
  sceneSummaries: SceneSummary[],
  currentSceneNumber: number,
): Promise<ScenePlan> {
  const characterList = characters.map((c) => `- ${c.name}: ${c.bio}`).join('\n');
  const historyText = sceneSummaries.length > 0
    ? sceneSummaries.map((s) => `场景${s.scene_number}: ${s.summary}`).join('\n')
    : '这是第一场戏';

  const result = await smartGenerateObject(
    ScenePlanSchema,
    `你是一位富有远见的电影导演。你的任务是规划下一场戏的结构，而不是写对白。

电影主题：${theme}

角色列表：
${characterList}

已完成场景：
${historyText}

当前场景编号：${currentSceneNumber}

作为导演，请规划第${currentSceneNumber}场戏：
1. 确定场景的戏剧目标和冲突
2. 选择合适的角色出场
3. 设定场景氛围和地点
4. 写一个开场动作描述（但不要写对白）
5. 判断故事是否应该在这一场结束（建议5-8场戏完成整个故事）

场景标题格式示例："内景. 侦探办公室 - 夜晚"

请用中文规划这一场戏。`,
    { temperature: 0.7 }
  );

  return result;
}

/**
 * Generate a line of dialogue for a specific character
 */
export async function generateDialogueLine(
  character: Character,
  scenePlan: ScenePlan,
  recentLines: string[],
  sceneObjective: string,
): Promise<DialogueOutput> {
  const model = customAI(getModelName(), {
    temperature: 0.9,
  });

  const recentContext = recentLines.slice(-6).join('\n');

  const { text } = await generateText({
    model,
    prompt: `你是一位方法派演员，正在扮演角色：${character.name}

角色信息：
- 背景：${character.bio}
- 性格特征：${character.personality_traits.join('、')}
- 说话风格：${character.speaking_style}

当前场景：
- 地点：${scenePlan.setting}
- 氛围：${scenePlan.mood}
- 场景目标：${sceneObjective}

最近的对话：
${recentContext || '（场景刚开始）'}

作为${character.name}，你现在要说一句话。要求：
1. 完全以角色的身份说话
2. 保持角色的说话风格
3. 推动场景目标的实现
4. 台词简洁有力（1-3句话）
5. 可以包含动作描述（用括号标注）

只需要输出台词内容，不要包含角色名字。
如果需要动作，格式如：（犹豫地）我不知道该怎么办。

请用中文输出台词：`,
  });

  return {
    character_id: character.id,
    character_name: character.name,
    dialogue: text.trim(),
  };
}

/**
 * Summarize a completed scene
 */
export async function summarizeScene(
  sceneNumber: number,
  scenePlan: ScenePlan,
  scriptLines: string[],
): Promise<SceneSummary> {
  const sceneContent = scriptLines.join('\n');

  const schema = z.object({
    summary: z.string().describe('场景摘要（2-3句话）'),
    key_events: z.array(z.string()).describe('关键事件列表（3-5个要点）'),
  });

  try {
    const result = await smartGenerateObject(
      schema,
      `你是一位剧本分析师。请总结以下场景的内容。

场景编号：${sceneNumber}
场景标题：${scenePlan.heading}
场景目标：${scenePlan.objective}

场景内容：
${sceneContent}

请提供：
1. 简洁的场景摘要（2-3句话）
2. 关键事件列表（3-5个要点）

使用中文输出。`,
      { temperature: 0.5 }
    );

    return {
      scene_id: `scene_${sceneNumber}`,
      scene_number: sceneNumber,
      summary: result.summary,
      key_events: result.key_events,
    };
  } catch (error) {
    console.error('Failed to summarize scene:', error);
    // Fallback: return a basic summary
    return {
      scene_id: `scene_${sceneNumber}`,
      scene_number: sceneNumber,
      summary: `第${sceneNumber}场戏已完成`,
      key_events: ['场景已完成'],
    };
  }
}

/**
 * Determine which character should speak next
 */
export async function determineNextSpeaker(
  characters: Character[],
  scenePlan: ScenePlan,
  recentSpeakers: string[],
  turnCount: number,
): Promise<string> {
  // Simple round-robin with some randomization
  const availableCharacters = characters.filter((c) =>
    scenePlan.characters_present.includes(c.name)
  );

  if (availableCharacters.length === 0) {
    return characters[0].id;
  }

  // Avoid same character speaking twice in a row
  const lastSpeaker = recentSpeakers[recentSpeakers.length - 1];
  const otherCharacters = availableCharacters.filter((c) => c.id !== lastSpeaker);

  if (otherCharacters.length > 0 && turnCount > 0) {
    // Random selection from other characters
    return otherCharacters[Math.floor(Math.random() * otherCharacters.length)].id;
  }

  return availableCharacters[turnCount % availableCharacters.length].id;
}

/**
 * Check if the scene should end
 */
export async function shouldEndScene(
  scenePlan: ScenePlan,
  turnCount: number,
  recentLines: string[],
): Promise<boolean> {
  // End scene after 8-12 turns
  if (turnCount >= 12) return true;
  if (turnCount < 8) return false;

  const recentContent = recentLines.slice(-8).join('\n');

  const schema = z.object({
    should_end: z.boolean().describe('场景是否应该结束'),
    reason: z.string().describe('判断理由'),
  });

  try {
    const result = await smartGenerateObject(
      schema,
      `你是一位电影导演。判断当前场景是否应该结束。

场景目标：${scenePlan.objective}

最近的对话：
${recentContent}

已经进行了 ${turnCount} 轮对话。

判断标准：
1. 场景目标是否已经达成
2. 戏剧冲突是否已经展开
3. 是否有合适的结束点

请判断场景是否应该结束。`,
      { temperature: 0.3 }
    );

    return result.should_end;
  } catch (error) {
    console.error('Failed to determine if scene should end:', error);
    // Fallback: end scene if we've had enough turns
    return turnCount >= 10;
  }
}
