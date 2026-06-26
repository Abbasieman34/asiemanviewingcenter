import DateTimeDisplay from "@/components/DateTimeDisplay";
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
          alt={`Movie poster for ${movie.title}`}
          loading="lazy"
          decoding="async"
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
        <DateTimeDisplay date={movie.date} time={movie.time} />
      </div>
    </div>
  );
};

export default MovieCard;
