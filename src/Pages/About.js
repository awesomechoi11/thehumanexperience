import { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { useRecoilState } from "recoil";
import { overlayHelperSelector } from "../Components/Atoms/main";
import "./styles.scss";
import { LocomotiveScrollProvider } from "react-locomotive-scroll";
import { motion, MotionConfig, useAnimation } from "framer-motion";
import StaggerLines from "../Components/StaggerLines";

/*

    About page!!!


*/

const line1Variants = {
    hidden: {
        width: 0,
    },
    visible: {
        width: 420,
        transition: {
            delay: 0.2,
            duration: 1.2,
        },
    },
};
const line2Variants = {
    hidden: {
        width: 0,
    },
    visible: {
        width: 762,
        transition: {
            delay: 0.8,
            ease: [0.33, 0, 0.3, 1],
            duration: 2,
        },
    },
};
const bothVars = {
    hidden: {
        opacity: 0,
        y: "100%",
    },
    visible: {
        opacity: 1,
        y: "0%",
    },
};
const paragraphVariants = {
    hidden: {
        opacity: 0,
        // y: "100%",
    },
    visible: {
        opacity: 1,
        // y: "0%",
        transition: {
            staggerChildren: 0.12,
            delay: 0.6,
        },
    },
};
const plineVariants = {
    hidden: {
        y: "100%",
    },
    visible: {
        y: "0%",
        transition: {
            ease: [0.33, 0, 0.3, 1],
            duration: 1.4,
        },
    },
};
const nameLineVariants = {
    hidden: {
        y: "100%",
    },
    visible: {
        y: "0%",
        transition: {
            ease: [0.33, 0, 0.3, 1],
            duration: 1.4,
        },
    },
};
const nameVariants = {
    hidden: {
        opacity: 0,
    },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.3,
            delay: 0.2,
        },
    },
};

let images = [
    {
        img: "https://cdn.bmschoi.dev/chrisorozco/misc/portrait.jpg",
        name: "portrait",
        vars: {
            hidden: {
                opacity: 0,
                y: "-40%",
                transition: {
                    ease: [0.33, 0, 0.3, 1],
                    duration: 1.4,
                },
            },
            visible: {
                opacity: 1,
                y: "0%",
                transition: {
                    delay: 0.1,
                    ease: [0.33, 0, 0.3, 1],
                    duration: 1.4,
                },
            },
        },
        parallax: {
            "data-scroll": true,
            "data-scroll-speed": 1.5,
        },
    },
    {
        img: "https://cdn.bmschoi.dev/chrisorozco/misc/noise.png",
        name: "noise",
        vars: {
            hidden: {
                opacity: 0,
                y: "-100%",
                transition: {
                    ease: [0.33, 0, 0.3, 1],
                    duration: 1.4,
                },
            },
            visible: {
                opacity: 1,
                y: "0%",
                transition: {
                    delay: 0.6,
                    ease: [0.33, 0, 0.3, 1],
                    duration: 1.4,
                },
            },
        },
        parallax: {
            "data-scroll": true,
            "data-scroll-speed": 2,
        },
    },
    {
        img: "https://cdn.bmschoi.dev/chrisorozco/misc/abstract.jpg",
        name: "abstract",
        vars: {
            hidden: {
                opacity: 0,
                y: "-100%",
                transition: {
                    ease: [0.33, 0, 0.3, 1],
                    duration: 1.4,
                },
            },
            visible: {
                opacity: 1,
                y: "0%",
                transition: {
                    delay: 0.5,
                    ease: [0.33, 0, 0.3, 1],
                    duration: 1.4,
                },
            },
        },
        parallax: {
            "data-scroll": true,
            "data-scroll-speed": 1.5,
        },
    },
];

