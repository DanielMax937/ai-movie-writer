import { Character } from '@/types/script';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from 'lucide-react';

interface CharacterCardProps {
  character: Character;
}

export function CharacterCard({ character }: CharacterCardProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <span>{character.name}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div>
          <p className="text-sm font-medium text-muted-foreground">背景</p>
          <p className="text-sm">{character.bio}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">性格特征</p>
          <div className="flex flex-wrap gap-1 mt-1">
            {character.personality_traits.map((trait, idx) => (
              <span
                key={idx}
                className="text-xs bg-secondary px-2 py-1 rounded-full"
              >
                {trait}
              </span>
            ))}
          </div>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">说话风格</p>
          <p className="text-sm italic">{character.speaking_style}</p>
        </div>
      </CardContent>
    </Card>
  );
}
