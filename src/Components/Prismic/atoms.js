import { atom, selector, selectorFamily } from "recoil";

export const prismic_main_atom = atom({
    key: "prismic_main_atom", // unique ID (with respect to other atoms/selectors)
    default: "", // default value (aka initial value)
});
export const prismic_project_selector = selectorFamily({
    key: "prismic_project_selector", // unique ID (with respect to other atoms/selectors)
    get:
        (projectName) =>
        ({ get }) => {
            let main = get(prismic_main_atom);
            if (!main) return "main";
            let project = main.results.find(
                (p) => p.data.name[0].text === projectName
            );
            if (!project) return "project";
            let title = project.data.name[0].text;
            let cover = project.data.cover_photo.url;
            let images = JSON.parse(project.data.imgarr);
            return {
                project,
                title,
                images,
                cover,
            };
        },
});
export const prismic_main_selector = selector({
    key: "prismic_main_selector",
    get: ({ get }) => {
        let main = get(prismic_main_atom);
        if (!main) return "main";

        let projects = main.results;
        if (!projects) return "project";
        return projects.map((projectData, projectIndex) => ({
            img: projectData.data.cover_photo.url,
            name: projectData.data.name[0].text,
        }));
    },
});
