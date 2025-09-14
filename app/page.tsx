"use client"

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

type PuzzleState = (number | null)[];

const SOLVED_STATE: PuzzleState = [1, 2, 3, 4, 5, 6, 7, 8, null];

export default function PuzzleGame() {
  const [puzzle, setPuzzle] = useState<PuzzleState>([1, 2, 3, 4, 5, 6, 7, 8, null]);
  const [isWon, setIsWon] = useState(false);
  const [inputValue, setInputValue] = useState('1,2,3,4,5,6,8,7,');
  const [isSolving, setIsSolving] = useState(false);

  const getEmptyIndex = (state: PuzzleState): number => {
    return state.findIndex(tile => tile === null);
  };

  const canMove = (index: number, emptyIndex: number): boolean => {
    const row = Math.floor(index / 3);
    const col = index % 3;
    const emptyRow = Math.floor(emptyIndex / 3);
    const emptyCol = emptyIndex % 3;

    return (
      (Math.abs(row - emptyRow) === 1 && col === emptyCol) ||
      (Math.abs(col - emptyCol) === 1 && row === emptyRow)
    );
  };

  const moveTile = (index: number) => {
    if (isSolving) return;
    
    const emptyIndex = getEmptyIndex(puzzle);
    if (canMove(index, emptyIndex)) {
      const newPuzzle = [...puzzle];
      [newPuzzle[index], newPuzzle[emptyIndex]] = [newPuzzle[emptyIndex], newPuzzle[index]];
      setPuzzle(newPuzzle);
    }
  };

  const shuffle = () => {
    if (isSolving) return;
    
    const newPuzzle = [...puzzle];
    for (let i = 0; i < 1000; i++) {
      const emptyIndex = getEmptyIndex(newPuzzle);
      const possibleMoves = [];
      
      for (let j = 0; j < 9; j++) {
        if (canMove(j, emptyIndex)) {
          possibleMoves.push(j);
        }
      }
      
      const randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
      [newPuzzle[randomMove], newPuzzle[emptyIndex]] = [newPuzzle[emptyIndex], newPuzzle[randomMove]];
    }
    setPuzzle(newPuzzle);
    setIsWon(false);
  };

  const isSolved = (state: PuzzleState): boolean => {
    return JSON.stringify(state) === JSON.stringify(SOLVED_STATE);
  };

  const solve = () => {
  };

  const handleInputSubmit = () => {
    try {
      const values = inputValue.split(',').map(v => v.trim() === '' ? null : parseInt(v.trim()));
      if (values.length === 9) {
        const numbers = values.filter(v => v !== null) as number[];
        const hasValidNumbers = numbers.length === 8 && 
          numbers.every(n => n >= 1 && n <= 8) &&
          new Set(numbers).size === 8;
        
        if (hasValidNumbers) {
          setPuzzle(values);
          setIsWon(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setIsWon(isSolved(puzzle));
  }, [puzzle]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-800">8puzzle visualizer</CardTitle>
          {isWon && (
            <div className="text-green-600 font-semibold animate-pulse">
               Solved state
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Puzzle Grid */}
          <div className="grid grid-cols-3 gap-2 w-full max-w-xs mx-auto">
            {puzzle.map((tile, index) => (
              <button
                key={index}
                onClick={() => moveTile(index)}
                disabled={tile === null || isSolving}
                className={cn(
                  "h-16 w-16 text-xl font-bold rounded-lg transition-all duration-200",
                  tile === null
                    ? "bg-gray-200 cursor-default"
                    : "bg-white border-2 border-blue-200 hover:border-blue-400 hover:shadow-md active:scale-95",
                  canMove(index, getEmptyIndex(puzzle)) && tile !== null && !isSolving
                    ? "cursor-pointer"
                    : "cursor-default"
                )}
              >
                {tile}
              </button>
            ))}
          </div>

          {/* Control Buttons */}
          <div className="flex gap-2 justify-center">
            <Button 
              onClick={shuffle} 
              disabled={isSolving}
              variant="outline"
              className="flex-1"
            >
              Shuffle
            </Button>
            <Button 
              onClick={solve} 
              disabled={false}
              className="flex-1"
            >
              Solve
            </Button>
          </div>

          {/* Custom Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Custom Puzzle (use numbers 1-8 and leave empty space as blank):
            </label>
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="1,2,3,4,5,6,7,8,"
                className="flex-1"
                disabled={isSolving}
              />
              <Button 
                onClick={handleInputSubmit}
                variant="outline"
                size="sm"
                disabled={isSolving}
              >
                Set
              </Button>
            </div>
            <p className="text-xs text-gray-500">
              Example: "1,2,3,4,5,,7,8,6"
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}