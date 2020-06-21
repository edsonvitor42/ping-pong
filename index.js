const screenWidth = 600;
const screenHeight = 500;
const ballSize = 10;
let ball = {
    size: ballSize,
    raio: ballSize / 2,
    position: {
        x: (screenWidth-ballSize)/2,
        y: ((screenHeight-ballSize)/2)
    },
    movement_x_speed: 6,
    movement_y_speed: 6,
}

const PLAYERS = {
    WIDTH: 10,
    HEIGHT: screenHeight / 4,
    MOVEMENT_SPEED: screenHeight / 8
}

const state = {
    players: {
        'player1': { 
            position: {
                x: ((screenWidth-screenWidth) + (PLAYERS.WIDTH / 2)),
                y: ((screenHeight / 2) - ( PLAYERS.HEIGHT / 2 ))
            },
            color: 'white',
            points: 0
        },
        'player2': { 
            position: {
                x: (screenWidth - (PLAYERS.WIDTH + (PLAYERS.WIDTH / 2))),
                y: ((screenHeight / 2) - ( PLAYERS.HEIGHT / 2 ))
            },
            color: 'white',
            points: 0
        }
    }
}

function onload() {
    var canvas = document.getElementById('myCanvas');
    canvas.width = screenWidth;
    canvas.height = screenHeight;

    const game = createGame();

    let context = canvas.getContext('2d');

    document.addEventListener('keydown', handleKeydown);

    function handleKeydown(event) {
        game.movePlayer({ playerId: 'player1', keyPressed: event.key });
    }

    (function renderScreem() {
        context.fillStyle = 'black';
        context.clearRect(0, 0, screenWidth, screenHeight)

        createBall(context);
        movesTheOpponentsRacket();
        updatePoints(context);

        for (const playerId of Object.keys(state.players)) {
            const player = state.players[playerId];

            context.fillStyle = player.color;
            context.fillRect(player.position.x, player.position.y, PLAYERS.WIDTH, PLAYERS.HEIGHT);
        }

        requestAnimationFrame(renderScreem);
    }());
}

function updatePoints(context) {
    if (ball.position.x + ball.raio > screenWidth) {
        state.players['player1'].points += 1
    }

    if (ball.position.x - ball.raio < 0) {
        state.players['player2'].points += 1
    }

    context.font = '30px Arial';
    context.textAlign = 'center';
    context.fillText(`${state.players['player1'].points}  |  ${state.players['player2'].points}`, screenWidth/2, 45);
}

function createGame() {
    const movePlayer = (command) => {
        const { playerId, keyPressed } = command;
        console.log(`O jogador logado é ${playerId} efetuando a ação ${keyPressed}`);

        const allowedActions = {
            'ArrowUp': () => {
                if ((state.players[playerId].position.y - PLAYERS.MOVEMENT_SPEED) < 0) {
                    state.players[playerId].position.y = 0;
                    return;
                }
    
                state.players[playerId].position.y -= PLAYERS.MOVEMENT_SPEED;
            },
            'ArrowDown': () => {
                if (((state.players[playerId].position.y + PLAYERS.HEIGHT + (PLAYERS.HEIGHT / 2)) + PLAYERS.MOVEMENT_SPEED) > screenHeight) {
                    state.players[playerId].position.y = screenHeight - PLAYERS.HEIGHT;
                    return;
                }
    
                state.players[playerId].position.y += PLAYERS.MOVEMENT_SPEED;
            }
        };
    
        const allowedAction = allowedActions[keyPressed];
    
        if (!allowedAction) {
            return;
        }
    
        allowedAction();
    }

    return {
        movePlayer
    }
}

function createBall(context = {}) {
    movementBall();
    checksIfTheBallHitTheRacket();

    context.beginPath();
    context.arc(ball.position.x, ball.position.y, ball.size, 0, 2 * Math.PI, false);
    context.fillStyle = 'white';
    context.fill();
    context.stroke();
}

function movementBall() {
    ball.position.x += ball.movement_x_speed;
    ball.position.y += ball.movement_y_speed;

    if (ball.position.x + ball.raio > screenWidth || ball.position.x - ball.raio < 0) {
        ball.movement_x_speed *= -1;
    }

    if (ball.position.y + ball.raio > screenHeight || ball.position.y - ball.raio < 0) {
        ball.movement_y_speed *= -1;
    }
}

function movesTheOpponentsRacket() {
    const playerId = 'player2';
    let moviment_speed = ball.position.y - (state.players[playerId].position.y - (PLAYERS.HEIGHT / 2 - 50));

    if ((state.players[playerId].position.y + moviment_speed + PLAYERS.HEIGHT) > screenHeight) {
        return;
    }

    state.players[playerId].position.y += moviment_speed;
}

function checksIfTheBallHitTheRacket() {
    if ((ball.position.x + ball.raio) < (state.players['player1'].position.x + PLAYERS.WIDTH + 5)
        && (ball.position.y - ball.raio) < (state.players['player1'].position.y + PLAYERS.HEIGHT)
        && (ball.position.y + (ball.raio * 2)) > (state.players['player1'].position.y)) {
        ball.movement_x_speed *= -1;
        return;
    }

    if ((ball.position.x + ball.raio) > (state.players['player2'].position.x + PLAYERS.WIDTH - 15)
        && (ball.position.y - ball.raio) < (state.players['player2'].position.y + PLAYERS.HEIGHT)
        && (ball.position.y + (ball.raio * 2)) > (state.players['player2'].position.y)) {
        ball.movement_x_speed *= -1;
        return;
    }
}