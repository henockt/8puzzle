"use client"

import StaticPuzzle from "@/components/ui/StaticPuzzle"

type PuzzleState = (number | null)[];

export default function PuzzleSolve() {
    const puzzle : PuzzleState = [1, 2, 3, 4, 5, 6, 7, 8, null]; 

    return (
        <>  
            <div className="text-center p-6">
                <span className="text-lg uppercase">Minimum Moves: 2</span>
            </div>

            <div className="flex flex-wrap justify-start">
                <StaticPuzzle puzzle={[1, 2, 3, 4, null, 5, 7, 8, 6]} />

                <div className="h-64 flex items-center justify-center">
                    <span className="text-xl">→</span>
                </div>

                <StaticPuzzle puzzle={[1, 2, 3, 4, 5, null, 7, 8, 6]} />
                
                <div className="h-64 flex items-center justify-center">
                    <span className="text-xl">→</span>
                </div>
                
                <StaticPuzzle puzzle={[1, 2, 3, 4, 5, 6, 7, 8, null]} />
            </div>
        </>
    )
}