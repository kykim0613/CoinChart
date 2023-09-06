import { atom } from "recoil";
import styled from "styled-components";

export const Loader = styled.div`
    width: 100%;
    height: 100%;
    background: url('https://mblogthumb-phinf.pstatic.net/MjAxODEwMjNfNjAg/MDAxNTQwMjg2OTk2NTcw.mfWKPtzKVO1mJaBBIFKIkVBlMQQIF1Vc-yrlbbGaoP0g.KNJWAgMmhsfQrZI3n0UT-LMi_qpHAZls4qPMvbNaJBcg.GIF.chingguhl/Spinner-1s-200px.gif?type=w800') center no-repeat;
    position: absolute;
    top: 0;
    left: 0;
`

export const DateBtn = styled.button`
    width: 30px;
    height: 30px;
    border:none;
    border-radius: 30px;
    ${(props) => props.active && `border: 1px solid black`};
    margin-left: 1px;
    background-color:white;
    cursor: pointer;
`

export const DateContainer = styled.div`
    width: 100%;
    text-align:center;
`
export const DateInput = styled.input`
    width:130px;
    height:30px;
    font-size: 16px;
`

export const Controller = styled.button`
    width: 60px;
    height: 35px;
    border: 1px solid #000;
    border-radius: 4px;
    cursor: pointer;
    margin: 0 6px 0 5px;
    font-size: 16px;
`

export const ChangeBtn = styled.button`
    width: 130px;
    height: 40px;
    border: none;
    border-radius: 30px;
    color: ${(props) => props.active ? "#333" : "#fff"};
    background-color: ${(props) => props.active ? "#eee" : "#333"};
    cursor: pointer;
    :hover {
        background-color: ${(props) => props.active ? "#ccc" : "#555"};
    }
`

export const SliderBar = styled.input`
    width: 200px;
    height: 10px;
    appearance: none;
    border-radius: 5px;
    background: ${(props) => props.active ? "#ccc" : "#555"};
    cursor: pointer;
    &::-webkit-slider-thumb {
        appearance: none;
        width: 20px; /* 버튼 크기 조정 */
        height: 20px; /* 버튼 크기 조정 */
        background: ${(props) => props.active ? "#eee" : "#333"};
        border-radius: 50%;
        border: none;
        cursor: pointer;
      }
`

export const loading = atom({
    key: "load",
    default: false
})

export const blackMode = atom({
    key: "mode",
    default: true
})

export const selectedValue = atom({
    key: "count",
    default: 100
})
