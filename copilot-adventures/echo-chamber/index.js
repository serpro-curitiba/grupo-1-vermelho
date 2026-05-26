/**
 * Echo Chamber - Magical Number Sequence Predictor
 *
 * In the mystical Echo Room, numbers are whispered into the chamber and
 * the room "echoes" back the next number in the sequence. This application
 * solves the puzzle by detecting arithmetic progressions and predicting
 * the next value, while storing all previous echoes as "memories".
 *
 * Usage:
 *   node index.js
 *
 * The application will run built-in test cases automatically.
 * To use interactively, call the exported functions directly.
 */

// ─── Memories Store ──────────────────────────────────────────────────────────

/**
 * The Echo Chamber's memory: stores all sequences that have been echoed,
 * along with their predicted next values.
 *
 * Each entry has the shape:
 *   { sequence: number[], prediction: number, timestamp: Date }
 */
const echoMemories = [];

// ─── Core Logic ──────────────────────────────────────────────────────────────

/**
 * Validates that an array is a valid arithmetic progression.
 *
 * An arithmetic progression (AP) is a sequence where the difference between
 * consecutive terms is constant (the "common difference").
 * Examples: [3, 6, 9, 12] → diff = 3  ✓
 *           [1, 2, 4, 8]  → diff varies ✗
 *
 * @param {number[]} sequence - The sequence to validate.
 * @returns {{ valid: boolean, commonDifference: number|null, error: string|null }}
 */
function validateArithmeticProgression(sequence) {
  // Must be an array
  if (!Array.isArray(sequence)) {
    return { valid: false, commonDifference: null, error: "Input must be an array." };
  }

  // Need at least 2 elements to determine a pattern
  if (sequence.length < 2) {
    return {
      valid: false,
      commonDifference: null,
      error: "Sequence must contain at least 2 numbers to detect a pattern.",
    };
  }

  // Every element must be a finite number
  for (let i = 0; i < sequence.length; i++) {
    if (typeof sequence[i] !== "number" || !isFinite(sequence[i])) {
      return {
        valid: false,
        commonDifference: null,
        error: `Element at index ${i} ("${sequence[i]}") is not a valid finite number.`,
      };
    }
  }

  // Verify constant difference throughout the sequence
  const commonDifference = sequence[1] - sequence[0];
  for (let i = 2; i < sequence.length; i++) {
    const diff = sequence[i] - sequence[i - 1];
    if (diff !== commonDifference) {
      return {
        valid: false,
        commonDifference: null,
        error:
          `Not an arithmetic progression: difference between index ${i - 1} and ${i} ` +
          `is ${diff}, but expected ${commonDifference}.`,
      };
    }
  }

  return { valid: true, commonDifference, error: null };
}

/**
 * Predicts the next number in an arithmetic progression and records the
 * echo in the chamber's memory.
 *
 * @param {number[]} sequence - A valid arithmetic progression.
 * @returns {{ prediction: number, commonDifference: number, memoryIndex: number }}
 * @throws {Error} If the sequence is not a valid arithmetic progression.
 */
function predictNextEcho(sequence) {
  const validation = validateArithmeticProgression(sequence);

  if (!validation.valid) {
    throw new Error(`Invalid sequence: ${validation.error}`);
  }

  const { commonDifference } = validation;
  const prediction = sequence[sequence.length - 1] + commonDifference;

  // Store this echo in the chamber's memory
  const memory = { sequence: [...sequence], prediction, timestamp: new Date() };
  echoMemories.push(memory);

  return { prediction, commonDifference, memoryIndex: echoMemories.length - 1 };
}

/**
 * Returns a read-only copy of all echo memories stored in the chamber.
 *
 * @returns {Array<{ sequence: number[], prediction: number, timestamp: Date }>}
 */
function getEchoMemories() {
  return echoMemories.map((m) => ({ ...m, sequence: [...m.sequence] }));
}

// ─── Display Helpers ─────────────────────────────────────────────────────────

/** Renders a decorative section header to the console. */
function printHeader(title) {
  const line = "═".repeat(60);
  console.log(`\n╔${line}╗`);
  console.log(`║  ${title.padEnd(58)}║`);
  console.log(`╚${line}╝`);
}

