// Enemies our player must avoid
var Enemy = function(x,y,speed) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';

    // position and speed on the canvas
    this.x=x;
    this.y=y;
    this.speed = speed;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers...

    // if we got the right boundary, the bug re enters from left side
    // with a different speed calculated between (1..4)*100. If not, we
    // just increase a determined number of pixels. I calculated them
    // according to dt so that bugs have the most similar speed to the
    // video provided for the project.
    if (this.x >= 505) {
        this.x = 0;
        this.speed = (Math.floor(Math.random() * 3) + 2)*100;
    } else {
        this.x = this.x + (this.speed * dt);
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};



// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
// I named the function because is easier later to trace
function Player(x,y) {

    // constructor variables
    this.sprite = 'images/char-boy.png';
    this.x=x;
    this.y=y;

}

// Player methods
Player.prototype = {

    // we set manually the constructor property to point to prototype.
    // this is another way of applying OOP in javascript.
    constructor: Player,

    update: function() {

    },

    render: function() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    },

    handleInput: function(key) {

        var nextpos = [];
        nextpos = getNewPosition(this.x, this.y, key);
        this.x = nextpos[0];
        this.y = nextpos[1];
        this.render();

        //console.log(nextpos[0], nextpos[1]);

    },

    // the reset function relocates the buddy at the initial position.
    reset: function() {
        this.x=200;
        this.y=380;
        this.render();
    }
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

var player = new Player(200,380);

// n is number of enemies
var n = 3;
var allEnemies = [];

// good y position for enemies
var position_y = [59,143,225];
for (var i=0; i<n; i++) {
    allEnemies[i] = new Enemy(0,position_y[i],100*(i+1));
    //console.log(allEnemies[i].x, allEnemies[i].y,i+1,randx);
};



// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    // "e" is the event that provides the key code
    player.handleInput(allowedKeys[e.keyCode]);
});


/* This helper function is called from player.handleInput() method. Its in
 * charge of processing next position according to actual one.
 * The canvas in divided in 5x5 squares, each one with a concrete (x,y) pixel value that
 * relates to what i consider the center of the square for the buddy sprite.
 * The function also process the situation where the sprite is at the edge of
 * the canvas. So for instance, if we are at the right edge (last square), and
 * we want to move right, it doesnt let us. The function returns an array of
 * two values: new x and y position.
*/
function getNewPosition(x,y,key) {

    var new_position = [];
    new_position[0] = x;
    new_position[1] = y;

    var x_axis = [0,100,200,300,400];
    var y_axis = [50,130,220,300,380];

    var index_x = x_axis.indexOf(x); // returns 0..4
    var index_y = y_axis.indexOf(y); // returns 0..4

    if (key == 'right') {
        if (x != x_axis[4]) {
            new_position[0] = x_axis[index_x+1];
        }
    }else if (key == 'left') {
        if (x != x_axis[0]){
            new_position[0] = x_axis[index_x-1];
        }
    }else if (key == 'up') {
        if (y != y_axis[0]){
            new_position[1] = y_axis[index_y-1];
        }
    }else if (key == 'down') {
        if (y != y_axis[4]) {
            new_position[1] = y_axis[index_y+1];
        }
    }

    return new_position;

}


/* This function checks enemy per enemy if it is at the same row (y) and
 * at the same column (x) than the player. For the purpose of the design, the
 * (x,y) location in pixels that determines if the player is at the center of a square
 * is not the same than the (x,y) pixel location that determines if the bug is at
 * the center of a square. A collision happens when the bug is between 50px left from the
 * center of the square (where is located the buddt), or is 50px right further from the same
 * point.
 */
function enemyTouched(enemy) {

    var touched=false;

    // this conditional checks if the player and the bug are at the same row.
    if ((enemy.y - 9 == player.y) || (enemy.y - 13 == player.y) || (enemy.y - 5 == player.y)) {
        // we check if the bug is -30px left or +50px right from player.
        if ( (enemy.x >= (player.x-50)) && (enemy.x <= (player.x+50)) ) {
            // this is the case that almost half bug head or almost half bug
            // tail is still inside the same square than the player, so we
            // concluded that collision exist.
            touched=true;
        }
    }
    return touched;
}




