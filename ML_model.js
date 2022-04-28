// Artificially intelligent wordle player designed by Er. Rohit Acharya.
// Copy this code and open the wordle console and paste this code and then hit on enter.
// This Ai model will complete the game in no time.
// This is based on the Reinforcement Learning principle, which learns to decide the input from the given feedback from the previous output.
var wordList = [];
var build = {
    protocol: "https",
    domainInit: "raw",
    subDomainInit: "githubusercontent",
    domain: "com",
    user: "rohitpidishetty",
    parentFile: "API",
    port: "4c1c5155d81fe815989b91ae7a11f65fe5c17421",
    childFile: "Data.json"
}
var essentials = {
    getSubDomain: function (build) {
        return build.domainInit.concat("." + build.subDomainInit).concat("." + build.domain);
    },
    urlBuilder: function (build) {
        return build.protocol.concat("://").append(essentials.getSubDomain(build)).authUser(build.user, build).attach(build);
    }
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function alphabet(discard) {
    var alphabets = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
    alpha = alphabets[Math.floor(Math.random() * alphabets.length - 1)];
    var score = 0;
    discard.forEach(letter => {
        if (alpha !== letter) {
            score++;
        }
    })
    if (score === discard.length) {
        return alpha;
    }
    else {
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
const rev = function (node) {
    var charSet = "";
    for (var i = node.length - 1; i >= 0; i--) {
        charSet += node.charAt(i);
    }
    return charSet;
}
String.prototype.append = function (node) {
    return (this + node);
}
String.prototype.authUser = function (user, file) {
    return (this + "/" + user + "/" + file.parentFile);
}
String.prototype.attach = function (file) {
    return (this + "/" + rev(file.port) + "/" + file.childFile);
}
fetch(essentials.urlBuilder(build)).then((res) => res.json()).then((data) => {
    wordList = data.words;
});
var keyPress = [
    q = { row: 1, col: 1 }, w = { row: 1, col: 2 }, e = { row: 1, col: 3 }, r = { row: 1, col: 4 }, t = { row: 1, col: 5 }, y = { row: 1, col: 6 }, u = { row: 1, col: 7 }, i = { row: 1, col: 8 }, o = { row: 1, col: 9 }, p = { row: 1, col: 10 }, a = { row: 2, col: 2 }, s = { row: 2, col: 3 }, d = { row: 2, col: 4 }, f = { row: 2, col: 5 }, g = { row: 2, col: 6 }, h = { row: 2, col: 7 }, j = { row: 2, col: 8 }, k = { row: 2, col: 9 }, l = { row: 2, col: 10 }, z = { row: 3, col: 2 }, x = { row: 3, col: 3 }, c = { row: 3, col: 4 }, v = { row: 3, col: 5 }, b = { row: 3, col: 6 }, n = { row: 3, col: 7 }, m = { row: 3, col: 8 }]

var RedundantCharacters = [];
var MandateCharacters = [];
var pos = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'z', 'x', 'c', 'v', 'b', 'n', 'm'];
var guess = "brave";
var fix = [];
var fixPosition = [];
var shift = [];
var shiftPosition = [];
for (var tries = 1; tries < 7; tries++) {
    var FILTER1 = [];
    var FILTER2 = [];
    var FILTER3 = [];
    for (var i = 0; i < guess.length; i++) {
        var letter = guess.charAt(i);
        for (var j = 0; j < pos.length; j++) {
            if (letter === pos[j]) {
                document.querySelector("body > game-app").shadowRoot.querySelector("#game > game-keyboard").shadowRoot.querySelector(`#keyboard > div:nth-child(${keyPress[j].row}) > button:nth-child(${keyPress[j].col})`).click()
            }
        }
        if (i === 4) {
            document.querySelector("body > game-app").shadowRoot.querySelector("#game > game-keyboard").shadowRoot.querySelector("#keyboard > div:nth-child(3) > button:nth-child(1)").click();
            await sleep(5000);
            for (var k = 0; k < guess.length; k++) {
                var STAT = document.querySelector("body > game-app").shadowRoot.querySelector(`#board > game-row:nth-child(${tries})`).shadowRoot.querySelector(`div > game-tile:nth-child(${k + 1})`).getAttribute("evaluation");
                var letter = document.querySelector("body > game-app").shadowRoot.querySelector(`#board > game-row:nth-child(${tries})`).shadowRoot.querySelector(`div > game-tile:nth-child(${k + 1})`).getAttribute("letter");
                if (STAT === 'correct') {
                    MandateCharacters.push(letter)
                    fix.push(letter)
                    fixPosition.push(k);
                }
                if (STAT === 'absent') {
                    var score = 0;
                    MandateCharacters.forEach(ele => {
                        if (ele !== letter) {
                            score++;
                        }
                    })
                    if (score === MandateCharacters.length) {
                        RedundantCharacters.push(letter)
                    }
                }
                if (STAT === 'present') {
                    shift.push(letter)
                    shiftPosition.push(k);
                }
            }
        }
    }
    var shouldInclude = [...MandateCharacters];
    var shouldNotInclude = [...RedundantCharacters];
    if (shift.length !== 0) {
        shift.forEach(ele => {
            shouldInclude.push(ele);
        })
    }
    shouldNotInclude.forEach(e => {
        shouldInclude.forEach(f => {
            if (f === e) {
                shouldNotInclude = remove(shouldNotInclude, f);
            }
        })
    })
    var useT = '';
    if (shouldInclude.length === 0) {
        useT = alphabet(shouldNotInclude);
        shouldInclude.push(useT);
    }
    wordList.forEach(node => {
        node.forEach(leaf => {
            var weight = 0;
            shouldInclude.forEach(letter => {
                if (leaf.includes(letter)) {
                    weight++;
                }
            })
            if (weight === shouldInclude.length) {
                var weight = 0;
                shouldNotInclude.forEach(letter => {
                    if (!leaf.includes(letter)) {
                        weight++;
                    }
                })
                if (weight === shouldNotInclude.length) {
                    FILTER1.push(leaf);
                }
            }
        })
    })
    if (fix.length !== 0 && fixPosition.length !== 0 && shift.length === 0 && shiftPosition.length === 0) {
        var letters = []
        letters = [...MandateCharacters];
        var positions = [];
        positions = fixPosition;
        FILTER1.forEach(leaf => {
            if (letters.length === 1) {
                if (leaf[positions[0]] === letters[0]) {
                    FILTER2.push(leaf)
                }
            }
            else {
                var index = 0;
                var weight = 0;
                letters.forEach(letter => {
                    if (leaf[(positions[index])] === letter) {
                        index++;
                        weight++;
                    }
                })
                if (weight === letters.length) {
                    FILTER2.push(leaf)
                }
            }
        })
        await sleep(20000);
        guess = FILTER2[0];
    }
    else if (shift.length !== 0 && shiftPosition.length !== 0 && fix.length === 0 && fixPosition.length === 0) {
        var sletters = [];
        sletters = shift;
        var spositions = [];
        spositions = shiftPosition;
        FILTER1.forEach(leaf => {
            var index = 0;
            var weight = 0;
            sletters.forEach(letter => {
                if (leaf[(spositions[index])] !== letter) {
                    index++;
                    weight++;
                }
            })
            if (weight === sletters.length) {
                FILTER2.push(leaf)
            }
        })
        await sleep(5000);
        guess = FILTER2[0];
    }
    else if (shift.length !== 0 && shiftPosition.length !== 0 && fix.length !== 0 && fixPosition.length !== 0) {
        var letters = [];
        letters = fix;
        var positions = [];
        positions = fixPosition;
        var sletters = [];
        sletters = shift;
        var spositions = [];
        spositions = shiftPosition;
        FILTER1.forEach(leaf => {
            var index = 0;
            var weight = 0;
            letters.forEach(letter => {
                if (leaf[(positions[index])] === letter) {
                    index++;
                    weight++;
                }
            })
            if (weight === letters.length) {
                FILTER2.push(leaf)
            }
        })
        await sleep(2000);
        FILTER2.forEach(leaf => {
            var index = 0;
            var weight = 0;
            sletters.forEach(letter => {
                if (leaf[(spositions[index])] !== letter) {
                    index++;
                    weight++;
                }
            })
            if (weight === sletters.length) {
                FILTER3.push(leaf)
            }
        })
        await sleep(5000);
        guess = FILTER3[0];
    }
    else {
        await sleep(5000);
        guess = FILTER1[0];
    }
}
// All copyrights are reserved by Code infinity research and development laboratory.
