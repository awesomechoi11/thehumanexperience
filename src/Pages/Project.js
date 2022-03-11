import { useEffect, useRef, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
    overlayHelperSelector,
    previousProject,
} from "../Components/Atoms/main";
import { prismic_project_selector } from "../Components/Prismic/atoms";
import MasonGrid from "../Components/MasonGrid/MasonGrid";
import { LocomotiveScrollProvider } from "react-locomotive-scroll";
import { motion } from "framer-motion";
import IndLetter from "../Components/IntLetters";

const pageChangeDelay = 1700;

export default function ProjectPage() {
    let history = useHistory();
    const [uwu, setOverlay] = useRecoilState(overlayHelperSelector);
    const [animState, setAnimState] = useState("hidden");
    const setPreviousProject = useSetRecoilState(previousProject);
    const containerRef = useRef(null);
    let { projectID } = useParams();
    const projectData = useRecoilValue(prismic_project_selector(projectID));

    const [masonHeight, setMasonHeight] = useState(0);
    useEffect(() => {
        setPreviousProject(projectID);

        setTimeout(() => {
            setOverlay({
                command: "set",
                options: {
                    top: {
                        visible: true,
                        message: "• back to home ",
                        onClick: () => {
                            setOverlay({
                                command: "toggleOverlay",
                                options: { visible: false },
                            });
                            setAnimState("hidden");
                            setTimeout(() => {
                                history.push("/");
                            }, pageChangeDelay);
                        },
                    },
                    bottom: {
                        visible: false,
                        message: "• view more ",
                    },
                },
            });
        }, 300);
        setAnimState("visible");
    }, []);

    if (projectData === "main") {
        return <div>please refrehs</div>;
    } else if (projectData === "project") {
        return <div>404 error!!</div>;
    }
    // // console.log(projectData);
    return (
        <LocomotiveScrollProvider
            options={{
                smooth: true,
                lerp: 0.06,
                getSpeed: true,
                // ... all available Locomotive Scroll instance options
            }}
            containerRef={containerRef}
        >
            <div
                id="project-page"
                className="page"
                data-scroll-container
                ref={containerRef}
            >
                <div className="centered-card-wrapper">
                    <motion.img
                        src={projectData.cover}
                        alt={projectData.title}
                        className="inner"
                        variants={{
                            hidden: {
                                opacity: 0,
                            },
                            visible: {
                                opacity: 1,
                            },
                        }}
                        initial={"visible"}
                        animate={animState}
                    />
                    <div className="project-title">
                        <IndLetter
                            phrase={projectID}
                            visible={animState === "visible"}
                            rtl={false}
                        />
                    </div>
                </div>
                <div
                    data-scroll-target
                    id="dummy"
                    style={{
                        height: masonHeight,
                    }}
                >
                    <motion.div
                        className="mason-wrapper"
                        data-scroll
                        data-scroll-sticky
                        data-scroll-position="top"
                        data-scroll-target="#dummy"
                        variants={{
                            hidden: {
                                opacity: 0,
                            },
                            visible: {
                                opacity: 1,
                            },
                        }}
                        initial="hidden"
                        animate={animState}
                    >
                        <MasonGrid
                            projectData={projectData}
                            setMasonHeight={setMasonHeight}
                        />
                    </motion.div>
                </div>
            </div>
        </LocomotiveScrollProvider>
    );
}
