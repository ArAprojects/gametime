import Game from "./Game";

class Round {
  constructor(roundCounter, categories, cardSet) {
    this.roundCounter = roundCounter;
    // this.dailyDouble1 = Math.floor(Math.random() * 14) + 1;
    this.dailyDouble1 = 10
    this.dailyDouble2;
    this.categories = categories;
    this.cardSet = cardSet;
    this.remainingCardCount = 16;
    this.roundWinner;
  }

  determineRoundWinner(players) {
    let winners = [...players]
    this.roundWinner = winners.sort((a, b) => {
      return b.playerScore - a.playerScore
    })
    return this.roundWinner[0]
  }

  assignDailyDouble2() {
    if (this.roundCounter === 1) {
      this.dailyDouble2 = Math.floor(Math.random() * 14) + 1;
    }
  }
}

 export default Round;