/** Renders the Echo Room story introduction. */
function printStory() {
  console.log(`
  🔮  Welcome to the Echo Chamber  🔮
  ════════════════════════════════════

  Deep within an ancient mystical tower lies the Echo Room —
  a chamber that remembers every number ever whispered into it.

  Legend says: whisper a sequence of numbers into the chamber,
  and it will echo back the next number in the pattern...
  if you can prove the sequence follows a magical arithmetic law.

  The chamber also keeps eternal "memories" of every sequence
  it has ever echoed, so the magic is never forgotten.

  Let us test its power!
`);
}

/**
 * Runs a single sequence through the Echo Chamber and prints the result.
 *
 * @param {number[]} sequence - The sequence to test.
 * @param {string} [label] - Optional label for the test case.
 */
function runTest(sequence, label) {
  const tag = label ? `[${label}]` : "";
  const display = Array.isArray(sequence) ? `[${sequence.join(", ")}]` : JSON.stringify(sequence);
  console.log(`\n  ${tag} Sequence: ${display}`);

  try {
    const { prediction, commonDifference, memoryIndex } = predictNextEcho(sequence);
    console.log(`  ✅  Echo: The next number is → ${prediction}`);
    console.log(`       Common difference: ${commonDifference}`);
    console.log(`       Stored as memory #${memoryIndex + 1}`);
  } catch (err) {
    console.log(`  ❌  The chamber rejects this sequence!`);
    console.log(`       Reason: ${err.message}`);
  }
}

/** Prints all memories currently stored in the Echo Chamber. */
function printMemories() {
  printHeader("Echo Chamber Memories");
  const memories = getEchoMemories();

  if (memories.length === 0) {
    console.log("  (The chamber holds no memories yet.)");
    return;
  }

  memories.forEach((mem, i) => {
    console.log(
      `\n  Memory #${i + 1}  [${mem.timestamp.toISOString()}]`
    );
    console.log(`    Sequence : [${mem.sequence.join(", ")}]`);
    console.log(`    Predicted: ${mem.prediction}`);
  });
}

// ─── Main Entry Point ─────────────────────────────────────────────────────────

/**
 * Runs the full Echo Chamber demo:
 *   1. Prints the story introduction.
 *   2. Tests the sample sequence [3, 6, 9, 12].
 *   3. Runs additional test cases (positive, negative, zero-diff, edge cases).
 *   4. Demonstrates error handling for invalid sequences.
 *   5. Prints all stored memories.
 */
function main() {
  printStory();

  // ── Part 1: Sample sequence from the puzzle ──────────────────────────────
  printHeader("Sample Sequence Test");
  runTest([3, 6, 9, 12], "Sample");

  // ── Part 2: Additional arithmetic progressions ───────────────────────────
  printHeader("Additional Arithmetic Progressions");
  runTest([10, 20, 30, 40],       "Diff +10");
  runTest([100, 75, 50, 25],      "Descending diff -25");
  runTest([0, 0, 0, 0],           "Zero diff (constant)");
  runTest([-5, -3, -1, 1, 3],     "Negative start, diff +2");
  runTest([1, 1.5, 2, 2.5],       "Fractional diff +0.5");
  runTest([7],                    "Single element (too short)");
  runTest([42, 42],               "Two equal elements, diff 0");

  // ── Part 3: Error-handling edge cases ────────────────────────────────────
  printHeader("Error Handling & Edge Cases");
  runTest([1, 2, 4, 8],           "Geometric (not AP)");
  runTest([1, 3, 6, 10],          "Triangular numbers (not AP)");
  runTest([1, "two", 3],          "Non-numeric element");
  runTest([],                     "Empty array");
  runTest("not an array",         "String instead of array");

  // ── Part 4: Memory recap ─────────────────────────────────────────────────
  printMemories();

  console.log("\n  🔮  The Echo Chamber rests... until next time.\n");
}

main();

// ─── Exports (for use as a module) ───────────────────────────────────────────
module.exports = { predictNextEcho, validateArithmeticProgression, getEchoMemories };
