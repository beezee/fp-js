const assert = (label) => (a) => (b) => {
  // This is quick and dirty, not an example of good code
  const stra = JSON.stringify(a);
  const strb = JSON.stringify(b);
  const color = (stra == strb) ? "\x1b[32m" : "\x1b[31m";
  const result = (stra == strb) ? "passed" : "failed";
  console.log(color, result, label,
      {expected: a, got: b}, "\x1b[0m");
}

const add2 = (x) => x + 2;

// a functor defines fmap for a given context

// fmap lifts a function (a -> b) to (f a -> f b)
// where f is one specific type of context

// implement the following functors to make the tests pass

// Id a = a
// Id fmap :: (a -> b) -> (Id a -> Id b)
const Id = {
  fmap: (f) => (fa) => "implement me"
}

assert("fmap Id functor")(4)(Id.fmap(add2)(2));

// Maybe a = a || null
// Maybe fmap :: (a -> b) -> (Maybe a -> Maybe b)
// when a is null, the result of fmap should be null,
// when a is not null, the result of fmap should be b
const Maybe = {
  fmap: (f) => (fa) => "implement me"
}

assert("fmap Maybe functor, value present")(4)(
  Maybe.fmap(add2)(2));
assert("fmap Maybe functor, no value present")(null)(
  Maybe.fmap(add2)(null))

// Either l a = {left: l || null, right: a || null}
// (Either l) fmap ::
//   (a -> b) -> (Either l) a -> (Either l) b

// left and right are mutually exclusive,
// this means if left is not null, then right is null
// and if right is not null, then left is
// left takes priority, so if left is not null,
// always assume that right is
const Either = {
  fmap: (f) => (fa) => "implement me"
}

assert("fmap Either functor, right value")({left: null, right: 4})(
  Either.fmap(add2)({left: null, right: 2}));
assert("fmap Either functor, left value")(
  {left: "An error occurred", right: null})(
  Either.fmap(add2)({left: "An error occurred", right: null}));


// BONUS
// Reader r a = r -> a
// Reader fmap :: (a -> b) -> Reader a -> Reader b
const Reader = {
  fmap: (f) => (fa) => ((x) => "implement me")
}

assert("fmap Reader functor")(4)(
  Reader.fmap(add2)((x) => x)(2));