export default function AboutPage() {
    let history = useHistory();
    const [animState, setAnimState] = useState("intro1");
    const [uwu, setOverlay] = useRecoilState(overlayHelperSelector);
    const containerRef = useRef(null);

    const mainController = useAnimation();

    useEffect(() => {
        setOverlay({
            command: "set",
            options: {
                top: {
                    visible: false,
                    message: "• about me • chris orozco ",
                },
                bottom: {
                    visible: true,
                    message: "• back to home ",
                    onClick: () => {
                        setOverlay({
                            command: "toggleOverlay",
                            options: { visible: false },
                        });
                        setAnimState("home");
                        mainController.start("hidden");
                        setTimeout(() => {
                            history.push("/");
                        }, 1700);
                    },
                },
            },
        });

        mainController.start("visible");
    }, []);
    return (
        <MotionConfig
            transition={{
                duration: 0.8,
                ease: [0.28, 0, 0.4, 1],
            }}
        >
            <LocomotiveScrollProvider
                options={{
                    smooth: true,
                    lerp: 0.06,
                    // ... all available Locomotive Scroll instance options
                }}
                containerRef={containerRef}
            >
                <div
                    id="about-page"
                    className="page"
                    data-scroll-container
                    ref={containerRef}
                >
                    <div className="top-wrapper">
                        <div className="top-inner">
                            <div className="left">
                                <motion.div
                                    initial="hidden"
                                    animate={mainController}
                                    variants={line1Variants}
                                    id="line1"
                                    className="abs"
                                />
                                <motion.div
                                    initial="hidden"
                                    animate={mainController}
                                    variants={line2Variants}
                                    id="line2"
                                    className="abs"
                                />
                                <motion.div
                                    initial={{
                                        y: -50,
                                    }}
                                    animate={{
                                        y: 0,
                                    }}
                                >
                                    {images.map(
                                        (
                                            {
                                                img,
                                                name: imgname,
                                                vars,
                                                parallax,
                                            },
                                            index
                                        ) => (
                                            <div
                                                id={imgname}
                                                className="img-wrapper abs"
                                                {...parallax}
                                            >
                                                <motion.img
                                                    src={img}
                                                    alt="uwu"
                                                    initial="hidden"
                                                    animate={mainController}
                                                    variants={vars}
                                                />
                                            </div>
                                        )
                                    )}
                                </motion.div>
                            </div>
                            <div className="right">
                                <StaggerLines
                                    lines={["chris", "orozco"]}
                                    childVariants={nameLineVariants}
                                    parentVariants={nameVariants}
                                    parentProps={{
                                        className: "name",
                                        initial: "hidden",
                                        animate: mainController,
                                    }}
                                />

                                <StaggerLines
                                    lines={[
                                        "My interest in photography",
                                        "began in January 2013 on a trip",
                                        "to Japan. Inspiration was",
                                        "everywhere from the raucous",
                                        "Tsukiji Market at 3am to the",
                                        "peaceful streets of Nara",
                                        "where the deer roamed free.",
                                    ]}
                                    childVariants={plineVariants}
                                    parentVariants={paragraphVariants}
                                    parentProps={{
                                        initial: "hidden",
                                        animate: mainController,
                                        className: "description",
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="bottom-wrapper">
                        <StaggerLines
                            lines={["ANother day,", "another view"]}
                            parentProps={{
                                className: "title",
                                initial: "hidden",
                                animate: mainController,
                            }}
                            childVariants={nameLineVariants}
                            parentVariants={nameVariants}
                        />

                        <div className="body">
                            <motion.div
                                className="left"
                                initial="hidden"
                                animate={mainController}
                                variants={bothVars}
                            >
                                Glitzy, crowded Tokyo streets lit by neon signs.
                                Fairy-tale Kyoto landscapes dotted with temples
                                and gardens. Steaming bowls of ramen topped with
                                glistening pork belly. Freshly pounded mochi.
                                Ornate plates of a kaiseki meal all waiting to
                                be photographed.
                            </motion.div>
                            <motion.div
                                className="right"
                                initial="hidden"
                                animate={mainController}
                                variants={bothVars}
                            >
                                I'm currently focusing on taking portraits and
                                capturing candid moments in everyday
                                surroundings. I'm always looking to collaborate
                                with new people so drop me a line!
                            </motion.div>
                        </div>
                    </div>
                </div>
            </LocomotiveScrollProvider>
        </MotionConfig>
    );
}
