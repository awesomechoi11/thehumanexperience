import { atom, selector } from "recoil";

export const pixiOverlay_atom = atom({
    key: "pixiOverlay_atom", // unique ID (with respect to other atoms/selectors)
    default: {
        top: {
            visible: false,
            message: "• about me • chris orozco ",
            // onClick: () => {},
        },
        bottom: {
            visible: false,
            message: "• view more",
            // onClick: () => {},
        },
    },
});

const topBot = ["top", "bottom"];

export const overlayHelperSelector = selector({
    key: "overlayHelperSelector",
    get: () => {},
    set: ({ set, get }, { command, options }) => {
        if (!command) return;
        overlayHelpers[command](set, get, options);
    },
});

export const overlayHelpers = {
    toggleOverlay: (set, get, { side = "both", visible = true }) => {
        let overlayValues = get(pixiOverlay_atom);
        if (side === "both") {
            let result = {};
            topBot.forEach((key) => {
                result[key] = {
                    ...overlayValues[key],
                    visible,
                };
            });
            set(pixiOverlay_atom, result);
        } else {
            set(pixiOverlay_atom, {
                ...overlayValues,
                [side]: {
                    ...overlayValues[side],
                    visible,
                },
            });
        }
    },
    set: (set, get, options) => {
        set(pixiOverlay_atom, options);
    },
};

export const previousProject = atom({
    key: "previousProject",
    default: "naturae",
});
