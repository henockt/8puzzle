#include <iostream>
#include <array>
#include <queue>
#include <algorithm>

#include <emscripten/bind.h>

#include "Board.h"
#include "Node.h"

using namespace emscripten;

// A* search
std::vector<Board> Board::solve() {
    if (!isSolvable() || !isValid()) {
        return {};
    }

    if (isSolved()) {
        return {*this};
    }

    // min PQ
    std::priority_queue<Node*, std::vector<Node*>, Compare> pq;
    std::queue<Node*> nodes;
    Node* n = new Node(*this, 0, nullptr);
    pq.push(n);
    nodes.push(n);

    while (!pq.top()->board.isSolved()) {
        Node* curr = pq.top();
        pq.pop();

        for (Board& b : curr->board.getNeighbours()) {
            if (curr->prev == nullptr || curr->prev->board != b) {
                n = new Node(b, curr->moves + 1, curr);
                pq.push(n);
                nodes.push(n);
            }
        }
    }

    // reconstruct solution
    std::vector<Board> solution;
    const Node* end = pq.top();
    while (end != nullptr) {
        solution.push_back(end->board);
        end = end->prev;
    }
    std::reverse(solution.begin(), solution.end());

    // free memory
    while (!nodes.empty()) {
        n = nodes.front();
        nodes.pop();
        delete n;
    }

    return solution;
};

std::vector<std::string> Board::solveString() {
    std::vector<Board> solution = this->solve();
    std::vector<std::string> ans;
    for (Board& b : solution) {
        ans.push_back(b.toString());
    }
    return ans;
};

// Bind the class
EMSCRIPTEN_BINDINGS(board_module) {
    register_vector<int>("VectorInt");
    register_vector<std::vector<int>>("VectorVectorInt");
    register_vector<std::string>("VectorString");

    class_<Board>("Board")
        .constructor<std::vector<std::vector<int>>>()
        .function("isValid", &Board::isValid)
        .function("isSolvable", &Board::isSolvable)
        .function("solve", &Board::solve)
        .function("toString", &Board::toString)
        .function("solveString", &Board::solveString);
}

/**
 *  Test client
*/

// int main() {
//     // std::vector<std::vector<int>> puzzle {{{8, 1, 3}, {4, 0, 2}, {7, 6, 5}}};
//     std::vector<std::vector<int>> puzzle {{0, 1, 3}, {4, 2, 5}, {7, 8, 6}};

//     Board b(puzzle);
//     std::cout << "Manhattan Distance: " << b.manhattan() << std::endl;
//     std::cout << "Puzzle: " << std::endl;
//     std::cout << b << std::endl;
//     std::cout << "isSolvable: " << b.isSolvable() << std::endl;
    
//     auto ans = b.solve();
//     for (auto& n : ans) {
//         std::cout << n << std::endl;
//     }
//     std::cout << "Moves: " << (int) ans.size() - 1 << std::endl;

//     return 0;
// }
