import { useRecoilState } from "recoil";
import { blackMode } from "../atom";
import styled from "styled-components";

const Btn = styled.button`
    width: 180px;
    height: 60px;
    color: ${(props) => props.active ? "#333" : "#fff"};
    background-color: ${(props) => props.active ? "#ddd" : "#333"};
    position: fixed;
    bottom: 5%;
    right: 5%;
    border: none;
    border-radius: 50px;
    cursor: pointer;
    :hover {
        background-color: ${(props) => props.active ? "#ccc" : "#555"};;
    }
`

const ModeBtn = () => {
    const [btn, setBtn] = useRecoilState(blackMode)

    const handleModeBtn = () => {
        setBtn(!btn)
        console.log(btn)
    }

    return (
        <Btn active={btn} onClick={handleModeBtn}>{btn ? "라이트 모드" : "다크 모드"}</Btn>
    )
}

export default ModeBtn;