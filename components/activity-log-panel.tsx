'use client';

import { useEffect, useRef } from 'react';
import { ActivityLog } from '@/types/script';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { Film, User, FileText, BookOpen, Settings } from 'lucide-react';

interface ActivityLogPanelProps {
  logs: ActivityLog[];
}

export function ActivityLogPanel({ logs }: ActivityLogPanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new logs are added
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const getAgentIcon = (agent: ActivityLog['agent']) => {
    switch (agent) {
      case 'director':
        return <Film className="w-4 h-4" />;
      case 'actor':
        return <User className="w-4 h-4" />;
      case 'scribe':
        return <FileText className="w-4 h-4" />;
      case 'summarizer':
        return <BookOpen className="w-4 h-4" />;
      case 'system':
        return <Settings className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getAgentColor = (agent: ActivityLog['agent']) => {
    switch (agent) {
      case 'director':
        return 'text-purple-600 bg-purple-100 dark:bg-purple-900/20';
      case 'actor':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20';
      case 'scribe':
        return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      case 'summarizer':
        return 'text-orange-600 bg-orange-100 dark:bg-orange-900/20';
      case 'system':
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeStyle = (type: ActivityLog['type']) => {
    switch (type) {
      case 'thinking':
        return 'opacity-70 italic';
      case 'complete':
        return 'font-medium';
      case 'action':
        return '';
      default:
        return '';
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold">幕后花絮</h2>
        <p className="text-sm text-muted-foreground">编剧室实时动态</p>
      </div>
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        {logs.length === 0 ? (
          <div className="text-center text-muted-foreground py-12">
            等待创作开始...
          </div>
        ) : (
          <div className="space-y-3">
            {logs.map((log) => (
              <div key={log.id} className="flex gap-3 items-start">
                <div
                  className={`p-2 rounded-full flex-shrink-0 ${getAgentColor(log.agent)}`}
                >
                  {getAgentIcon(log.agent)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs font-medium text-muted-foreground">
                      {log.timestamp.toLocaleTimeString('zh-CN', {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })}
                    </span>
                    {log.agent_name && (
                      <span className="text-xs font-semibold">
                        {log.agent_name}
                      </span>
                    )}
                  </div>
                  <p className={`text-sm mt-1 ${getTypeStyle(log.type)}`}>
                    {log.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </Card>
  );
}
