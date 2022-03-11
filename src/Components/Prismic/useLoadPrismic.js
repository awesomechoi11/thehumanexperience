import { useEffect, useRef, useState } from "react";
import Prismic from "@prismicio/client";
import { useSetRecoilState } from "recoil";
import { prismic_main_atom } from "./atoms";

export default function useLoadPrismic(query) {
    let [loaded, setLoaded] = useState(false);
    let setMain = useSetRecoilState(prismic_main_atom);
    let client = useRef(null);
    useEffect(() => {
        client.current = Prismic.client(
            "https://thehumanexperience.prismic.io/api/v2"
        );
        client.current
            .query(query || Prismic.Predicates.at("document.type", "project"))
            .then((res) => {
                // console.log(res);
                setMain(res);
                setLoaded(true);
            });
    }, [query]);
    return loaded;
}
