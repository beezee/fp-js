const assert = (label) => (a) => (b) => {
  // This is quick and dirty, not an example of good code
  const stra = JSON.stringify(a);
  const strb = JSON.stringify(b);
  const color = (stra == strb) ? "\x1b[32m" : "\x1b[31m";
  const result = (stra == strb) ? "passed" : "failed";
  console.log(color, result, label,
      {expected: a, got: b}, "\x1b[0m");
}

const fold = (as) => (zero) => (append) => (as.length == 0)
  ? zero
  : fold(as.slice(1))(append(zero)(as[0]))(append);

const foldM = (as) => (M) => fold(as)(M.zero())(M.append);

const foldMap = (as) => (map) => (M) =>
    fold(as)(M.zero())((x) => (y) => M.append(x)(map(y)));

// monoid is a pair of functions for a given type a
// (append :: a -> a -> a, zero :: () -> a)
const Monoid = (append) => (zero) => ({append, zero});

// there are three laws that must hold for any valid monoid definition
// associativity, left identity and right identity
const MonoidLaws = (M) => (label) => (a1, a2, a3) => {
  // associativity:
  // append(a1)(append(a2, a3)) == append(append(a1, a2))(a3)
  assert(label + " Monoid, associativity")(
    M.append(a1)(M.append(a2)(a3)))(
    M.append(M.append(a1)(a2))(a3));
  // left identity: append(zero, a) == a
  [a1, a2, a3].forEach((a) => 
    assert(label + " Monoid, left identity")(a)(
      M.append(M.zero())(a)));
  // right identity: append(a, zero) == a
  [a1, a2, a3].forEach((a) => 
    assert(label + " Monoid, right identity")(a)(
      M.append(a)(M.zero())));
};

// here is for example string concatenation
const StringConcat = Monoid((s1) => (s2) => s1 + s2)(() => "");
MonoidLaws(StringConcat)("String concatenation")("foo", "bar", "baz");

// TODO - Addition is broken, fix it to be lawful and correct
const NumericAddition = Monoid((x) => (y) => [x, y])(() => 5);
MonoidLaws(NumericAddition)("Numeric addition")(1, 2, 3);
assert("Numeric addition works")(9)(foldM([2, 3, 4])(NumericAddition));

// TODO - Multiplication is broken, fix it to be lawful and correct
const NumericMultiplication = Monoid((x) => (y) => [x, y])(() => 5);
MonoidLaws(NumericMultiplication)("Numeric multiplication")(1, 2, 3);
assert("Numeric multiplication works")(24)(foldM([2, 3, 4])(NumericMultiplication));

// TODO - Array concatenation is broken, fix it to be lawful and correct
const ArrayConcat = Monoid((x) => (y) => [x, y])(() => ["fix me"]);
MonoidLaws(ArrayConcat)("Array concatenation")([1], [2], [3]);
assert("Array concatenation works")([2, 3, 4])(foldM([[2], [3], [4]])(
  ArrayConcat));

// We can compose monoids. Here's a generic constructor for a
// pair monoid when both elements of the pair have monoids
const PairMonoid = (M0) => (M1) => ({
  append: (px) => (py) => [
    M0.append(px[0])(py[0]),
    M1.append(px[1])(py[1])
  ],
  zero: () => [M0.zero(), M1.zero()]
});

// We can always pair a monoid with itself, aka diagonal (a -> (a, a))
// diagonal (Monoid a) = Monoid [a, a]
const diagonal = (M) => PairMonoid(M)(M);

// Now we can use diagonal to get a monoid for pair [string, string]
const StringPair = diagonal(StringConcat);
assert("String pair concat works")(["foobarbaz", "barbazfoo"])(
  foldM([["foo", "bar"], ["bar", "baz"], ["baz", "foo"]])(StringPair));

// And use diagonal to get an addition monoid for pair [number, number]
const AddPair = diagonal(NumericAddition);

// with AddPair, we can average an array with foldMap. 
// TODO - fix the avgPair function to make the assertion pass
const avgPair = (x) => [10, 20];
const divArray = (x) => x[0] / x[1];
assert("AddPair allows clean averaging of numeric arrays")(3)(
  divArray(foldMap([1, 2, 3, 4, 5])(avgPair)(AddPair)));
