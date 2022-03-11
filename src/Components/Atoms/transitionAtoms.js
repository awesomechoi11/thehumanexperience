import { atom, atomFamily, selector } from "recoil";

// main transition
export const transition_atom = atom({
    key: "transition_atom", // unique ID (with respect to other atoms/selectors)
    default: {
        from: undefined, // transitionIDs of pages
        to: undefined,
    },
});

export const transition_selector = selector({
    key: "transition_selector",
    get: ({ get }) => {
        const transitionAtom = get(transition_atom);
        const transitionFrom = get(transition_atomFamily(transitionAtom.from));
        const transitionTo = get(transition_atomFamily(transitionAtom.to));
        return {
            transitionFrom,
            transitionTo,
            ...transitionAtom,
        };
    },
    set: ({ set, get }, newTransitionToID) => {
        // input exists
        if (!newTransitionToID)
            throw Error(
                "transition selector set : input does not exist!!!!!!!!!!"
            );
        const oldTransitionAtom = get(transition_atom);

        // prevent needless rerenders
        if (oldTransitionAtom.to === newTransitionToID) return;

        set(transition_atom, {
            from: oldTransitionAtom.to,
            to: newTransitionToID,
        });
    },
});

// transition sequences are
// just timed executions
// of atom changes or watever

export const transition_atomFamily = atomFamily({
    key: "transition_atomFamily",
    default: {
        in: undefined,
        out: undefined,
    },
});
