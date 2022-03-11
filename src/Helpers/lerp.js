export default function lerp(v0, v1, t, maxDiff = 0.01) {
    return Math.abs(v0 - v1) < maxDiff ? v1 : (1 - t) * v0 + t * v1;
}
