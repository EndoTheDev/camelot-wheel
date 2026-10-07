// Worker-side key detection via essentia.js (vendored UMD build, WASM embedded).
// The WASM module is ~2.5MB, so this worker + its vendor scripts load only
// when the user actually presses record - the initial page stays featherweight.
//
// The vendor files are CommonJS-style (bare `exports.EssentiaWASM = Module`),
// so the worker globals they expect are declared before importScripts. The
// core file lands `var Essentia` on the worker global scope the same way.
//
// Message protocol (from the composable):
//   { type: 'analyze', samples: Float32Array, sampleRate: number }
// Response:
//   { type: 'result', key, scale, strength }  or  { type: 'error', message }

self.module = { exports: {} };
self.exports = self.module.exports;

importScripts('./vendor/essentia-wasm.umd.js');
const WASM = self.module.exports.EssentiaWASM;

importScripts('./vendor/essentia.js-core.js');
const EssentiaClass = self.Essentia;

let essentia = null;

self.onmessage = (e) => {
  if (e.data.type !== 'analyze') return;
  const { samples, sampleRate } = e.data;
  try {
    if (!essentia) essentia = new EssentiaClass(WASM);
    // KeyExtractor wants its own VectorFloat type; the wasm module ships a
    // converter (arrayToVector). Passing raw JS arrays makes embind stringify them.
    const vf = WASM.arrayToVector(Array.from(samples));
    // KeyExtractor(audio, avgDetuning, frameSize, hopSize, hpcpSize, maxFreq,
    //              maxPeaks, minFreq, pcpThreshold, profileType, sampleRate, ...)
    // 10 undefineds keep every default, then the recording's real sample rate
    // so tuning/Hz estimates match the mic instead of the 44100 default.
    const out = essentia.KeyExtractor(
      vf, undefined, undefined, undefined, undefined, undefined,
      undefined, undefined, undefined, undefined, sampleRate,
    );
    self.postMessage({
      type: 'result',
      key: out.key,
      scale: out.scale,
      strength: out.strength,
    });
  } catch (err) {
    self.postMessage({ type: 'error', message: String(err && err.message ? err.message : err) });
  }
};