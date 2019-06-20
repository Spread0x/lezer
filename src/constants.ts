// This file defines some constants that are needed both in this
// package and in lezer-generator, so that the generator code can
// access them without them being part of lezer's public interface.

// Parse actions are represented as numbers, in order to cheaply and
// simply pass them around. The numbers are treated as bitfields
// holding different pieces of information.
//
// When storing actions in 16-bit number arrays, they are split in the
// middle, with the first element holding the first 16 bits, and the
// second the rest.
//
// The value 0 (which is not a valid action because no shift goes to
// state 0, the start state), is often used to denote the absence of a
// valid action.
export const enum Action {
  // Distinguishes between shift (off) and reduce (on) actions.
  ReduceFlag = 1 << 16,
  // The first 16 bits hold the target state's id for shift actions,
  // and the reduced term id for reduce actions.
  ValueMask = 2**16 - 1,
  // In reduce actions, all bits beyond 18 hold the reduction's depth
  // (the amount of stack frames it reduces).
  ReduceDepthShift = 19,
  // This is set for reduces that reduce the content of a repeat
  // expression to the repeat term (but _not_ for the reduction that
  // reduces two instances of the repeat term).
  RepeatFlag = 1 << 17,
  // Goto actions are a special kind of shift that don't actually
  // shift the current token, just add a stack frame. This is used for
  // non-simple skipped expressions, to enter the skip rule when the
  // appropriate token is seen (because the arbitrary state from which
  // such a rule may start doesn't have the correct goto entries).
  GotoFlag = 1 << 17,
  // Both shifts and reduces can have a stay flag set. For shift, it
  // means that the current token must be shifted but the state should
  // stay the same (used for single-token skip expression). For
  // reduce, it means that, instead of consulting the goto table to
  // determine which state to go to, the state already on the stack
  // must be returned to (used at the end of non-simple skip
  // expressions).
  StayFlag = 1 << 18
}

// Each parser state has a `flags` field.
export const enum StateFlag {
  // Set if this state is part of a skip expression (which means nodes
  // produced by it should be moved out of any node reduced directly
  // after them).
  Skipped = 1,
  // Indicates whether this is an accepting state.
  Accepting = 2,
  // States that start a nested grammar have `StartNest` set and store
  // the index into `parser.nested` for the nested grammar used in the
  // bits after `NestShift`.
  StartNest = 4,
  NestShift = 10
}

// The lowest bit of the values stored in `parser.specializations`
// indicate whether this specialization replaced the original token
// (`Specialize`) or adds a second interpretation while also leaving
// the first (`Extend`).
export const enum Specialize {
  Specialize = 0,
  Extend = 1
}

// Terms are 16-bit numbers
export const enum Term {
  // Odd numbers are used for terms that must show up in the
  // (user-visible) tree.
  Tagged = 1,
  // The values of the error and end-of-file terms are hard coded, the
  // others are allocated per grammar.
  Eof = 0,
  Err = 1,
}

export const enum Seq {
  // Used as end marker for most of the sequences stored in uint16
  // arrays
  End = 0xffff
}
