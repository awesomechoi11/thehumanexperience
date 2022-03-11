import {
    Container,
    Sprite,
    Stage,
    useTick,
    TilingSprite,
} from "@inlet/react-pixi";
import { MotionBlurFilter, RGBSplitFilter } from "pixi-filters";
import { filters } from "pixi.js";
import { Bezier } from "../bezier/bezier";
import { useMemo, useRef, useState } from "react";
import { useLocomotiveScroll } from "react-locomotive-scroll";
import lerp from "../../Helpers/lerp";
import useLoadResources from "../useLoadResources";

// need a list of images

export default function MasonGrid({
    columnCount = 2,
    spacing = 0,
    columnOffset,
    columnWidth = 600,
    projectData,
    setMasonHeight,
}) {
    const gridItems = useMemo(() => {
        // arrays with `columnCount` number of default values
        if (columnOffset && columnOffset.length !== columnCount)
            throw Error("columnOffset length does not match columnCount");
        let heightsArr = columnOffset || [...Array(columnCount).fill(0)];
        let itemsArr = [
            ...Array(columnCount)
                .fill(0)
                .map(() => []),
        ];
        projectData.images.forEach((item) => {
            // find which column to add item to,
            // should be column with least height
            let minV = Math.min(...heightsArr);
            let minVIndex = heightsArr.findIndex((v) => v === minV);

            itemsArr[minVIndex].push({
                ...item,
                yPos: heightsArr[minVIndex],
                xPos: minVIndex * columnWidth + columnWidth / 2,
            });
            heightsArr[minVIndex] +=
                (item.height * columnWidth) / item.width + spacing;
        });
        // need to set height for the dummy to create overflow for locomotive scroll
        let maxV = Math.max(...heightsArr);
        setMasonHeight(maxV + 300);

        return itemsArr;
    }, [
        projectData,
        columnWidth,
        columnCount,
        columnOffset,
        spacing,
        setMasonHeight,
    ]);

    const { scroll } = useLocomotiveScroll();

    return (
        <div className="pixi-mason-grid">
            <Stage
                options={{
                    antialias: true,
                    backgroundAlpha: 0,
                }}
                width={columnWidth * columnCount}
                height={window.innerHeight}
            >
                {scroll && gridItems && (
                    <GridItemWrapper
                        gridItems={gridItems}
                        scroll={scroll}
                        columnWidth={columnWidth}
                    />
                )}
            </Stage>
        </div>
    );
}

function GridItemWrapper({ gridItems, scroll, columnWidth }) {
    const yPosRef = useRef(0);
    const [lerpedYPos, setLerpedYPos] = useState(0);

    useTick(() => {
        // let scrollSpeed = scroll.scroll.instance.speed;
        yPosRef.current = Math.max(
            scroll.scroll.instance.delta.y - window.innerHeight * 0.8,
            0
        );
        if (yPosRef.current !== lerpedYPos) {
            setLerpedYPos(lerp(lerpedYPos, yPosRef.current, 0.085, 0.001));
        }
    });

    return (
        <Container>
            {gridItems &&
                gridItems.map((colData, colIndex) =>
                    colData.map((imageData, imageIndex) => (
                        <GridItem
                            {...imageData}
                            key={colIndex * 100 + imageIndex}
                            lerpedYPos={lerpedYPos}
                            yOffset={-lerpedYPos}
                            columnWidth={columnWidth}
                        />
                    ))
                )}
        </Container>
    );
}

function isBetween(low, high, value) {
    return high >= value && low <= value;
}
function isInView(height, scrollPos, yPos) {
    let windowHigh = window.innerHeight + scrollPos;
    let windowLow = scrollPos;

    let imageHigh = height + yPos;
    let imageLow = yPos;

    return (
        isBetween(windowLow, windowHigh, imageHigh) ||
        isBetween(windowLow, windowHigh, imageLow)
    );
}

