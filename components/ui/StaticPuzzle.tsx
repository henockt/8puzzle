import { cn } from "@/lib/utils";
import { CardContent } from "./card";

type PuzzleState = (number | null)[];

type StaticPuzzleProps = {
  puzzle: PuzzleState;
};

export default function StaticPuzzle({ puzzle }: StaticPuzzleProps) {
  return (
    // <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">    
        <CardContent className="p-7">
            <div className="grid grid-cols-3 gap-2 w-full max-w-xs mx-auto">
                {puzzle.map((tile, index) => (
                    <button
                    key={index}
                    className={cn(
                        "h-16 w-16 text-xl font-bold rounded-lg transition-all duration-200",
                        tile === null
                        ? "bg-gray-200 cursor-default"
                        : "bg-white border-2 border-blue-200 hover:border-blue-400 hover:shadow-md active:scale-95"
                    )}
                    >
                    {tile}
                    </button>
                ))}
            </div>
        </CardContent>
    // </div>
  );
}