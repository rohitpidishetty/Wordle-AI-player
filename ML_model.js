// Artificially intelligent wordle player designed by Er. Rohit Acharya.
// Copy this code and open the wordle console and paste this code and then hit on enter.
// This Ai model will complete the game in no time.
// This is based on the Reinforcement Learning principle, which learns to decide the input from the given feedback from the previous output.

let res = await fetch(
  "https://raw.githubusercontent.com/rohitpidishetty/API/main/Data.json"
);
var wordList = await res.json();
wordList = await wordList.words;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
function alphabet(discard) {
  var alphabets = [
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
  ];
  alpha = alphabets[Math.floor(Math.random() * alphabets.length - 1)];
  var score = 0;
  discard.forEach((letter) => {
    if (alpha !== letter) {
      score++;
    }
  });
  if (score === discard.length) {
    return alpha;
  } else {
    return alphabet(discard);
  }
}
function remove(array, n) {
  const index = array.indexOf(n);
  if (index > -1) {
    array.splice(index, 1);
  }
  return array;
}

var keyPress = [
  (q = { row: 1, col: 1 }),
  (w = { row: 1, col: 2 }),
  (e = { row: 1, col: 3 }),
  (r = { row: 1, col: 4 }),
  (t = { row: 1, col: 5 }),
  (y = { row: 1, col: 6 }),
  (u = { row: 1, col: 7 }),
  (i = { row: 1, col: 8 }),
  (o = { row: 1, col: 9 }),
  (p = { row: 1, col: 10 }),
  (a = { row: 2, col: 2 }),
  (s = { row: 2, col: 3 }),
  (d = { row: 2, col: 4 }),
  (f = { row: 2, col: 5 }),
  (g = { row: 2, col: 6 }),
  (h = { row: 2, col: 7 }),
  (j = { row: 2, col: 8 }),
  (k = { row: 2, col: 9 }),
  (l = { row: 2, col: 10 }),
  (z = { row: 3, col: 2 }),
  (x = { row: 3, col: 3 }),
  (c = { row: 3, col: 4 }),
  (v = { row: 3, col: 5 }),
  (b = { row: 3, col: 6 }),
  (n = { row: 3, col: 7 }),
  (m = { row: 3, col: 8 }),
];

var RedundantCharacters = [];
var MandateCharacters = [];
var pos = [
  "q",
  "w",
  "e",
  "r",
  "t",
  "y",
  "u",
  "i",
  "o",
  "p",
  "a",
  "s",
  "d",
  "f",
  "g",
  "h",
  "j",
  "k",
  "l",
  "z",
  "x",
  "c",
  "v",
  "b",
  "n",
  "m",
];
var guess = "brave";
var fix = [];
var fixPosition = [];
var shift = [];
var shiftPosition = [];

async function strategyI(fix, fixPosition, FILTER1, FILTER2) {
  console.log("Strategy - 1");
  var letters = [];
  letters = [...MandateCharacters];
  var positions = [];
  positions = fixPosition;
  FILTER1.forEach((leaf) => {
    if (letters.length === 1) {
      if (leaf[positions[0]] === letters[0]) FILTER2.push(leaf);
    } else {
      var index = 0;
      var weight = 0;
      letters.forEach((letter) => {
        if (leaf[positions[index]] === letter) {
          index++;
          weight++;
        }
      });
      if (weight === letters.length) FILTER2.push(leaf);
    }
  });
  return FILTER2[0];
}
async function strategyII(shift, shiftPosition, FILTER1, FILTER2) {
  console.log("Strategy - 2");
  var sletters = [];
  sletters = shift;
  var spositions = [];
  spositions = shiftPosition;

  FILTER1.forEach((leaf) => {
    var index = 0;
    var weight = 0;
    sletters.forEach((letter) => {
      if (leaf[spositions[index]] !== letter) {
        index++;
        weight++;
      }
    });
    if (weight === sletters.length) FILTER2.push(leaf);
  });
  return FILTER2[0];
}

async function strategyIII(
  shift,
  shiftPosition,
  fix,
  fixPosition,
  FILTER1,
  FILTER2,
  FILTER3
) {
  console.log("Strategy - 3");
  var letters = [];
  letters = fix;
  var positions = [];
  positions = fixPosition;
  var sletters = [];
  sletters = shift;
  var spositions = [];
  spositions = shiftPosition;
  await FILTER1.forEach((leaf) => {
    var index = 0;
    var weight = 0;
    letters.forEach((letter) => {
      if (leaf[positions[index]] === letter) {
        index++;
        weight++;
      }
    });
    if (weight === letters.length) {
      FILTER2.push(leaf);
    }
  });
  await sleep(2000);
  await FILTER2.forEach((leaf) => {
    var index = 0;
    var weight = 0;
    sletters.forEach((letter) => {
      if (leaf[spositions[index]] !== letter) {
        index++;
        weight++;
      }
    });
    if (weight === sletters.length) FILTER3.push(leaf);
  });
  return FILTER3[0];
}

