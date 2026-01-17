'use client';

import { useEffect, useRef } from 'react';
import { ScriptLine } from '@/types/script';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';

interface ScriptPanelProps {
  scriptLines: ScriptLine[];
}

export function ScriptPanel({ scriptLines }: ScriptPanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new lines are added
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [scriptLines]);

  const renderLine = (line: ScriptLine, index: number) => {
    switch (line.type) {
      case 'header':
        return (
          <div
            key={index}
            className="text-center text-2xl font-bold mb-8 mt-4"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            {line.content}
          </div>
        );

      case 'scene_heading':
        return (
          <div
            key={index}
            className="font-bold uppercase mb-4 mt-8"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            {line.content}
          </div>
        );

      case 'action':
        return (
          <div
            key={index}
            className="mb-4 leading-relaxed"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            {line.content}
          </div>
        );

      case 'dialogue':
        return (
          <div
            key={index}
            className="mb-4"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            <div className="text-center font-bold mb-1">{line.speaker}</div>
            <div className="max-w-md mx-auto text-center leading-relaxed">
              {line.content}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold">剧本</h2>
      </div>
      <ScrollArea className="flex-1 p-8" ref={scrollRef}>
        <div className="max-w-3xl mx-auto">
          {scriptLines.length === 0 ? (
            <div className="text-center text-muted-foreground py-12">
              剧本内容将在这里显示...
            </div>
          ) : (
            scriptLines.map((line, index) => renderLine(line, index))
          )}
        </div>
      </ScrollArea>
    </Card>
  );
}
