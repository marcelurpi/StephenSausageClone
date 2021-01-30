
var failed = false;
var currentLevel = 0;

var state;
var stateStack;

var title = document.getElementById('title');
var ogTitleText = title.textContent;
var subtitle = document.getElementById('subtitle');
var ogSubtitleText = subtitle.textContent;

var prevLevelButton = document.getElementById('prev-level');
prevLevelButton.onclick = prevLevel;

var nextLevelButton = document.getElementById('next-level');
nextLevelButton.onclick = nextLevel;

var levelName = document.getElementById('level-name');

updateLevelButtons();

var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');

resizeCanvas();
loadCurrentLevel();

document.getElementById('body').onresize = function() {
    resizeCanvas();
    updateSizeAttributes();
    redraw();
}

function resizeCanvas() {
    let canvasScale = Math.min((innerWidth - 100) / 1620, (innerHeight - 340) / 1080);
    canvas.style.width = (canvas.width = Math.floor(1620 * canvasScale)) + "px";
    canvas.style.height = (canvas.height = Math.floor(1080 * canvasScale)) + "px";
}

function worldToScreenPos(position) {
    return {
        x: position.x + canvas.width / 2,
        y: position.y + canvas.height / 2,
    };
}

function vectorSum(vector1, vector2) {
    return {
        x: vector1.x + vector2.x,
        y: vector1.y + vector2.y,
    }
}

var tileSize;
var tileMargin;
var sausagePadding;
var grilledPadding;
var playerPadding;
var lineWidth;
var forkLineWidth;

function updateSizeAttributes() {
    let horizontalTileSize = canvas.width / ((state.level[0].length + 2) * 9/8);
    let verticalTileSize = canvas.height / ((state.level.length + 2) * 9/8);
    tileSize = Math.min(horizontalTileSize, verticalTileSize);
    tileMargin = tileSize / 8;
    sausagePadding = tileSize / 8;
    grilledPadding = tileSize / 8;
    playerPadding = tileSize / 8;
    lineWidth = tileSize / 16;
    forkLineWidth = tileSize / 7;
}

function tileToWorldPos(x, y) {
    let tileTopLeft = {
        x: -(state.level[0].length / 2 * tileSize + (state.level[0].length - 1) / 2 * tileMargin),
        y: -(state.level.length / 2 * tileSize + (state.level.length - 1) / 2 * tileMargin),
    };
    return {
        x: tileTopLeft.x + x * (tileSize + tileMargin),
        y: tileTopLeft.y + y * (tileSize + tileMargin),
    };
}

function tileIsWater(x, y) {
    if (x < 0 || x >= state.level[0].length) {
        return true;
    }
    if (y < 0 || y >= state.level.length) {
        return true;
    }
    return state.level[y][x] === tile.WATER;
}

function drawDirt(x, y) {

    context.fillStyle = '#b3634d';
    context.strokeStyle = '#6b3f44';
    context.lineWidth = lineWidth;

    let worldPosition = tileToWorldPos(x, y);
    let screenPosition = worldToScreenPos(worldPosition);
    context.fillRect(screenPosition.x, screenPosition.y, tileSize, tileSize);
    context.strokeRect(screenPosition.x, screenPosition.y, tileSize, tileSize);
}

function drawGrill(x, y) {
    context.fillStyle = '#ffc951';
    context.strokeStyle = '#4c364a';
    context.lineWidth = lineWidth;

    let worldPosition = tileToWorldPos(x, y);
    let screenPosition = worldToScreenPos(worldPosition);
    context.fillRect(screenPosition.x, screenPosition.y, tileSize, tileSize);
    context.strokeRect(screenPosition.x, screenPosition.y, tileSize, tileSize);

    let numLines = 4;
    for (let i = 0; i < numLines; i++) {
        context.beginPath();
        let lineScreenPosition1 = worldToScreenPos({
            x: worldPosition.x + tileSize / (numLines + 1) * (i + 1),
            y: worldPosition.y
        });
        let lineScreenPosition2 = worldToScreenPos({
            x: worldPosition.x + tileSize / (numLines + 1) * (i + 1),
            y: worldPosition.y + tileSize
        });
        context.moveTo(lineScreenPosition1.x, lineScreenPosition1.y);
        context.lineTo(lineScreenPosition2.x, lineScreenPosition2.y);
        context.stroke();
    }
}

