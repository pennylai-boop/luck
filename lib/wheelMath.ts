const FULL_TURN = 360;

/** 指針固定在 12 點鐘；與 conic-gradient / 標籤座標對齊的偏移 */
const POINTER_OFFSET = 90;

/** Degrees per segment for n equal slices. */
export function segmentAngle(count: number): number {
  if (count <= 0) return 0;
  return FULL_TURN / count;
}

/**
 * 扇區 0 起於 12 點鐘、順時針排列；指針固定於 12 點鐘。
 * 回傳最終旋轉角，使第 winnerIndex 扇區中心對準指針尖端下方。
 */
export function computeStopRotation(
  winnerIndex: number,
  segmentCount: number,
  currentRotation: number,
  extraSpins = 6,
  pointerOffset = POINTER_OFFSET
): number {
  if (segmentCount <= 0) return currentRotation;

  const slice = segmentAngle(segmentCount);
  const targetMod =
    (-winnerIndex * slice - slice / 2 + pointerOffset + FULL_TURN * 10) %
    FULL_TURN;
  const currentMod = ((currentRotation % FULL_TURN) + FULL_TURN) % FULL_TURN;
  let delta = targetMod - currentMod;
  if (delta <= 0) delta += FULL_TURN;

  return currentRotation + extraSpins * FULL_TURN + delta;
}

export function pickRandomIndex(count: number): number {
  return Math.floor(Math.random() * count);
}
