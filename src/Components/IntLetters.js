import clsx from "clsx";
import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";

const wrapperVariants = {
    hiddenRTL: {
        x: 20,
        opacity: 0,
    },
    hiddenLTR: {
        x: -20,
        opacity: 0,
    },
    visible: {
        x: 0,
        opacity: 1,
    },
};
const letterVariants = {
    hiddenRTL: {
        x: "100%",
    },
    hiddenLTR: {
        x: "-100%",
    },
    visible: {
        x: 0,
    },
};

export default function IndLetter({
    phrase,
    visible,
    rtl,
    className,
    ...props
}) {
    var controls = useAnimation();

    useEffect(() => {
        let hidden = "hidden" + (rtl ? "RTL" : "LTR");
        if (visible) {
            controls.set(hidden);
            controls.start("visible");
        } else {
            controls.start(hidden);
        }
    }, [visible]);

    return (
        <motion.div
            {...props}
            variants={wrapperVariants}
            initial="hidden"
            animate={controls}
            transition={{
                duration: 1,
            }}
            className={clsx("indLetter", className)}
        >
            {Array.from(phrase).map((letter, index) => (
                <div className="letter-wrapper" key={index}>
                    <motion.div
                        variants={letterVariants}
                        initial="hidden"
                        animate={controls}
                        transition={{
                            ease: [0.4, 0.93, 0.46, 1],
                            duration: 0.8,
                            delay: index * 0.14 + 0.1,
                        }}
                        className="letter"
                    >
                        {letter}
                    </motion.div>
                </div>
            ))}
        </motion.div>
    );
}
