import Player from "./Player";
import Round from "./Round";
import FinalRound from "./FinalRound";

class Game {
  constructor(data, playerSet) {
    this.categories = data.categories;
    this.cards = data.clues;
    this.randomCategories = Object.entries(this.categories).sort(
      (a, b) => 0.5 - Math.random()
    );
    this.roundCategories;
    this.cardSet;
    this.playerSet = playerSet;
    this.currentRoundNum = 0;
    this.currentRound;
    this.currentCard;
    this.currentPlayer = 0;
    this.block;
  }

  startRound() {
    this.currentRoundNum++;
    if (this.currentRoundNum === 1) {
      this.assignCategoriesRound1();
      this.currentRound = new Round(
        this.currentRoundNum,
        this.roundCategories,
        this.cardSet
      );
    } else if (this.currentRoundNum === 2) {
      this.assignCategoriesRound2();
      this.currentRound = new Round(
        this.currentRoundNum,
        this.roundCategories,
        this.cardSet
      );
    } else if (this.currentRoundNum === 3) {
      this.assignCategoriesRound3();
      this.currentRound = new FinalRound(this.currentRoundNum, this.roundCategories, this.cardSet);
    }
  }

  assignCategoriesRound1() {
    this.roundCategories = this.randomCategories.slice(0, 4);
    this.assignCards();
  }

  assignCategoriesRound2() {
    this.roundCategories = this.randomCategories.slice(4, 9);
    this.assignCards();
  }

  assignCategoriesRound3() {
    this.roundCategories = this.randomCategories.slice(9);
    this.assignCards();
  }

  assignCards() {
    let pointValues = [100, 200, 300, 400];
    let randomCardSet = [];
    let finalCardSet = [];
    let ids = this.roundCategories.map(el => el[1]);
    ids.forEach((id, index) => {
      randomCardSet.push(this.cards.filter(el => el.categoryId === ids[index]));
    });
    pointValues.forEach((value, index1) => {
      finalCardSet.push(
        randomCardSet.map(nestedArray =>
          nestedArray.find(ely => ely.pointValue === pointValues[index1])
        )
      );
    });
    this.cardSet = finalCardSet;
  }

  endGame() {}
}

export default Game;