function drawSausage(x, y, orientation, grilled) {
    let worldPosition = tileToWorldPos(x, y);
    let screenPosition = worldToScreenPos(worldPosition);
    screenPosition = {
        x: sausagePadding + screenPosition.x,
        y: sausagePadding + screenPosition.y,
    };
    context.fillStyle = '#a13126';
    if (orientation === orient.VERTICAL) {
        screenPosition.w = tileSize - 2 * sausagePadding;
        screenPosition.h = 2 * tileSize + tileMargin - 2 * sausagePadding;
        context.fillStyle = grilled[2] ? '#5c0f00' : '#a13126';
        context.fillRect(screenPosition.x, screenPosition.y, screenPosition.w, (screenPosition.h / 2) * 1.01);
        context.fillStyle = grilled[3] ? '#5c0f00' : '#a13126';
        context.fillRect(screenPosition.x, screenPosition.y + screenPosition.h / 2,
            screenPosition.w, screenPosition.h / 2);
    } else {
        screenPosition.w = 2 * tileSize + tileMargin - 2 * sausagePadding;
        screenPosition.h = tileSize - 2 * sausagePadding;
        context.fillStyle = grilled[2] ? '#5c0f00' : '#a13126';
        context.fillRect(screenPosition.x, screenPosition.y, (screenPosition.w / 2) * 1.01, screenPosition.h);
        context.fillStyle = grilled[3] ? '#5c0f00' : '#a13126';
        context.fillRect(screenPosition.x + screenPosition.w / 2, screenPosition.y,
            screenPosition.w / 2, screenPosition.h);
    }

    let grilledPosition = {
        x: grilledPadding + screenPosition.x,
        y: grilledPadding + screenPosition.y,
        w: screenPosition.w - 2 * grilledPadding,
        h: screenPosition.h - 2 * grilledPadding,
    };
    if (orientation === orient.VERTICAL) {
        grilledPosition.h /= 2;
    } else {
        grilledPosition.w /= 2;
    }

    context.fillStyle = grilled[0] ? '#5c0f00' : '#a13126';
    context.fillRect(grilledPosition.x, grilledPosition.y, grilledPosition.w * 1.01, grilledPosition.h * 1.01);

    if (orientation === orient.VERTICAL) {
        grilledPosition.y += grilledPosition.h;
    } else {
        grilledPosition.x += grilledPosition.w;
    }
    context.fillStyle = grilled[1] ? '#5c0f00' : '#a13126';
    context.fillRect(grilledPosition.x, grilledPosition.y, grilledPosition.w, grilledPosition.h);

    context.lineWidth = lineWidth;
    context.strokeStyle = '#7c1a0f';
    context.strokeRect(screenPosition.x, screenPosition.y, screenPosition.w, screenPosition.h);
}

function drawPlayerFork(screenPosition, direction) {
    let topOrLeft = direction === dir.UP || direction === dir.LEFT;
    let pieces = [{
            beginx: tileSize / 5,
            beginy: topOrLeft ? -tileSize / 3 : tileSize + tileSize / 3,
            endx: tileSize / 5,
            endy: topOrLeft ? -4 * tileSize / 5 : tileSize + 4 * tileSize / 5,
        }, {
            beginx: tileSize / 2,
            beginy: tileSize / 2,
            endx: tileSize / 2,
            endy: topOrLeft ? -19 * tileSize / 20 : tileSize + 19 * tileSize / 20,
        }, {
            beginx: 4 * tileSize / 5,
            beginy: topOrLeft ? -tileSize / 3 : tileSize + tileSize / 3,
            endx: 4 * tileSize / 5,
            endy: topOrLeft ? -4 * tileSize / 5 : tileSize + 4 * tileSize / 5,
        }, {
            beginx: tileSize / 8,
            beginy: topOrLeft ? -tileSize / 3 : tileSize + tileSize / 3,
            endx: 7 * tileSize / 8,
            endy: topOrLeft ? -tileSize / 3 : tileSize + tileSize / 3,
        }
    ];

    context.lineWidth = forkLineWidth;
    context.strokeStyle = '#412c2e';

    for (let piece of pieces) {
        if (direction === dir.LEFT || direction === dir.RIGHT) {
            let beginx = piece.beginx;
            piece.beginx = piece.beginy;
            piece.beginy = beginx;

            let ex = piece.endx;
            piece.endx = piece.endy;
            piece.endy = ex;
        }
        context.beginPath();
        context.moveTo(screenPosition.x + piece.beginx, screenPosition.y + piece.beginy);
        context.lineTo(screenPosition.x + piece.endx, screenPosition.y + piece.endy);
        context.stroke();
    }
}

