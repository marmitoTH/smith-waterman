const fs = require("fs");
const readline = require("readline-sync");

const Cell = require("./Cell");

const path = process.argv[2];

const file = fs.readFileSync(path, "utf-8");
const input = file.replace(/.+:\s?/gm, "").split("\n");

const columns = [...input[0]];
const rows = [...input[1]];

const match = parseInt(readline.question("match: "));
const mismatch = parseInt(readline.question("mismatch: "));
const gap = parseInt(readline.question("gap: "));

const table = [];

rows.unshift("U");
columns.unshift("-", "U");

table.push(columns);

rows.forEach((value) => {
  const newLine = new Array(columns.length).fill(0);
  newLine[0] = value;
  table.push(newLine);
});

table[1].forEach((_, index) => {
  if (index > 1) {
    table[1][index] = table[1][index - 1] + gap;
  }
});

table.forEach((row, index) => {
  if (index > 1) {
    row[1] = table[index - 1][1] + gap;
  }
});

for (let i = 2; i < rows.length + 1; i++) {
  for (let j = 2; j < columns.length; j++) {
    const rowKey = table[i][0];
    const columnKey = table[0][j];

    const top = table[i][j - 1] + gap;
    const left = table[i - 1][j] + gap;

    const diagonal = (() => {
      const value = table[i - 1][j - 1];
      return rowKey === columnKey ? value + match : value + mismatch;
    })();

    table[i][j] = (() => {
      if (diagonal > top) {
        if (diagonal > left) {
          return new Cell(
            rowKey,
            columnKey,
            diagonal,
            "diagonal",
            table[i - 1][j - 1]
          );
        } else {
          return new Cell(rowKey, columnKey, left, "left", table[i - 1][j]);
        }
      } else {
        if (top > left) {
          return new Cell(rowKey, columnKey, top, "top", table[i][j - 1]);
        } else {
          return new Cell(rowKey, columnKey, left, "left", table[i - 1][j]);
        }
      }
    })();
  }
}

const greaterCell = (() => {
  let greater = null;

  table[table.length - 1].forEach((cell, index) => {
    if (index > 1) {
      greater = greater === null || greater < cell ? cell : greater;
    }
  });

  return greater;
})();

const backtrace = (() => {
  let sequenceA = [];
  let sequenceB = [];
  let current = greaterCell;

  while (current instanceof Cell) {
    switch (current.direction) {
      case "diagonal":
        sequenceA.unshift(current.columnKey);
        sequenceB.unshift(current.rowKey);
        break;
      case "left":
        sequenceA.unshift("-");
        sequenceB.unshift(current.rowKey);
        break;
      case "top":
        sequenceA.unshift(current.columnKey);
        sequenceB.unshift("-");
        break;
    }

    current = current.next;
  }

  return [sequenceA, sequenceB];
})();

const output = `${backtrace[0].join(";")}\n${backtrace[1].join(";")}\nScore = ${
  greaterCell.score
}`;

fs.writeFile("output.txt", output, () => {});
