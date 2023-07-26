import { useState } from "react";
import { Loader, loading } from "./atom";
import { useRecoilState } from "recoil";

const { default: Router } = require("./Router")

const App = () => {
    const loader = useRecoilState(loading)

    return (
        <>
            <Router />
        </>
    )
}

export default App;