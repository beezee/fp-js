var f = require('./functor.js');

const compose = (f1, f2) => (a) => f1(f2(a));

// IdM a = a
// IdM (
//  return :: a -> IdM a
//  join :: IdM (IdM a) -> IdM a
//  bind :: (a -> IdM b) -> IdM a -> IdM b
const IdM = {
  return: (a) => "implement me",
  join: (a) => "implement me",
  bind: (ab) => (a) => IdM.join(f.Id.fmap(ab)(a))
};

f.assert("bind Id monad")(4)(IdM.bind(
  compose(IdM.return, f.add2))(IdM.return(2)));

// MaybeM a = a || null
// MaybeM (
//  return :: a -> MaybeM a
//  join :: MaybeM (MaybeM a) -> MaybeM a
const MaybeM = {
    return: (a) => "implement me",
    join: (a) => "implement me",
    bind: (ab) => (a) => MaybeM.join(f.Maybe.fmap(ab)(a))
}

f.assert("bind Maybe monad")(4)(MaybeM.bind(
  compose(MaybeM.return, f.add2))(MaybeM.return(2)));
f.assert("bind Maybe monad")(null)(MaybeM.bind(
  compose((x) => null, f.add2))(MaybeM.return(2)));
f.assert("bind Maybe monad")(null)(MaybeM.bind(
  compose(MaybeM.return, f.add2))(null));
f.assert("bind Maybe monad")(null)(MaybeM.bind(
  compose((x) => null, f.add2))(null));

// (EitherM l) a = {left: null, right: a} || {left: l, right: null}
// (EitherM l) (
//  return :: a -> (EitherM l) a
//  join :: ((EitherM l) (EitherM l) a) -> (EitherM l) a
const EitherM = {
  return: (a) => "implement me",
  join: (a) => "implement me",
  bind: (ab) => (a) => EitherM.join(f.Either.fmap(ab)(a))
}
exports.EitherM = EitherM;

f.assert("bind Either monad")({left: null, right: 4})(EitherM.bind(
  compose(EitherM.return, f.add2))(EitherM.return(2)));
f.assert("bind Either monad")({left: "Error before call", right: null})(
  EitherM.bind(compose(EitherM.return, f.add2))(
      {left: "Error before call", right: null}));
f.assert("bind Either monad")({left: "Failed during call", right: null})(
  EitherM.bind(compose(
    (x) => ({left: "Failed during call", right: null}), 
    f.add2))({left: null, right: 2}));
f.assert("bind Either monad")({left: "Failed before call", right: null})(
  EitherM.bind(compose(
    (x) => ({left: "Failed during call", right: null}), 
    f.add2))({left: "Failed before call", right: null}));
//
// (ReaderM r) a = r -> a
// (ReaderM r) (
//  return :: a -> (r -> a)
//  join :: (r -> (r -> a)) -> (r -> a)
const ReaderM = {
  return: (a) => (r) => "implement me",
  join: (rra) => (r) => "implement me",
  bind: (ab) => (a) => ReaderM.join(f.Reader.fmap(ab)(a))
}

f.assert("bind Reader monad")(4)(
  ReaderM.bind(compose(ReaderM.return, f.add2))((x) => x)(2));

module.exports = { IdM, MaybeM, EitherM, ReaderM }
