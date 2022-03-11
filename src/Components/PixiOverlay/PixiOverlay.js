import { motion, MotionConfig } from "framer-motion";
import { useRecoilValue } from "recoil";
import { pixiOverlay_atom } from "../Atoms/main";
import PixiBanner from "./PixiBanner/PixiBanner";
import "./styles.scss";

const pixiVariants = {
    top: {
        hidden: {
            y: -100,
        },
        visible: {
            y: 0,
        },
    },
    bottom: {
        hidden: {
            y: 100,
        },
        visible: {
            y: 0,
        },
    },
};

export default function PixiOverlay() {
    const pixiOverlay = useRecoilValue(pixiOverlay_atom);

    return (
        <div className="canvas-container">
            <MotionConfig
                transition={{
                    ease: [0.46, 0.06, 0.32, 0.99],
                    duration: 1.8,
                    // delay: 0,
                }}
            >
                <motion.div
                    className="top"
                    variants={pixiVariants.top}
                    initial="hidden"
                    animate={pixiOverlay.top.visible ? "visible" : "hidden"}
                    onClick={pixiOverlay.top.onClick}
                >
                    <PixiBanner message={pixiOverlay.top.message} speed={0.4} />
                </motion.div>
                <motion.div
                    className="bottom"
                    variants={pixiVariants.bottom}
                    initial="hidden"
                    animate={pixiOverlay.bottom.visible ? "visible" : "hidden"}
                    onClick={pixiOverlay.bottom.onClick}
                >
                    <PixiBanner
                        message={pixiOverlay.bottom.message}
                        speed={0.4}
                        direction="left"
                    />
                </motion.div>
            </MotionConfig>
        </div>
    );
}
