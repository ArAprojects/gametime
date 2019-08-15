import "./css/base.scss";
import $ from "jquery";
import Game from "../src/Game.js";
import Player from "../src/Player.js";
// import FinalRound from "../src/FinalRound.js"
import brick from "../src/brick.png";

var tableClone = $("table").clone();

let data;
fetch("https://fe-apps.herokuapp.com/api/v1/gametime/1903/jeopardy/data")
  .then(response => response.json())
  .then(fetchData => (data = fetchData.data));

$(document).ready(function() {
  $(".start-game-button").prop("disabled", true);
  $(".final-round-page").hide();
  $('input[type="text"]').keyup(function() {
    if (
      $("#player-one-name-input").val() !== "" &&
      $("#player-two-name-input").val() !== "" &&
      $("#player-three-name-input").val() !== ""
    ) {
      $(".start-game-button").prop("disabled", false);
    }
  });
});

$(".start-game-button").on("click", function(e) {
  e.preventDefault();
  var player1 = new Player($("#player-one-name-input").val());
  var player2 = new Player($("#player-two-name-input").val());
  var player3 = new Player($("#player-three-name-input").val());
  var game = new Game(data, [player1, player2, player3]);
  game.startRound();
  startRoundManager(game.currentRound, game);
  guessManager(game, player1, player2, player3, game.currentRound);
  updatePlayerName(player1, player2, player3);
  assignDailyDouble(game.currentRound, game);
});

function evaluateGuess(game) {
  if (
    game.currentPlayer === 2 &&
    game.currentCard.answer.toLowerCase() !==
      game.playerSet[game.currentPlayer].guess.toLowerCase()
  ) {
    game.playerSet[game.currentPlayer].playerScore -=
      game.currentCard.pointValue * game.currentRoundNum;
    game.currentPlayer = 0;
  } else if (
    game.currentCard.answer.toLowerCase() ===
    game.playerSet[game.currentPlayer].guess.toLowerCase()
  ) {
    game.playerSet[game.currentPlayer].playerScore +=
      game.currentCard.pointValue * game.currentRoundNum;
  } else {
    game.currentCard.answer.toLowerCase() !==
      game.playerSet[game.currentPlayer].guess.toLowerCase();
    game.playerSet[game.currentPlayer].playerScore -=
      game.currentCard.pointValue * game.currentRoundNum;
    game.currentPlayer++;
  }
}

function assignGuess(game) {
  game.playerSet[game.currentPlayer].guess = $("#player-answer-input").val();
}

function guessManager(game, player1, player2, player3, round) {
  $("#player-answer-button").on("click", function(e) {
    e.preventDefault();
    round.remainingCardCount--;
    assignGuess(game);
    evaluateGuess(game, round);
    updatePlayerScore(player1, player2, player3);
    guessDomWork(game);
    endRound(round, game);
  });
}

function startRoundManager(round, game) {
  makeBoard(round);
  getCards(round, game);
}

function guessDomWork(game) {
  $(`#${game.block}`).html(
    `<img style="height:60px; width:100px;" id="brick" src=${brick} />`
  );
  $(`#${game.block}`).off();
}

function getCards(round, game) {
  $(".card").on("click", function(e) {
    var question = $(e.target)
      .closest("th")
      .text();
    game.block = event.target.id;
    round.cardSet.forEach(array1 =>
      array1.find(el => {
        if (el.question === question) {
          game.currentCard = el;
          $(".question").text(game.currentCard.question);
          $(".player-input-labels").text(
            game.playerSet[game.currentPlayer].playerName + ", it's your turn!"
          );
          $(".question").text(game.currentCard.question);
          $(".player-input-labels").text(
            game.playerSet[game.currentPlayer].playerName + ", it's your turn!"
          );
        }
      })
    );
  });
}

function makeBoard(currentRound) {
  currentRound.categories.forEach((cat, index) => {
    $(`#category-name-${index + 1}`).html(
      cat[0].replace(/([A-Z])/g, " $1").replace(/^./, function(str) {
        return str.toUpperCase();
      })
    );
  });
  currentRound.cardSet.forEach(el =>
    el.forEach((card, index) => {
      $(".card").on("click", function(e) {
        $(e.target)
          .closest($(`#category-${index + 1}-${card.pointValue.toString()}`))
          .text(card.question);
        clickCardDom();
      });
    })
  );
}

