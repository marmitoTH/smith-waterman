class Cell {
  /**
   * @param {string} rowKey
   * @param {string} columnKey
   * @param {number} score
   * @param {"diagonal"|"left"|"top"} direction
   * @param {Cell} next
   */
  constructor(rowKey, columnKey, score, direction, next) {
    this.rowKey = rowKey;
    this.columnKey = columnKey;
    this.score = score;
    this.direction = direction;
    this.next = next;
  }

  toString() {
    return this.score;
  }
}

module.exports = Cell;
