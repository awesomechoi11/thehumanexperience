import { Loader } from "pixi.js";
import { useLayoutEffect, useMemo, useReducer, useState } from "react";

export default function useLoadResources(
    resources,
    cb = () => {},
    loadpls = true
) {
    const loader = useMemo(() => new Loader(), []);

    const [data, setData] = useReducer(
        (currState, action) => {
            if (action === "inc") {
                return {
                    ...currState,
                    progress: currState.progress + 1,
                };
            } else {
                return { ...currState, ...action };
            }
        },
        {
            loaded: false,
            progress: 0,
            total: 0,
        }
    );

    useLayoutEffect(() => {
        if (!loadpls) return;
        let result = [];
        resources.forEach((imgLink) => {
            if (!result.includes(imgLink)) result.push(imgLink);
        });
        let total = result.length;
        setData({
            total: total,
        });
        loader.add(result).load(() => {
            setData({
                loaded: true,
            });
            cb();
        });
        loader.onLoad.add(() => {
            // console.log("img loaded", data);
            setData("inc");
        });
        return () => {
            //
            setData({
                loaded: false,
                progress: 0,
                total: 0,
            });
            loader.reset();
        };
    }, [loadpls]);
    return data;
}