function updatePlayerName(player1, player2, player3) {
  $("#player-1-name").text(player1.playerName);
  $("#player-2-name").text(player2.playerName);
  $("#player-3-name").text(player3.playerName);
}

function updatePlayerScore(player1, player2, player3) {
  $("#player-1-score").text(`Score: ${player1.playerScore}`);
  $("#player-2-score").text(`Score: ${player2.playerScore}`);
  $("#player-3-score").text(`Score: ${player3.playerScore}`);
}

function displayRoundWinner(round, game) {
  if (game.currentRoundNum === 1 || game.currentRoundNum === 2) {
    $("table").hide();
    $(".round-winner").show();
    $(".round-winner").text(
      `Congratulations ${round.roundWinner[0].playerName}, you won the round!`
    );
  } else if (game.currentRoundNum === 3) {
    $("table").hide();
    $(".round-winner").show();
    $(".round-winner").text(
      `Congratulations ${
        round.roundWinner[0].playerName
      }, you won the whole game! WOWZA!`
    );
  }
}

$(".restart-game-button").on("click", () => {
  location.reload();
});

$(".start-game-button").on("click", () => {
  $(".splash-page").hide();
  $(".main-page").show();
});

function clickCardDom() {
  $("#player-answer-input").val("");
  $(".main-h1").hide();
  $(".player-bar").hide();
  $("table").hide();
  $(".question-and-answer").show();
}

$("#player-answer-button").on("click", () => {
  $(".question-and-answer").hide();
  $(".dd").hide();
  $("table").show();
  $(".main-h1").show();
  $(".player-bar").show();
});

function endRound(round, game, finalround) {
  if (round.remainingCardCount === 15 && game.currentRoundNum === 1) {
    round.determineRoundWinner(game.playerSet);
    displayRoundWinner(round, game);
    setTimeout(function() {
      $("table").replaceWith(tableClone);
      $(".card").each(function() {
        $(this).text($(this).text() * 2);
      });
      game.startRound();
      round.remainingCardCount = 16;
      startRoundManager(game.currentRound, game);
      round.assignDailyDouble2();
      assignDailyDouble(round, game);
      $(".round-winner").hide();
    }, 2000);
  } else if (round.remainingCardCount === 12 && game.currentRoundNum === 2) {
    $("table").hide();
    displayRoundWinner(round, game);
    setTimeout(function() {
      game.startRound();
      $(".round-winner").hide();
      $(".final-round-answers").hide();
      $(".final-round-page").show();
      $("#final-category").text(
        "The Final Category is..." + game.currentRound.categories[0][0]
      );
      $("#final-clue").text(game.currentRound.finalCard.map(card => card.question));
    }, 2000);
  }
}

function assignDailyDouble(round, game) {
  $(".card").on("click", () => {
    if (
      round.dailyDouble1 === round.remainingCardCount ||
      round.dailyDouble2 === round.remainingCardCount
    ) {
      $(".player-input-labels-dd").text(
        game.playerSet[game.currentPlayer].playerName + "Please Enter a Wager!"
      );
      $(".dd").show();
      $("#player-answer-button").prop("disabled", true);
      takeWager(game);
    }
  });
}

function takeWager(game) {
  $("#player-1-wager-button").on("click", () => {
    if (game.currentRoundNum === 1) {
      game.currentCard.pointValue = Math.max(
        $("#player-1-hidden-input").val(),
        0
      );
    } else if (game.currentRoundNum === 2) {
      game.currentCard.pointValue =
        Math.max($("#player-1-hidden-input").val(), 0) / 2;
    }
    if (
      $("#player-1-hidden-input").val() <
      Math.max(game.playerSet[game.currentPlayer].playerScore, 0) + 101
    ) {
      $("#player-answer-button").prop("disabled", false);
    }
  });
}
