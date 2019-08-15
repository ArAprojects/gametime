import Round from '../src/Round'

class FinalRound extends Round {
  constructor(roundCounter, categories, cardSet) {
    super(roundCounter, categories, cardSet)
    this.finalCard = this.cardSet[3];
  }
}
export default FinalRound;