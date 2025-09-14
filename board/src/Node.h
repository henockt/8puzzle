#ifndef NODE_H
#define NODE_H

#include <iostream>
#include "Board.h"

struct Node {
    Board board;
    int moves;
    const Node* prev;

    Node(Board board, int moves, const Node* prev) {
        this->board = board;
        this->moves = moves;
        this->prev = prev;
    }
};

struct Compare {
    // std::priority_queue is max-heap by default
    bool operator() (const Node* a, const Node* b) {
        return a->moves + a->board.manhattan() > b->moves + b->board.manhattan();
    }
};

#endif