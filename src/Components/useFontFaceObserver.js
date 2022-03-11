import { useEffect } from "react";
import FontFaceObserver from "fontfaceobserver";
import { useReducer, useRef } from "react";

export default function useFontFaceObserver(fonts) {
    const [fontStates, updateFontStates] = useReducer(
        (currState, action) => ({ ...currState, ...action }),
        {}
    );
    const loadCount = useRef(0);
    useEffect(() => {
        let result = {};
        fonts.forEach(({ family: fontName, variant }) => {
            result[fontName] = "loading";
            let observer = new FontFaceObserver(fontName, variant);
            observer
                .load()
                .then(() => {
                    loadCount.current += 1;
                    updateFontStates({
                        [fontName]: "loaded",
                    });
                })
                .catch(() => {
                    loadCount.current += 1;
                    updateFontStates({
                        [fontName]: "error",
                    });
                });
        });
        return () => {
            loadCount.current = 0;
        };
    }, []);
    return { fontStates, total: loadCount.current };
}
