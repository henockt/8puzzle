import path from "path";
import initBoardModule from "../../board/build/board.js";

const BoardModule = await initBoardModule({
  locateFile: (file) => path.join(process.cwd(), "board/build", file)
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const puzzleQuery = searchParams.get("puzzle");
  const solvableQuery = searchParams.get("can");

  if (!puzzleQuery) {
    return Response.json({ error: "no puzzle param" }, { status: 400 });
  }
  const puzzle = puzzleQuery.split(",").map(v => v.trim() === "" ? null : parseInt(v.trim()));

  // construct board
  const row1 = new BoardModule.VectorInt();
  for (let i = 0; i < 3; ++i) {
    row1.push_back(puzzle[i] ? puzzle[i] : 0);
  }
  const row2 = new BoardModule.VectorInt();
  for (let i = 3; i < 6; ++i) {
    row2.push_back(puzzle[i] ? puzzle[i] : 0);
  }
  const row3 = new BoardModule.VectorInt();
  for (let i = 6; i < 9; ++i) {
    row3.push_back(puzzle[i] ? puzzle[i] : 0);
  }
  const grid = new BoardModule.VectorVectorInt();
  grid.push_back(row1); grid.push_back(row2); grid.push_back(row3);

  const board = new BoardModule.Board(grid);

  if (!board.isValid()) {
    return Response.json({ error: "invalid puzzle config" }, { status: 400 });
  }

  if (solvableQuery === "true") {
    return Response.json({ isSolvable: board.isSolvable() });
  }

  if (!board.isSolvable()) {
    return Response.json({ moves: -1, error: "no solution exists" });
  }

  const solution = board.solveString();
  const jsSoln = Array.from({ length: solution.size() }, (_, i) => solution.get(i));
  return Response.json({ moves: solution.size() - 1, solution: jsSoln });
}