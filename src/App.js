import "./global.scss";
import PixiOverlay from "./Components/PixiOverlay/PixiOverlay";
import HomePage from "./Pages/Home";
import { Route, Switch } from "react-router-dom";
import AboutPage from "./Pages/About";
import ProjectPage from "./Pages/Project";
import Loading from "./Pages/Loading";
import { useState } from "react";

//TODO useLoadResources for images

function App() {
    const [loaded, setLoaded] = useState(false);
    // // console.log(prismicLoaded);
    return (
        <div className="App">
            {!loaded ? (
                <Loading setLoaded={setLoaded} />
            ) : (
                <>
                    <PixiOverlay />
                    <Switch>
                        <Route path="/" exact>
                            <HomePage />
                        </Route>
                        <Route path="/about" exact>
                            <AboutPage />
                        </Route>
                        <Route path="/:projectID" exact>
                            <ProjectPage />
                        </Route>
                    </Switch>
                </>
            )}
        </div>
    );
}

export default App;
