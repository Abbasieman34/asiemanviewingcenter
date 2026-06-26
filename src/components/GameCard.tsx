import { Trophy } from "lucide-react";
import DateTimeDisplay from "@/components/DateTimeDisplay";
import type { FootballGame } from "@/lib/store";

interface GameCardProps {
  game: FootballGame;
}

const GameCard = ({ game }: GameCardProps) => {
  return (
    <div className="bg-card rounded-xl overflow-hidden border border-border card-hover p-5 space-y-3">
      <div className="flex items-center gap-2 text-xs text-primary font-medium tracking-wider uppercase">
        <Trophy className="h-3.5 w-3.5" />
        {game.league}
      </div>
      <div className="flex items-center justify-between gap-4">
        <span className="text-2xl font-display flex-1 text-center text-foreground">{game.teamA}</span>
        <span className="text-sm font-bold text-primary gold-gradient px-3 py-1 rounded-full text-primary-foreground">VS</span>
        <span className="text-2xl font-display flex-1 text-center text-foreground">{game.teamB}</span>
      </div>
      <DateTimeDisplay date={game.date} time={game.time} className="justify-center" />
    </div>
  );
};

export default GameCard;
