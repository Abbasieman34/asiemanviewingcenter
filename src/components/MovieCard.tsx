import { Calendar, Clock } from "lucide-react";
import type { Movie } from "@/lib/store";

interface MovieCardProps {
  movie: Movie;
}

const MovieCard = ({ movie }: MovieCardProps) => {
  return (
    <div className="bg-card rounded-xl overflow-hidden border border-border card-hover">
      <div className="aspect-[2/3] overflow-hidden">
        <img
          src={movie.image}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4 space-y-2">
        <h3 className="text-xl text-primary truncate">{movie.title}</h3>
        {movie.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {movie.description}
          </p>
        )}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5 text-primary" />
            {movie.date}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5 text-primary" />
            {movie.time}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
