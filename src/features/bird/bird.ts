// Approved bird for /lab/bird-journey: "Hummingbird no Background" by Michael
// Mills, LottieFiles (https://lottiefiles.com/free-animation/hummingbird-no-background-XEfYomK8GX),
// Lottie Simple License. Played as-is from the original dotLottie file; the
// wing beat is the animation's own loop. See ASSET_LICENSES.md.

export const birdAsset = {
  src: "/lab/hummingbird/hummingbird.lottie",
  wasm: "/lab/hummingbird/dotlottie-player.wasm",
  /** Direction the artwork faces: 1 = right, -1 = left. */
  faces: 1 as 1 | -1,
};

/**
 * Which way the bird should face (1 right, -1 left) given its horizontal
 * movement this frame. Small movements keep the current facing so the bird
 * doesn't flicker while hovering.
 */
export function facing(dx: number, current: 1 | -1, deadzone = 0.0008): 1 | -1 {
  if (dx > deadzone) return 1;
  if (dx < -deadzone) return -1;
  return current;
}
