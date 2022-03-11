import useLoadResources from "../Components/useLoadResources";
import useFontFaceObserver from "../Components/useFontFaceObserver";
import useLoadPrismic from "../Components/Prismic/useLoadPrismic";
import { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";

export default function Loading({ setLoaded }) {
    const [totalProgress, setTotalProgress] = useState(0);

    const progressController = useAnimation();
    const backgroundController = useAnimation();
    const {
        loaded: imgsloaded,
        progress: imgProgress,
        total: imgTotal,
    } = useLoadResources([
        "https://cdn.bmschoi.dev/chrisorozco/misc/noiseTile.png",
        "https://cdn.bmschoi.dev/chrisorozco/misc/noise.png",
        "https://cdn.bmschoi.dev/chrisorozco/misc/portrait.jpg",
        "https://cdn.bmschoi.dev/chrisorozco/misc/abstract.jpg",
        "https://images.prismic.io/thehumanexperience/0c913241-07c1-447a-b8ff-62814a5f2637_nature_SUFNXX4LxV.jpg?auto=compress,format&rect=0,64,600,778&w=472&h=612",
        "https://images.prismic.io/thehumanexperience/a04b858d-c73e-448d-91c9-1b5696153865_uwu_v9YmvBe43h.jpg?auto=compress,format&rect=0,64,600,778&w=472&h=612",
        "https://images.prismic.io/thehumanexperience/0ca52c61-c15d-42bb-94c0-9eeb0efd0a23_solace_TyIwWyKo-6.jpg?auto=compress,format&rect=0,64,600,778&w=472&h=612",
        "https://images.prismic.io/thehumanexperience/49d60819-935f-41a6-b5f6-37731dc9f251_statue_EOMGzmZKyv.jpg?auto=compress,format&rect=0,64,600,778&w=472&h=612",
        "https://images.prismic.io/thehumanexperience/ebf12c72-4459-4a60-8592-c1d1c6c5b542_industrial_JKgRELA--2.jpg?auto=compress,format&rect=0,64,600,778&w=472&h=612",
        "https://images.prismic.io/thehumanexperience/22bafd3c-f362-4f35-9e5f-c381be948656_mech_jYl6QgGmBF.jpg?auto=compress,format&rect=146,0,307,398&w=472&h=612",
        "https://images.prismic.io/thehumanexperience/fd0710aa-3bfb-44ba-8d71-69d0eb0eb3e0_animals_SQHW_6Iskd.jpg?auto=compress,format&rect=146,0,307,398&w=472&h=612",
        "https://images.prismic.io/thehumanexperience/071a8dd9-0184-45a6-8ad4-f09a632608e3_human__yM7buXAvS.jpg?auto=compress,format&rect=0,42,398,516&w=472&h=612",
        "https://images.prismic.io/thehumanexperience/6f549feb-ff67-4c85-9366-13d2b67f9600_geometric_qFF-XWBeK7.jpg?auto=compress,format&rect=146,0,307,398&w=472&h=612",
        "https://images.prismic.io/thehumanexperience/25e741a1-c788-4dee-b862-fe7c75bf9aa0_cozy_aSp84RazBm.jpg?auto=compress,format&rect=0,64,600,778&w=472&h=612",
    ]);
    const { total: fontTotal } = useFontFaceObserver([
        {
            family: "Rowdies",
            variant: {
                weight: 700,
            },
        },
        {
            family: "Inter",
            variant: {
                weight: 700,
            },
        },
    ]);
    const prismicLoaded = useLoadPrismic();

    useEffect(() => {
        let total = imgTotal + 3;
        let loaded = fontTotal + imgProgress + (prismicLoaded ? 1 : 0);
        // console.log(fontTotal, imgProgress);
        let p = (loaded / total) * 100;
        setTotalProgress(p);
        progressController
            .start({
                width: `${p}%`,
                opacity: 1 - loaded / total,
            })
            .then(() => {
                // console.log("poggies");
                if (p === 100)
                    backgroundController
                        .start({
                            opacity: 0,
                        })
                        .then(() => {
                            setLoaded(true);
                        });
            });
    }, [imgProgress, fontTotal, prismicLoaded]);

    return (
        <motion.div
            id="loading"
            initial={{ opacity: 1 }}
            animate={backgroundController}
        >
            <motion.div
                className="progress-bar"
                animate={progressController}
                transition={{
                    ease: "linear",
                    duration: 1.12,
                }}
            />
            <div className="progress-data">
                <div className="label">LOADING</div>
                <div>{`${Math.trunc(totalProgress)}%`}</div>
            </div>
        </motion.div>
    );
}
