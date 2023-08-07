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

export const loading = atom({
    key: "loader",
    default: false
})

export const blackMode = atom({
    key: "mode",
    default: true
})

export const pointCount = atom({
    key: "count",
    default: 100
})