async function strategyIV(FILTER1) {
  console.log("Strategy - 4");
  return FILTER1[0];
}

async function fetchData(wordList, shouldInclude, shouldNotInclude) {
  console.log("Processing data...\nTraining the model");
  await sleep(5000);
  var filter = [];
  wordList.forEach((node) => {
    node.forEach((leaf) => {
      var weight = 0;
      shouldInclude.forEach((letter) => {
        if (leaf.includes(letter)) weight++;
      });
      if (weight === shouldInclude.length) {
        var weight = 0;
        shouldNotInclude.forEach((letter) => {
          if (!leaf.includes(letter)) weight++;
        });
        if (weight === shouldNotInclude.length) {
          filter.push(leaf);
        }
      }
    });
  });
  return filter;
}

for (var tries = 1; tries < 7; tries++) {
  var FILTER1 = [];
  var FILTER2 = [];
  var FILTER3 = [];
  for (var i = 0; i < guess.length; i++) {
    var letter = guess.charAt(i);
    for (var j = 0; j < pos.length; j++) {
      if (letter === pos[j]) {
        document
          .querySelector(
            `#wordle-app-game > div.Keyboard-module_keyboard__uYuqf > div:nth-child(${keyPress[j].row}) > button:nth-child(${keyPress[j].col})`
          )
          .click();
      }
    }
    if (i === 4) {
      document
        .querySelector(
          `#wordle-app-game > div.Keyboard-module_keyboard__uYuqf > div:nth-child(3) > button:nth-child(1)`
        )
        .click();
      await sleep(5000);
      for (var k = 0; k < guess.length; k++) {
        var STAT = document
          .querySelector(
            `#wordle-app-game > div.Board-module_boardContainer__TBHNL > div > div:nth-child(${tries}) > div:nth-child(${
              k + 1
            }) > div`
          )
          .getAttribute("data-state");
        var letter = document
          .querySelector(
            `#wordle-app-game > div.Board-module_boardContainer__TBHNL > div > div:nth-child(${tries}) > div:nth-child(${
              k + 1
            }) > div`
          )
          .getAttribute("aria-label")
          .split(" ")[0];
        if (STAT === "correct") {
          MandateCharacters.push(letter);
          fix.push(letter);
          fixPosition.push(k);
        }
        if (STAT === "absent") {
          var score = 0;
          MandateCharacters.forEach((ele) => {
            if (ele !== letter) score++;
          });
          if (score === MandateCharacters.length) {
            RedundantCharacters.push(letter);
          }
        }
        if (STAT === "present") {
          shift.push(letter);
          shiftPosition.push(k);
        }
      }
    }
  }
  var shouldInclude = [...MandateCharacters];
  var shouldNotInclude = [...RedundantCharacters];
  if (shift.length !== 0) {
    shift.forEach((ele) => {
      shouldInclude.push(ele);
    });
  }
  shouldNotInclude.forEach((e) => {
    shouldInclude.forEach((f) => {
      if (f === e) {
        shouldNotInclude = remove(shouldNotInclude, f);
      }
    });
  });
  var useT = "";
  if (shouldInclude.length === 0) {
    useT = alphabet(shouldNotInclude);
    shouldInclude.push(useT);
  }
  FILTER1 = await fetchData(wordList, shouldInclude, shouldNotInclude);

  if (
    fix.length !== 0 &&
    fixPosition.length !== 0 &&
    shift.length === 0 &&
    shiftPosition.length === 0
  )
    guess = await strategyI(fix, fixPosition, FILTER1, FILTER2);
  else if (
    shift.length !== 0 &&
    shiftPosition.length !== 0 &&
    fix.length === 0 &&
    fixPosition.length === 0
  )
    guess = await strategyII(shift, shiftPosition, FILTER1, FILTER2);
  else if (
    shift.length !== 0 &&
    shiftPosition.length !== 0 &&
    fix.length !== 0 &&
    fixPosition.length !== 0
  )
    guess = await strategyIII(
      shift,
      shiftPosition,
      fix,
      fixPosition,
      FILTER1,
      FILTER2,
      FILTER3
    );
  else guess = await strategyIV(FILTER1);
}
// All copyrights are reserved by NFRAC.
