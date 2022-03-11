import { useMemo, useRef } from "react";

function* makeRangeIterator(start = 0, end = 100, step = 1) {
    let iterationCount = 0;
    for (let i = start; i < end; i += step) {
        iterationCount++;
        yield i;
    }
    return iterationCount;
}

export function useRangeIterator(start = 0, end = Infinity, step = 1) {
    return useMemo(
        () => makeRangeIterator(start, end, step),
        [start, end, step]
    );
}
