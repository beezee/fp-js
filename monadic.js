const m = require('./monad.js');

// guessF :: { get: (f number), incorrect: (f ()) }

const guessId = (guess) => ({
  get: () => { if (isNaN(parseInt(guess))) {
    throw new Error("guess is required");
  } else {
    return parseInt(guess);
  }},
  incorrect: () => { throw new Error("guess is incorrect"); }
});

const guessMaybe = (guess) => ({
  get: () => isNaN(parseInt(guess))
    ? null
    : parseInt(guess),
  incorrect: () => null
});

const guessEither = (guess) => ({
  get: () => isNaN(parseInt(guess))
    ? {left: "Guess " + guess + " is not a number"}
    : {left: null, right: guess},
  incorrect: () => ({left: "Guess " + guess + " is incorrect"})
});

const guessReader = (guess) => ({
  get: () => (r) => guessId(guess).get(),
  incorrect: () => (r) => guessId(guess).incorrect()
});

const guessM = (answer) => (monad) => (guessAlg) =>
  monad.bind(
    (a) => a == answer
      ? monad.return("you guessed correct")
      : guessAlg.incorrect())(
    guessAlg.get())

const log = console.log;

log("\nID");
// guessM(2)(m.IdM)(guessId(3)) // blows up
// guessM(2)(m.IdM)(guessId("NaN")) // blows up
log(guessM(2)(m.IdM)(guessId(2)));

log("\nMaybe");
log(guessM(2)(m.MaybeM)(guessMaybe("NaN")));
log(guessM(2)(m.MaybeM)(guessMaybe(3)));
log(guessM(2)(m.MaybeM)(guessMaybe(2)));

log("\nEither");
log(guessM(2)(m.EitherM)(guessEither("NaN")));
log(guessM(2)(m.EitherM)(guessEither(3)));
log(guessM(2)(m.EitherM)(guessEither(2)));

log("\nReader")
// log(guessM(2)(m.ReaderM)(guessReader(3))("run")); // blows up
log(guessM(2)(m.ReaderM)(guessReader(2))("run"));