function drawPlayer(x, y, direction) {
    let worldPosition = tileToWorldPos(x, y);
    let screenPosition = worldToScreenPos(worldPosition);

    drawPlayerFork(screenPosition, direction);

    context.fillStyle = '#f27614';
    context.strokeStyle = '#9d3d07';
    context.lineWidth = lineWidth;

    context.fillRect(
        playerPadding + screenPosition.x, playerPadding + screenPosition.y,
        tileSize - 2 * playerPadding, tileSize - 2 * playerPadding,
    );
    context.strokeRect(
        playerPadding + screenPosition.x, playerPadding + screenPosition.y,
        tileSize - 2 * playerPadding, tileSize - 2 * playerPadding,
    );
}

function copyState(fromState) {
    let toState = {};
    toState.level = [];
    for (let row of fromState.level) {
        let rowCopy = [];
        for (let tile of row) {
            rowCopy.push(tile);
        }
        toState.level.push(rowCopy);
    }
    toState.sausages = [];
    for (let sausage of fromState.sausages) {
        toState.sausages.push({
            orient: sausage.orient, pos: { x: sausage.pos.x, y: sausage.pos.y },
            grilled: [...sausage.grilled],
        });
    }
    toState.player = {
        pos: {
            x: fromState.player.pos.x,
            y: fromState.player.pos.y,
        }, dir: fromState.player.dir,
    };
    return toState;
}

function redraw() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < state.level.length; i++) {
        for (let j = 0; j < state.level[0].length; j++) {
            switch (state.level[i][j]) {
                case tile.DIRT:     drawDirt(j, i);     break;
                case tile.GRILL:    drawGrill(j, i);    break;
                case tile.WATER:                        break;
            }
        }
    }
    for (let sausage of state.sausages) {
        drawSausage(sausage.pos.x, sausage.pos.y, sausage.orient, sausage.grilled);
    }
    drawPlayer(state.player.pos.x, state.player.pos.y, state.player.dir);
}

function vectorFromDirection(direction) {
    switch (direction) {
        case dir.UP:    return { x: 0, y:-1 };
        case dir.LEFT:  return { x:-1, y: 0 };
        case dir.DOWN:  return { x: 0, y: 1 };
        case dir.RIGHT: return { x: 1, y: 0 };
    }
}

function pushSausages(position, pushVector, stateChanged) {
    for (let sausage of state.sausages) {
        let pushed = sausage.pos.y === position.y && sausage.pos.x === position.x;
        if (!pushed && sausage.orient === orient.VERTICAL) {
            pushed = sausage.pos.y + 1 === position.y && sausage.pos.x === position.x;
        } else if (!pushed) {
            pushed = sausage.pos.y === position.y && sausage.pos.x + 1 === position.x;
        }
        if (pushed) {
            stateChanged.changed = true;
            let nextSausagePos = vectorSum(sausage.pos, pushVector);
            if ((sausage.orient === orient.VERTICAL && pushVector.x != 0) ||
                    (sausage.orient === orient.HORIZONTAL && pushVector.y != 0)) {
                let temp = sausage.grilled[0];
                sausage.grilled[0] = sausage.grilled[2];
                sausage.grilled[2] = temp;
                temp = sausage.grilled[1];
                sausage.grilled[1] = sausage.grilled[3];
                sausage.grilled[3] = temp;
                pushSausages(nextSausagePos, pushVector, stateChanged);
            } else {
                let nextPushPos = vectorSum(nextSausagePos, pushVector);
                pushSausages(nextPushPos, pushVector, stateChanged);
            }
            sausage.pos = nextSausagePos;
            updateSausage(sausage);
        }
    }
}

function updateSausage(sausage) {
    let mainWater = tileIsWater(sausage.pos.x, sausage.pos.y);
    let verticalWater = sausage.orient === orient.VERTICAL &&
        tileIsWater(sausage.pos.x, sausage.pos.y + 1);
    let horizontalWater = sausage.orient === orient.HORIZONTAL &&
        tileIsWater(sausage.pos.x + 1, sausage.pos.y);
    if (mainWater && (verticalWater || horizontalWater)) {
        failedLevel('A sausage fell into the water!!');
    }
    if (!mainWater && state.level[sausage.pos.y][sausage.pos.x] === tile.GRILL) {
        if (sausage.grilled[2]) {
            failedLevel('You burnt a sausage!!');
        }
        sausage.grilled[2] = true;
        checkSolved();
    }
    if (!verticalWater && sausage.orient === orient.VERTICAL &&
            state.level[sausage.pos.y + 1][sausage.pos.x] === tile.GRILL) {
        if (sausage.grilled[3]) {
            failedLevel('You burnt a sausage!!');
        }
        sausage.grilled[3] = true;
        checkSolved();
    }
    if (!horizontalWater && sausage.orient === orient.HORIZONTAL &&
            state.level[sausage.pos.y][sausage.pos.x + 1] === tile.GRILL) {
        if (sausage.grilled[3]) {
            failedLevel('You burnt a sausage!!');
        }
        sausage.grilled[3] = true;
        checkSolved();
    }
}

