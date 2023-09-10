import { createGlobalStyle } from "styled-components";
import { blackMode } from "./atom";
import { useRecoilValue } from "recoil";

const { default: Router } = require("./Router")

const GlobalStyle = createGlobalStyle`
    body {
        margin: 0;
        padding: 0;
        font-family: 'Helvetica Neue', sans-serif;
        color: ${(props) => props.active ? `#fff` : `#333`};
        background-color: ${(props) => props.active ? `#333` : `#fff`}
  },
    button {
        color: ${(props) => props.active ? `#fff` : `#333`};
        background-color: ${(props) => props.active ? `#333` : `#fff`}
    }
`

const App = () => {
    const mode = useRecoilValue(blackMode)
    return (
        <>
            <GlobalStyle active={mode} />
            <Router />
        </>
    )
}

export default App;