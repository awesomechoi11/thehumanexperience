import { useTick, Container, Text, useApp, Stage } from "@inlet/react-pixi";
import { useLayoutEffect, useReducer, useRef, useState } from "react";
import { TextStyle, TextMetrics, Rectangle } from "pixi.js";
import { BulgePinchFilter } from "pixi-filters";
import { useEffect, useMemo } from "react";
import lerp from "../../../Helpers/lerp";

// const Filters = withFilters(Container, {
//     dot: PIXI.filters.DotFilter,
//     blur: PIXI.filters.,
//   })

//https://fonts.googleapis.com/css2?family=Rowdies:wght@300;400;700&display=swap

const defaultTextStyle = new TextStyle({
    fontFamily: "Inter",
    fontSize: 24,
    fontWeight: 700,
    fill: "#ffffff", // gradient
    letterSpacing: 20,
});
const reducer = (currState, action) => ({ ...currState, ...action });

export default function PixiBanner({ ...props }) {
    return (
        <Stage
            options={{
                antialias: true,
                backgroundAlpha: 0,
            }}
            width={window.innerWidth}
            height={80}
        >
            <PixiBannerInner {...props} />
        </Stage>
    );
}

function PixiBannerInner({ message, percent, speed = 1, direction = "right" }) {
    const [xPos, setXPos] = useState(0);
    const [loading, update] = useReducer(reducer, {
        loaded: false,
        message,
        filterOn: false,
    });
    const app = useApp();
    function calculateBounds() {
        const bounds = TextMetrics.measureText(message, defaultTextStyle);
        let longMessage = "";
        let index;
        for (
            index = 0;
            index * bounds.width < window.innerWidth + bounds.width;
            index += 1
        ) {
            longMessage += message;
        }
        let longBounds = TextMetrics.measureText(longMessage, defaultTextStyle);
        let roundedWidth = Math.round(bounds.width);
        return {
            bounds,
            longBounds,
            message,
            longMessage,
            messageCount: index,
            xOffset: bounds.width * (direction === "right" ? -1 : 0),
            roundedWidth,
            base: percent ? 100 : roundedWidth,
        };
    }

    // uwuupdate message : recalculate boynds
    useLayoutEffect(() => {
        if (!loading.loaded) return;
        update(calculateBounds());
    }, [message]);

    const bulgeFilter = useMemo(() => {
        const filter = new BulgePinchFilter({
            padding: 20,
            strength: 0,
            radius: 200,
        });

        return filter;
    }, []);

    useLayoutEffect(() => {
        update({
            loaded: true,
            ...calculateBounds(),
        });
    }, []);

    const refs = useRef({
        iter: 0,
        filterStrength: 0,
        mouseX: 0,
        x: 0,
        alpha: 0.35,
    });

    const getMousePos = useMemo(
        () => () => app.renderer.plugins.interaction.mouse.global,
        [app]
    );

    useTick((delta) => {
        if (!loading.loaded) return;
        const { bounds, base, xOffset, filterOn } = loading;

        /** set displacement with direction **/
        let displacementPercent =
            (refs.current.iter / base) * (direction === "right" ? 1 : -1);
        // increment or reset
        refs.current.iter =
            refs.current.iter > base ? 0 : refs.current.iter + speed;

        /** set filter strength **/
        refs.current.filterStrength = lerp(
            refs.current.filterStrength,
            filterOn ? 0.4 : 0,
            0.1
        );
        bulgeFilter.strength = refs.current.filterStrength;

        /** set alpha strength **/
        refs.current.alpha = lerp(refs.current.alpha, filterOn ? 1 : 0.35, 0.1);
        setXPos(displacementPercent * bounds.width + xOffset);

        if (!filterOn) return;
        const { x: mx } = getMousePos();
        refs.current.mouseX = lerp(refs.current.mouseX, mx, 0.07);
        bulgeFilter.center = [refs.current.mouseX / window.innerWidth, 0.5];
    });

    function handleMouseMouse(e) {
        if (e.target) {
            update({
                filterOn: true,
            });
        } else {
            update({
                filterOn: false,
            });
        }
    }

    useEffect(() => {
        if (!app) return;

        function onResize() {
            const parent = app.view.parentNode;
            app.renderer.resize(parent.clientWidth, parent.clientHeight);
            update(calculateBounds());
        }
        window.addEventListener("resize", onResize);

        // app.registerPlugin()
        return () => {
            window.removeEventListener("resize", onResize);
        };
    }, [app]);

    return (
        <>
            {loading.loaded && (
                <Container
                    filters={[bulgeFilter]}
                    hitArea={new Rectangle(0, 0, window.innerWidth, 80)}
                    mousemove={handleMouseMouse}
                    interactive={true}
                    // mousedown={() => {
                    //     // // console.log("click!");
                    // }}
                    alpha={refs.current.alpha}
                >
                    <Container x={xPos}>
                        {[...Array(loading.messageCount)].map((i, ii) => (
                            <Text
                                key={ii}
                                text={loading.message}
                                x={loading.bounds.width * ii}
                                y={20}
                                style={defaultTextStyle}
                            />
                        ))}
                    </Container>
                </Container>
            )}
        </>
    );
}
