const FULL_TURN = 360;

/** Degrees per segment for n equal slices. */
export function segmentAngle(count: number): number {
  if (count <= 0) return 0;
  return FULL_TURN / count;
}

/**
 * Wheel SVG is drawn with segment 0 starting at 12 o'clock, clockwise.
 * Pointer is fixed at 12 o'clock. Returns final rotation (deg) so segment `winnerIndex`
 * center aligns under the pointer, plus extra full spins.
 */
export function computeStopRotation(
  winnerIndex: number,
  segmentCount: number,
  currentRotation: number,
  extraSpins = 6
): number {
  if (segmentCount <= 0) return currentRotation;

  const slice = segmentAngle(segmentCount);
  // Center of winner segment at 12 o'clock when rotation = -winnerIndex * slice - slice/2
  const targetMod = (-winnerIndex * slice - slice / 2 + FULL_TURN * 10) % FULL_TURN;
  const currentMod = ((currentRotation % FULL_TURN) + FULL_TURN) % FULL_TURN;
  let delta = targetMod - currentMod;
  if (delta <= 0) delta += FULL_TURN;

  return currentRotation + extraSpins * FULL_TURN + delta;
}

export function pickRandomIndex(count: number): number {
  return Math.floor(Math.random() * count);
}
