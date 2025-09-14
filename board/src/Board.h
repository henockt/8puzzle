#ifndef BOARD_H
#define BOARD_H

#include <array>
#include <vector>
#include <iostream>
#include <set>

const int SIZE = 3;

class Board {
    private:
        std::vector<std::vector<int>> m_nums;
        int m_manhattanDistance; // sum of vertical & horizontal distances, used heuristic
        int m_zeroRow, m_zeroCol;
        std::set<int> m_set;

    public:
        Board(const std::vector<std::vector<int>>& init) : m_manhattanDistance(0), m_nums(SIZE, std::vector<int>(SIZE)) {
            for (int i = 0; i < SIZE; ++i) {
                for (int j = 0; j < SIZE; ++j) {
                    m_nums[i][j] = init[i][j];
                    m_set.insert(m_nums[i][j]);
                    if (m_nums[i][j] != 0) {
                        // correct index of m_nums[i][j]
                        int row = (m_nums[i][j] - 1) / SIZE, col = (m_nums[i][j] - 1) - SIZE * row;
                        m_manhattanDistance += abs(i - row) + abs(j - col);
                    } else {
                        m_zeroRow = i, m_zeroCol = j;
                    }
                }
            }
        }

        Board() : m_manhattanDistance(0) {
            m_zeroRow = m_zeroCol = SIZE - 1;
        }

        bool isValid() const {
            return m_set.size() == 9 && *m_set.begin() == 0 && *m_set.rbegin() == 8; 
        }

        const std::vector<std::vector<int>>& getNums() const {
            return m_nums;
        }

        // A* search
        std::vector<Board> solve();

        std::vector<std::string> solveString();

        // runs proportional to n^4
        bool isSolvable() {
            // solvable iff inversionCount is even
            int inversionCount = 0;

            // count the no. of inversions
            for (int i = 0; i < SIZE * SIZE; ++i) {
                for (int j = i + 1; j < SIZE * SIZE; ++j) {
                    int a1 = i / SIZE, b1 = i - SIZE * a1;
                    int a2 = j / SIZE, b2 = j - SIZE * a2;
                    if (m_nums[a1][b1] == 0 || m_nums[a2][b2] == 0) { continue; }
                    if (m_nums[a1][b1] > m_nums[a2][b2]) {
                        inversionCount += 1;
                    }
                }
            }
            return inversionCount % 2 == 0;
        }

        int manhattan() const {
            return m_manhattanDistance;
        }

        bool isSolved() const {
            return m_manhattanDistance == 0;
        }

        bool operator==(Board that) const {
            std::vector<std::vector<int>> thatNums = that.getNums();
            for (int i = 0; i < SIZE; ++i) {
                for (int j = 0; j < SIZE; ++j) {
                    if (m_nums[i][j] != thatNums[i][j]) {
                        return false;
                    }
                }
            }
            return true;
        }

        bool operator!=(Board that) const {
            return ((*this) == that) == false;
        }

        std::vector<Board> getNeighbours() {
            std::vector<Board> neighbours;
            // at most 4 neightbours from zeroRow, zeroCol
            int i = m_zeroRow, j = m_zeroCol;
            if (i - 1 >= 0) {
                std::swap(m_nums[i][j], m_nums[i - 1][j]);
                neighbours.push_back(Board(m_nums));
                std::swap(m_nums[i][j], m_nums[i - 1][j]);
            }
            if (i + 1 < SIZE) {
                std::swap(m_nums[i][j], m_nums[i + 1][j]);
                neighbours.push_back(Board(m_nums));
                std::swap(m_nums[i][j], m_nums[i + 1][j]);
            }
            if (j - 1 >= 0) {
                std::swap(m_nums[i][j], m_nums[i][j - 1]);
                neighbours.push_back(Board(m_nums));
                std::swap(m_nums[i][j], m_nums[i][j - 1]);
            }
            if (j + 1 < SIZE) {
                std::swap(m_nums[i][j], m_nums[i][j + 1]);
                neighbours.push_back(Board(m_nums));
                std::swap(m_nums[i][j], m_nums[i][j + 1]);
            }
            return neighbours;
        }

        std::string toStr() const {
            std::string str = "";
            for (int i = 0; i < SIZE; ++i) {
                for (int j = 0; j < SIZE; ++j) {
                    str += (m_nums[i][j] + '0');
                    str += " ";
                }
                str += "\n";
            }
            return str;
        }

        std::string toString() const {
            std::string str = "";
            for (int i = 0; i < SIZE; ++i) {
                for (int j = 0; j < SIZE; ++j) {
                    if (m_nums[i][j] != 0) {
                        str += (m_nums[i][j] + '0');
                    }
                    str += ",";
                }
            }
             
            // fix for two commas at end
            if (str[str.size() - 1] == str[str.size() - 2]) {
                str.pop_back();
            }
            return str;
        }
        
        friend std::ostream& operator<<(std::ostream& stream, const Board& b) {
            stream << b.toStr();
            return stream;
        };
};

#endif