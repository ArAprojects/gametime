import chai from 'chai'
import data from '../src/dataset.js'
import Player from '../src/Player.js'
import Round from '../src/Round.js'
import Game from '../src/Game.js';
const expect = chai.expect;

describe('Round', () => {
  let game;
  let round;

  beforeEach(() => {
    game = new Game(data)
    game.startRound()
    round = game.currentRound
  });

  it('should be a function', () => {
    expect(Round).to.be.a('function');
  });

  it('should be an instance of Round', () => {
    expect(round).to.be.an.instanceOf(Round);
  }); 

  it('should use a roundCounter based on currentRoundNum in Game', () => {
    expect(round.roundCounter).to.equal(1);
    game.startRound()
    const round2 = game.currentRound
    expect(round2.roundCounter).to.equal(2);
  }); 

  it('should generate a random dailyDouble1 value', () => {
    expect(round.dailyDouble1).to.not.equal(undefined);
  }); 

  it('should receive the categories selected for the round per Game', () => {
    expect(round.categories.length).to.eql(4);
  }); 

  it('should have receive a cardSet from Game with a length of 4 (with 4 items in each)', () => {
    expect(round.cardSet.length).to.eql(4)
    expect(round.cardSet[0].length).to.eql(4)
    expect(round.cardSet[1].length).to.eql(4)
    expect(round.cardSet[2].length).to.eql(4)
    expect(round.cardSet[3].length).to.eql(4)
  });

  it('should generate a second dailyDouble in Round 2; it should not equal dailyDouble1', () => {
    expect(round.dailyDouble2).to.equal(undefined)
    game.startRound()
    round = game.currentRound
    round.generateRandomDailyDoubleCard2()
    // expect(round.dailyDouble2).to.not.equal(undefined);
    expect(round.dailyDouble2).to.not.equal(round.dailyDouble1);
  }); 

});