import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { overlayHelperSelector } from "../Components/Atoms/main";
import InteractiveList from "../Components/InteractiveList/InteractiveList";
import { prismic_main_selector } from "../Components/Prismic/atoms";
import "./styles.scss";
/*

    Home page!!!


*/

const pageChangeDelay = 1700;

export default function HomePage() {
    let history = useHistory();
    const [animState, setAnimState] = useState("intro1");
    const [uwu, setOverlay] = useRecoilState(overlayHelperSelector);
    useEffect(() => {
        setTimeout(() => {
            setOverlay({
                command: "set",
                options: {
                    top: {
                        visible: true,
                        message: "• about me • chris orozco ",
                        onClick: () => {
                            setOverlay({
                                command: "toggleOverlay",
                                options: { visible: false },
                            });
                            setAnimState("aboutOutro1");
                            setTimeout(() => {
                                history.push("/about");
                            }, pageChangeDelay);
                        },
                    },
                    bottom: {
                        visible: true,
                        message: "• view more ",
                        onClick: () => {
                            setOverlay({
                                command: "toggleOverlay",
                                options: { visible: false },
                            });
                            setAnimState("view");
                        },
                    },
                },
            });
        }, 1800);
        setAnimState("intro2");
        setTimeout(() => {
            setAnimState("default");
        }, 1400);
    }, []);

    const prismic_main = useRecoilValue(prismic_main_selector);
    if (prismic_main === "main") {
        return <div>pls reload!</div>;
    } else if (prismic_main === "project") {
        return <div>wtf what</div>;
    }
    return (
        <div id="home-page" className="page">
            <InteractiveList
                animState={animState}
                setAnimState={setAnimState}
                setOverlay={setOverlay}
                pageChangeDelay={pageChangeDelay}
                prismic_main={prismic_main}
            />
        </div>
    );
}