function executeMovement(direction) {
    if (failed) {
        return;
    }
    let stateChanged = { changed: false };
    let stateBefore = copyState(state);

    let nextVector = vectorFromDirection(direction);
    let nextPlayerPos = vectorSum(state.player.pos, nextVector);

    if (direction % 2 === state.player.dir % 2) {
        if (tileIsWater(nextPlayerPos.x, nextPlayerPos.y)) {
            return;
        }
        if (direction === state.player.dir) {
            let forkPos = vectorSum(nextPlayerPos, nextVector);
            pushSausages(forkPos, nextVector, stateChanged);
        } else {
            pushSausages(nextPlayerPos, nextVector, stateChanged);
        }
        if (state.level[nextPlayerPos.y][nextPlayerPos.x] === tile.DIRT) {
            state.player.pos = nextPlayerPos;
            stateChanged.changed = true;
        }
    } else {
        let lastVector = vectorFromDirection(state.player.dir);
        let cornerPos = vectorSum(nextPlayerPos, lastVector);

        pushSausages(cornerPos, nextVector, stateChanged);
        pushSausages(nextPlayerPos, {
            y: -lastVector.y,
            x: -lastVector.x,
        }, stateChanged);
        state.player.dir = direction;
        stateChanged.changed = true;
    }
    if (stateChanged) {
        stateStack.push(stateBefore);
        redraw();
    }
}

function checkSolved() {
    for (let sausage of state.sausages) {
        for (let grilled of sausage.grilled) {
            if (!grilled) {
                return;
            }
        }
    }
    solvedLevel();
}

function solvedLevel() {
    failed = true;
    title.textContent = 'You solved the level!!';
    subtitle.textContent = 'Try other levels by clicking the arrows below';
}

function failedLevel(failReason) {
    failed = true;
    title.textContent = failReason;
    subtitle.textContent = 'Press R to restart level or U to undo last move';
}

function unfailedLevel() {
    failed = false;
    title.textContent = ogTitleText;
    subtitle.textContent = ogSubtitleText;
}

function updateLevelButtons() {
    if (currentLevel === 0) {
        prevLevelButton.classList.add('button-disabled');
    } else {
        prevLevelButton.classList.remove('button-disabled');
    }
    if (currentLevel === levels.length - 1) {
        nextLevelButton.classList.add('button-disabled');
    } else {
        nextLevelButton.classList.remove('button-disabled');
    }
}

function prevLevel() {
    if (currentLevel > 0) {
        currentLevel--;
        loadCurrentLevel()
        updateLevelButtons();
    }
}

function nextLevel() {
    if (currentLevel < levels.length - 1) {
        currentLevel++;
        loadCurrentLevel()
        updateLevelButtons();
    }
}

function loadCurrentLevel() {
    levelName.textContent = levels[currentLevel].name;
    restartLevel();
    updateSizeAttributes();
    redraw();
}

function restartLevel() {
    unfailedLevel();
    stateStack = [];
    state = copyState(levels[currentLevel]);
    for (let sausage of state.sausages) {
        updateSausage(sausage);
    }
    redraw();
}

function undoLastMove() {
    if (stateStack.length > 0) {
        unfailedLevel();
        state = stateStack.pop();
        redraw();
    }
}

redraw();
document.onkeyup = function (event) {
    switch (event.code) {
        case 'KeyA':        executeMovement(dir.LEFT);   break;
        case 'ArrowLeft':   executeMovement(dir.LEFT);   break;
        case 'KeyD':        executeMovement(dir.RIGHT);  break;
        case 'ArrowRight':  executeMovement(dir.RIGHT);  break;
        case 'KeyW':        executeMovement(dir.UP);     break;
        case 'ArrowUp':     executeMovement(dir.UP);     break;
        case 'KeyS':        executeMovement(dir.DOWN);   break;
        case 'ArrowDown':   executeMovement(dir.DOWN);   break;
        case 'KeyR':        restartLevel();              break;
        case 'KeyU':        undoLastMove();              break;
    }
}
