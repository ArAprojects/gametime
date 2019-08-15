import chai from 'chai';
const expect = chai.expect;
import data from '../src/dataset.js'
import Game from '../src/Game';
import FinalRound from '../src/FinalRound';

describe('FinalRound', function() {

  let game;
  let final;

  beforeEach(() => {
    game = new Game(data);
    game.currentRoundNum = 2
    game.startRound()
    final = game.currentRound
  });
  
  
  it('should be a function', () => {
    expect(FinalRound).to.be.a('function');
  });
  
  it('should be an instance of FinalRound', () => {
    expect(final).to.be.an.instanceof(FinalRound);
  });
  
  it('should have a property of the final card', () => {
    expect(final.cardSet[3].length).to.equal(1)
  });
  
//   it('should', () => {
//     expect().to.equal()
//   });
  
//   it('should', () => {
//     expect().to.equal()
//   });
  
//   it('should', () => {
//     expect().to.equal()
//   });
  
//   it('should', () => {
//     expect().to.equal()
//   })
  
//   it('should', () => {

//     expect().to.equal()
//   })
  
  
});
  