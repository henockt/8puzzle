"use client"

import StaticPuzzle from "@/components/ui/StaticPuzzle"
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";

type PuzzleState = (number | null)[];

export default function SolvePage() { 
    const [solution, setSolution] = useState<PuzzleState[]>([]);
    const [moves, setMoves] = useState<number>(-2);
    const params = useSearchParams();

    // "1,2,3" => [1,2,3]
    const getPuzzleInt = (puzzleQuery : string) => puzzleQuery.split(",").map((v: string) => v.trim() === "" ? null : parseInt(v.trim()));

    useEffect(() => {
        const puzzle = params.get("puzzle");
        axios.get(`/api?puzzle=${puzzle}`)
            .then((res) => {
                setMoves(res.data.moves);
                if (res.data.moves > 0) {
                    const soln = res.data.solution.map((p : string) => getPuzzleInt(p));
                    // temp fix for elements exceeding 9
                    setSolution(soln.map((p : number[]) => p.length == 10 ? p.slice(0, -1) : p));   
                }
            });
    }, []);

    return (
        <>  
            <div className="text-center p-6">
                <span className="text-lg uppercase">Minimum Moves: {moves === -1 ? "can't be solved from this state" : (moves === -2 ? "Loading..." : moves)}</span>
            </div>

            <div className="flex flex-wrap justify-start">
                { solution.length > 0 && solution.map((p, i) => (
                        <div key={i} className="flex flex-wrap justify-start">
                            <StaticPuzzle puzzle={p} />
                            { i !== solution.length-1 && (
                                <div className="h-64 flex items-center justify-center">
                                    <span className="text-xl">→</span>
                                </div>
                            )}
                        </div>
                    ))
                }
            </div>
        </>
    )
}