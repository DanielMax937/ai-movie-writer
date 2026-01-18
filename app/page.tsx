'use client';

import { useState, useEffect } from 'react';
import { useWritersRoom } from '@/lib/store';
import { useWritersRoomOrchestrator } from '@/hooks/useWritersRoomOrchestrator';
import { useLoadingState } from '@/hooks/useLoadingState';
import { useSafeTimeout } from '@/hooks/useSafeTimers';
import { validateTheme } from '@/lib/validation';
import { scriptInitLimiter, exportLimiter, startRateLimiterCleanup } from '@/lib/rate-limiter';
import { CharacterCard } from '@/components/character-card';
import { ScriptPanel } from '@/components/script-panel';
import { ActivityLogPanel } from '@/components/activity-log-panel';
import { LoadingSpinner, InlineLoader } from '@/components/loading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { exportAsText, copyToClipboard } from '@/lib/export';
import {
  Play,
  Pause,
  RotateCcw,
  Download,
  Copy,
  Loader2,
  Users,
  AlertCircle,
} from 'lucide-react';

export default function HomePage() {
  const [theme, setTheme] = useState('');
  const [themeError, setThemeError] = useState<string>();
  const [showCharacters, setShowCharacters] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const store = useWritersRoom();
  const orchestrator = useWritersRoomOrchestrator();
  const initLoading = useLoadingState();
  const copyLoading = useLoadingState();
  const exportLoading = useLoadingState();
  const { setTimeout: safeSetTimeout } = useSafeTimeout();

  // Start rate limiter cleanup
  useEffect(() => {
    const cleanup = startRateLimiterCleanup();
    return cleanup;
  }, []);

  const handleThemeChange = (value: string) => {
    setTheme(value);
    // Clear error when user types
    if (themeError) {
      setThemeError(undefined);
    }
  };

  const handleStart = async () => {
    // Validate theme
    const validation = validateTheme(theme);
    if (!validation.isValid) {
      setThemeError(validation.error);
      return;
    }

    // Check rate limit
    const rateLimitResult = scriptInitLimiter.tryConsume();
    if (!rateLimitResult.allowed) {
      const waitSeconds = Math.ceil((rateLimitResult.retryAfter || 0) / 1000);
      setThemeError(`请求过于频繁，请等待 ${waitSeconds} 秒后重试`);
      return;
    }

    // Use sanitized value
    const sanitizedTheme = validation.sanitized!;

    await initLoading.withLoading(async () => {
      try {
        // Initialize with characters
        initLoading.setMessage('正在生成角色...');
        await orchestrator.initializeRoom(sanitizedTheme);
        setShowCharacters(true);

        // Small delay to show characters, then start writing
        initLoading.setMessage('准备开始创作...');
        safeSetTimeout(() => {
          setShowCharacters(false);
          // Start writing (don't await here, let it run async)
          orchestrator.startWriting().catch(err => {
            console.error('Writing error:', err);
            initLoading.setError('创作过程出错：' + err.message);
          });
        }, 3000);
      } catch (error) {
        console.error('Start error:', error);
        throw error;
      }
    }, '正在初始化...');
  };

  const handleExportText = async () => {
    // Check rate limit
    const rateLimitResult = exportLimiter.tryConsume();
    if (!rateLimitResult.allowed) {
      exportLoading.setError('操作过于频繁，请稍后再试');
      return;
    }

    await exportLoading.withLoading(async () => {
      exportAsText(store.script_lines, `${store.theme || '剧本'}.txt`);
      // Small delay to show feedback
      await new Promise(resolve => setTimeout(resolve, 500));
    }, '正在导出...');
  };

  const handleCopy = async () => {
    // Check rate limit
    const rateLimitResult = exportLimiter.tryConsume();
    if (!rateLimitResult.allowed) {
      copyLoading.setError('操作过于频繁，请稍后再试');
      return;
    }

    await copyLoading.withLoading(async () => {
      const success = await copyToClipboard(store.script_lines);
      if (success) {
        setCopySuccess(true);
        safeSetTimeout(() => setCopySuccess(false), 2000);
      } else {
        throw new Error('复制失败');
      }
    }, '正在复制...');
  };

  const isIdle = store.phase === 'idle';
  const isInitializing = store.phase === 'initializing' || store.phase === 'casting';
  const isWriting =
    store.phase === 'planning_scene' ||
    store.phase === 'acting' ||
    store.phase === 'summarizing';
  const isCompleted = store.phase === 'completed';
  const isPaused = store.isPaused;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                AI 编剧室
              </h1>
              <p className="text-sm text-muted-foreground">
                虚拟编剧团队 · 多智能体协作创作
              </p>
            </div>

            {/* Control Buttons */}
            <div className="flex items-center gap-2">
              {store.characters.length > 0 && (
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Users className="w-4 h-4 mr-2" />
                      角色列表
                    </Button>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>角色列表</SheetTitle>
                      <SheetDescription>
                        本剧的主要角色
                      </SheetDescription>
                    </SheetHeader>
                    <div className="mt-6 space-y-4">
                      {store.characters.map((char) => (
                        <CharacterCard key={char.id} character={char} />
                      ))}
                    </div>
                  </SheetContent>
                </Sheet>
              )}

              {!isIdle && !isInitializing && (
                <>
                  {!isPaused && !isCompleted && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={orchestrator.pause}
                    >
                      <Pause className="w-4 h-4 mr-2" />
                      暂停
                    </Button>
                  )}

                  {isPaused && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={orchestrator.resume}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      继续
                    </Button>
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopy}
                    disabled={store.script_lines.length === 0 || copyLoading.isLoading}
                  >
                    {copyLoading.isLoading ? (
                      <InlineLoader className="mr-2" />
                    ) : (
                      <Copy className="w-4 h-4 mr-2" />
                    )}
                    {copySuccess ? '已复制！' : '复制'}
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleExportText}
                    disabled={store.script_lines.length === 0 || exportLoading.isLoading}
                  >
                    {exportLoading.isLoading ? (
                      <InlineLoader className="mr-2" />
                    ) : (
                      <Download className="w-4 h-4 mr-2" />
                    )}
                    导出文本
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={orchestrator.reset}
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    重新开始
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Initialization Phase */}
        {isIdle && (
          <Card className="max-w-2xl mx-auto p-8">
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">开始创作你的电影剧本</h2>
                <p className="text-muted-foreground">
                  输入一个电影主题，AI 编剧团队将为你创作完整的剧本
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    电影主题
                  </label>
                  <Input
                    placeholder="例如：一个赛博侦探追捕失控的仿生人"
                    value={theme}
                    onChange={(e) => handleThemeChange(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && theme.trim()) {
                        handleStart();
                      }
                    }}
                    className="text-lg"
                    aria-invalid={!!themeError}
                    aria-describedby={themeError ? 'theme-error' : undefined}
                  />
                  {themeError && (
                    <p id="theme-error" className="text-sm text-destructive mt-2 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {themeError}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-2">
                    5-200 个字符，至少包含 2 个词
                  </p>
                </div>

                <Button
                  onClick={handleStart}
                  disabled={!theme.trim() || initLoading.isLoading || isInitializing}
                  className="w-full"
                  size="lg"
                >
                  {initLoading.isLoading || isInitializing ? (
                    <>
                      <InlineLoader className="mr-2" />
                      {initLoading.message || '正在初始化...'}
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      开始创作
                    </>
                  )}
                </Button>

                {/* Error Display */}
                {initLoading.error && (
                  <div className="flex items-start gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm">
                    <AlertCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-destructive">初始化失败</p>
                      <p className="text-destructive/80 mt-1">{initLoading.error}</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => initLoading.clearError()}
                        className="mt-2"
                      >
                        重试
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <h3 className="font-medium mb-2">如何使用：</h3>
                <ol className="text-sm space-y-1 list-decimal list-inside text-muted-foreground">
                  <li>输入你的电影主题或故事概念</li>
                  <li>AI 会自动生成 4 个独特的角色</li>
                  <li>多个 AI 智能体将协作创作完整剧本</li>
                  <li>实时观看创作过程，支持暂停和导出</li>
                </ol>
              </div>
            </div>
          </Card>
        )}

        {/* Character Display Phase */}
        {showCharacters && store.characters.length > 0 && (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">角色介绍</h2>
              <p className="text-muted-foreground">
                AI 为《{store.theme}》创造了以下角色
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {store.characters.map((char) => (
                <CharacterCard key={char.id} character={char} />
              ))}
            </div>
            <div className="text-center mt-6">
              <LoadingSpinner 
                size="lg" 
                text="准备开始创作..." 
                details="正在初始化编剧团队..."
              />
            </div>
          </div>
        )}

        {/* Writing Phase - Split Screen */}
        {!isIdle && !showCharacters && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-12rem)]">
            {/* Left Panel - Script */}
            <div className="lg:col-span-2">
              <ScriptPanel scriptLines={store.script_lines} />
            </div>

            {/* Right Panel - Activity Log */}
            <div className="lg:col-span-1">
              <ActivityLogPanel logs={store.activityLogs} />
            </div>
          </div>
        )}

        {/* Status Bar */}
        {!isIdle && !showCharacters && (
          <div className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border-t p-4">
            <div className="container mx-auto flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  {isWriting && (
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  )}
                  <span className="text-sm font-medium">
                    {store.phase === 'planning_scene' && '导演正在规划场景...'}
                    {store.phase === 'acting' && '演员们正在表演...'}
                    {store.phase === 'summarizing' && '正在总结场景...'}
                    {store.phase === 'completed' && '✓ 剧本创作完成'}
                    {store.phase === 'paused' && '⏸ 已暂停'}
                  </span>
                </div>

                <div className="text-sm text-muted-foreground">
                  场景 {store.current_scene_index + 1} · {store.script_lines.length} 行
                </div>
              </div>

              {isCompleted && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                    🎬 剧本创作完成！
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
