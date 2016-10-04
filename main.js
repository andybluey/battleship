// Creating the basics of the game initially on this js file

var rows = 10;
var columns = 10;
var characters = "ABCDEFGHIJ";
var gridNo;
var squares = rows * columns;
var squareSize = 30;
var gridLocation;
var hitCount = 0;
var missCount = 0;
var totalCount = 0;
var clickCount = 0;
var playerOneShipLength = 0;
var opponentTotalShipLength = 0;
var playerOneScore = 0;
var computerScore = 0;

var createGrid = function() {
  var counter = $(".counts").appendTo(totalCount);
  // ES 6 code
  for (char of characters) {
    var letter = char;
    for (var i = 0; i < columns; i++) {
      gridNo = i + 1;
      gridLocation = letter + gridNo;
      var $tile = $(".board").append('<div class=' + letter + ' id =' + gridNo + '>' + gridLocation + '</div> ').addClass("board");
      $tile.addClass("board");
    }
  }
};
createGrid();

var opponentGrid = function() {
  for (char of characters) {
    var letter = char;
    for (var i = 0; i < columns; i++) {
      gridNo = i + 1;
      gridLocation = letter + gridNo;
      $(".secondBoard").append('<div class=' + letter + ' id =' + gridNo + '>' + gridLocation + '</div> ');
    }
  }
};

// // Create the fleet - ship and size
var fleet = [{
  ship: "Carrier",
  size: "5"
}, {
  ship: "Battleship",
  size: "4"
}, {
  ship: "Cruiser",
  size: "3"
}, {
  ship: "Submarine",
  size: "3"
}, {
  ship: "Destroyer",
  size: "2"
}, ];

var createFleet = function() {
  // function to create fleet
  $(".sidePanel").append('<div id=ship><br><em>Ships:</em></div>');

  shipNo = fleet.length;

  for (var i = 0; i < fleet.length; i += 1) {
    $("<div id = " + fleet[i].size + ">" + fleet[i].ship + "</div>").css({
      "font-size": "20px"
    }).appendTo("#ship"); // Using CSS to call the width in px.

  }
};
createFleet();

// Drag and drop ships
var draggable = function() {
  $(function() {
    var size;
    // Setter
    $("#ship div").draggable({
      revert: "invalid",
      drag: function(event, ui) {
        size = $(this).attr('id');
      },
    });
    // Getter
    $(".board div").droppable({
      drop: function(event, ui) {
        var gridNo = $(this).attr('id');
        var letter = $(this).attr('class').charAt(0);
        console.log(gridNo + letter);
        var endOfShip = parseInt(gridNo) + parseInt(size);
        if (!(endOfShip % 10 >= 0 && endOfShip % 10 < size - 1)) {
          for (var i = gridNo; i < endOfShip; i++) {
            $("#" + [i] + "." + letter).addClass("shipLocation");
            playerOneShipLength++;
          }
          if (playerOneShipLength === 17) {
            console.log("playerOneShipLength ===17");
            opponentGrid();
            randomShip();
            playerOneShot();
            $("#ship").remove();
            scoreBoard();
          }
        } else if ($(this) !== ".board div") {
          alert("This isn't on the grid");
          reset();
        }
      },
    });
  });
};
draggable();

// Create random ship to place on randomGrid
var randomShip = function() {
  shipNo = fleet.length;
  for (var i = 0; i < fleet.length; i += 1) {
    selectShip = fleet[i].ship;
    sizeOfShip = fleet[i].size;
    // Check to make sure ship doesn't go off grid
    randomNumber = Math.ceil(Math.random() * (11 - sizeOfShip));
    console.log("Random number: " + randomNumber);
    randomLetter = characters[(Math.floor(Math.random() * 10))];
    endOfShip = parseFloat(randomNumber) + parseFloat(sizeOfShip);
    // Set parameters to set down ship
    for (var j = randomNumber; j < endOfShip; j++) {
      $(".secondBoard #" + [j] + "." + randomLetter).addClass("opponentShip");
      opponentTotalShipLength++;
    }
  }
};

var playerOneShot = function() {
  $(".secondBoard div").on("click", function(event) {
    // Append counts to screen
    var $tileNumber = $(this).attr("class");
    console.log($tileNumber);
    // Check to see status of click
    if ($(this).hasClass("hit") || $(this).hasClass("miss")) {
      console.log("already clicked");
      alert("You've already clicked here");
      // If hit
    } else if ($(this).hasClass("opponentShip")) {
      // Append HIT
      $(this).addClass("hit");
      hitCount++;
      totalCount++;
      opponentTotalShipLength--;
      clickCount++;
      statistics();
      checkStatus();
      opponentsTurn();
      // If miss
    } else {
      $(this).addClass("miss");
      missCount++;
      totalCount++;
      clickCount++;
      statistics();
      opponentsTurn();
    }
  });
};

var opponentsTurn = function() {
  if (clickCount % 2 !== 0) {
    console.log("Opponents Turn");
    console.log(clickCount);
    randomNumber = Math.ceil(Math.random() * 10);
    randomLetter = characters[(Math.floor(Math.random() * 10))];
    randomFire = ".board #" + randomNumber + "." + randomLetter;
    console.log(randomFire);
    $(".board #" + randomNumber + "." + randomLetter).addClass("fire");
    if ($(randomFire).hasClass("hit") || $(randomFire).hasClass("miss")) {
      console.log("Computer already generated this");
      return;
      // If hit
    } else if ($(randomFire).hasClass("shipLocation")) {
      // Append HIT
      console.log("The computer hit");
      $(randomFire).addClass("hit");
      clickCount++;
      statistics();
      checkStatus();
      // If miss
    } else {
      $(randomFire).addClass("miss");
      console.log("The computer missed");
      clickCount++;
      statistics();
    }
  }
};

var statistics = function() {
  $(".stats").html("Shots fired: " + totalCount + "<br>" +
    "Hits: " + hitCount + "<br>" +
    "Misses: " + missCount + "<br>" +
    "Opponent Ships Left: " + (opponentTotalShipLength));
};
statistics();

var scoreBoard = function() {
  $(".sidePanel").append("Score:" + "<br>" + "Player: " + playerOneScore + "<br>" +
    "Computer: " + computerScore + "<br>");
};

// Check status of ships & Reset game.
var checkStatus = function() {
  if (opponentTotalShipLength === 0 && totalCount > 1) {
    alert("You win");
    playerOneScore++;
    reset();
  } else if (playerOneShipLength === 0 && totalCount > 1) {
    alert("Your fleet is gone!");
    computerScore++;
    reset();
  }
};
// checkStatus();

$("button.reset").on("click", function() {
  reset();
});

var reset = function() {
  $(".board div").empty();
  $(".board").empty();
  $(".secondBoard div").empty();
  $(".secondBoard").empty();
  $(".sidePanel").empty();
  hitCount = 0;
  missCount = 0;
  totalCount = 0;
  clickCount = 0;
  opponentTotalShipLength = 0;
  playerOneShipLength = 0;
  createGrid();
  createFleet();
  statistics();
  draggable();
};
