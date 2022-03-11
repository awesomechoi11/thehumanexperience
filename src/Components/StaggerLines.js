import { motion } from "framer-motion";

export default function StaggerLines({
    lines,
    childVariants,
    childProps,
    parentVariants,
    parentProps,
}) {
    return (
        <motion.div {...parentProps} variants={parentVariants}>
            {lines.map((line) => (
                <div>
                    <motion.div variants={childVariants} {...childProps}>
                        {line}
                    </motion.div>
                </div>
            ))}
        </motion.div>
    );
}
