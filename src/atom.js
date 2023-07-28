import { atom } from "recoil";
import styled from "styled-components";

export const Market = styled.h1`
    width: 100px;
    height: 100px;
    margin: 0 auto;
`

export const Loader = styled.div`
    width: 100%;
    height: 100%;
    background: url('https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif?20151024034921') center no-repeat;
    position: absolute;
    top: 0;
    left: 0;
`

export const loading = atom({
    key: "loader",
    default: false
})
