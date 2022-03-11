import clsx from "clsx";
import { motion, MotionConfig } from "framer-motion";
import { useEffect, useMemo, useReducer, useState } from "react";
import { useHistory } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { previousProject } from "../Atoms/main";
import IndLetter from "../IntLetters";
import "./styles.scss";

const reducer = (currState, action) => ({ ...currState, ...action });

export default function InteractiveList({
    animState,
    pageChangeDelay,
    setAnimState,
    setOverlay,
    prismic_main,
}) {
    const [selectedState, updateSelectedState] = useReducer(reducer, {
        selected: -1,
        previous: null,
    });
    let history = useHistory();
    let previousProjectValue = useRecoilValue(previousProject);
    useEffect(() => {
        switch (animState) {
            case "intro1":
                setTimeout(() => {
                    updateSelectedState({
                        selected: prismic_main.findIndex(
                            (v) => v.name === previousProjectValue
                        ),
                    });
                }, 1800);
                break;
            case "about":
                updateSelectedState({
                    selected: null,
                });
                break;
            case "aboutOutro1":
                updateSelectedState({
                    selected: 0,
                });
                break;
            case "view":
                setTimeout(() => {
                    let selectedIndex = selectedState.selected;
                    let selectedName = prismic_main[selectedIndex].name;
                    if (!selectedName) return;
                    history.push(`/${selectedName}`);
                }, 2600);
                break;
            default:
                break;
        }
    }, [animState]);

    return (
        <MotionConfig
            transition={{
                ease: [0.46, 0.06, 0.32, 0.99],
                duration: 0.4,
                delay: 0,
            }}
        >
            <motion.div
                id="InteractiveList"
                onWheel={(e) => {
                    let direction = Math.sign(e.deltaY);
                    let max = prismic_main.length;
                    let min = 0;
                    let newIndex = selectedState.selected;
                    let prevIndex = selectedState.selected;
                    if (direction === -1) {
                        newIndex = Math.max(min, newIndex - 1);
                    } else {
                        newIndex = Math.min(max, newIndex + 1);
                    }
                    updateSelectedState({
                        selected: newIndex,
                        previous: prevIndex,
                    });
                }}
            >
                {prismic_main.map((imgdata, index) => {
                    return (
                        <ListItem
                            key={imgdata.name}
                            {...imgdata}
                            initial={false}
                            index={index}
                            onClick={() => {
                                if (index === selectedState.selected) {
                                    setOverlay({
                                        command: "toggleOverlay",
                                        options: { visible: false },
                                    });
                                    setAnimState("view");
                                    return;
                                }

                                updateSelectedState({
                                    selected: index,
                                    previous: selectedState.selected,
                                });
                            }}
                            animState={animState}
                            selectedState={selectedState}
                        />
                    );
                })}
            </motion.div>
        </MotionConfig>
    );
}

//active : left, open
//if not active - hover: currpos, preview

function makeAnim({ variantsArr, index }) {
    let xOffset = index * 82;

    let result = {};
    const listVariants = {
        preview: {
            width: 60,
            height: 450,
        },
        closed: {
            width: 50,
            height: 450,
        },
        open: {
            width: 472,
            height: 612,
        },
        left: {
            y: 100,
            x: 0,
        },
        right: {
            y: 100,
            x: 750,
        },
        rightStagger: {
            y: 100,
            x: 750,
            transition: {
                delay: 0.9 - index * 0.1,
                ease: [0.46, 0.06, 0.32, 0.99],
                duration: 0.8,
            },
        },
        topHidden: {
            y: -900,
            transition: {
                delay: index * 0.1,
                ease: [0.46, 0.06, 0.32, 0.99],
                duration: 0.8,
            },
        },
        topMiddle: {
            y: 0,
            x: window.innerWidth / 2 - 472 / 2 - 220 - xOffset,
            transition: {
                delay: 0.6,
                duration: 2,
                ease: [0.19, 0.01, 0.26, 1],
            },
        },
        rightHidden: {
            y: 100,
            x: 1900,
            transition: {
                delay: 0.9 - index * 0.1,
                ease: [0.46, 0.06, 0.32, 0.99],
                duration: 0.8,
            },
        },
        leftHidden: {
            y: 100,
            x: -1200,
        },
    };
    variantsArr.forEach((label) => {
        result = {
            ...result,
            ...listVariants[label],
        };
    });
    result.x += xOffset;
    return result;
}

function ListItem({ img, name, index, selectedState, animState, ...props }) {
    const { selected, previous } = selectedState;
    const [hovered, setHovered] = useState(false);

    let isSelected = index === selected;
    let rtl = useMemo(() => selected > (previous || 0), [isSelected]);

    let variantsArr = useMemo(() => {
        let result = [];
        switch (animState) {
            case "intro1":
                result = result.concat(["leftHidden", "closed"]);
                break;
            case "intro2":
                result = result.concat(["rightStagger", "closed"]);
                break;
            case "aboutOutro1":
                result = result.concat(["rightHidden", "closed"]);
                break;
            case "view":
                result.push(selected < index ? "right" : "left");
                if (isSelected) {
                    result = result.concat(["topMiddle", "open"]);
                } else {
                    result = result.concat(["topHidden", "closed"]);
                }
                break;
            default:
                result.push(selected < index ? "right" : "left");
                result.push(isSelected ? ["open"] : ["closed"]);
                if (hovered && !isSelected) result.push("preview");
                break;
        }
        return result;
    }, [animState, selectedState, hovered]);
    return (
        <motion.div
            {...props}
            custom={{ variantsArr, index }}
            animate={makeAnim}
            className={clsx("list-item", isSelected && "selected")}
            onMouseEnter={(e) => {
                e.stopPropagation();
                setHovered(true);
            }}
            onMouseLeave={(e) => {
                e.stopPropagation();
                setHovered(false);
            }}
        >
            <IndLetter
                className="title"
                visible={isSelected && animState !== "view"}
                rtl={rtl}
                phrase={name}
            />

            <img src={img} alt={name} />
        </motion.div>
    );
}
