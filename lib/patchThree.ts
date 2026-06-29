// THREE.Clock was deprecated in r183. @react-three/fiber v9 still uses it
// internally (no fix shipped yet), and the Three.js ESM namespace is sealed so
// THREE.Clock cannot be reassigned. Filter the specific deprecation warn from
// the console instead, until r3f migrates to THREE.Timer.
const _warn = console.warn.bind(console);
console.warn = function (...args: unknown[]) {
  if (typeof args[0] === 'string' && args[0].includes('THREE.Clock') && args[0].includes('deprecated')) {
    return;
  }
  _warn(...(args as Parameters<typeof console.warn>));
};