const bezSteps = 100;
const imgBez = new Bezier(0, 0, 0.17, 0.67, 0.41, 1, 1, 1);
const imgBezLut = imgBez.getLUT(bezSteps);
const coolBez = {
    imgBezLut,
    imgBez,
};
function GridItem({
    imgUrl,
    yPos,
    xPos,
    height,
    width,
    lerpedYPos,
    yOffset,
    columnWidth,
}) {
    // neeed to calculate position based on col index and

    const { loaded: imgLoaded } = useLoadResources(
        [imgUrl],
        undefined,

        yPos - lerpedYPos < window.innerHeight * 1.4
    );
    let inView = useMemo(
        () => isInView(height, lerpedYPos, yPos),
        [lerpedYPos, height, yPos]
    );
    const sizedHeight = useMemo(
        () => (height * columnWidth) / width,
        [width, height, columnWidth]
    );
    const maxScale = 1;
    const [lerpedScale, setLerpedScale] = useState(1);

    const rgbfilter = useMemo(
        () => new RGBSplitFilter([0, 0], [0, 0], [0, 0]),
        []
    );
    const colorMatrixFilter = useMemo(
        () => new filters.ColorMatrixFilter(),
        []
    );
    const motionBlurFilter = useMemo(
        () => new MotionBlurFilter([0, 0], 15, 0),
        []
    );

    const [lerpedTileAlpha, setLerpedTileAlpha] = useState(1);

    useTick(() => {
        let tileAlpha = imgLoaded ? 0 : 1;
        if (tileAlpha !== lerpedTileAlpha)
            setLerpedTileAlpha(lerp(lerpedTileAlpha, tileAlpha, 0.085, 0.01));

        let screenYhalf = lerpedYPos + window.innerHeight * 0.56;

        let newScale;
        let newRGBsplit;
        if (screenYhalf > yPos) {
            newScale = maxScale;
            newRGBsplit = 0;
        } else {
            newRGBsplit = (yPos - screenYhalf) / (window.innerHeight * 0.85);

            let atmost99 = 98 - Math.floor(Math.min(newRGBsplit * 100, 98.99));
            newScale = coolBez.imgBezLut[atmost99].y * maxScale;
        }

        rgbfilter.red = [0, newRGBsplit * 10];
        rgbfilter.green = [0, newRGBsplit * -10];
        rgbfilter.blue = [newRGBsplit * -10, 0];

        colorMatrixFilter.greyscale(0.1);
        colorMatrixFilter.alpha = newRGBsplit * 1.3;

        motionBlurFilter.velocity = [0, newRGBsplit * 8];
        motionBlurFilter.offset = newRGBsplit * 10;

        if (lerpedScale !== newScale)
            setLerpedScale(lerp(lerpedScale, newScale, 0.085, 0.00001));
    });
    return (
        <>
            {imgLoaded && (
                <Sprite
                    image={imgUrl}
                    anchor={0.5}
                    position={[xPos, yPos + yOffset + height / 2]}
                    // roundPixels={true}
                    alpha={1 - lerpedTileAlpha}
                    width={columnWidth}
                    height={sizedHeight}
                    scale={{ x: lerpedScale, y: lerpedScale }}
                    visible={imgLoaded && inView}
                    filters={[rgbfilter, colorMatrixFilter, motionBlurFilter]}
                />
            )}

            <TilingSprite
                image={"https://cdn.bmschoi.dev/chrisorozco/misc/noiseTile.png"}
                anchor={0.5}
                position={[xPos, yPos + yOffset + height / 2]}
                alpha={lerpedTileAlpha}
                width={columnWidth}
                height={sizedHeight}
                scale={{ x: lerpedScale, y: lerpedScale }}
                visible={lerpedTileAlpha !== 0 && inView}
                filters={[rgbfilter, colorMatrixFilter, motionBlurFilter]}
            />
        </>
    );
}
