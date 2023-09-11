import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useRecoilValue } from "recoil";
import { selectedValue } from "../atom";
import createXAxis from "../components/axis/createXAxis";
import CallApi from "./CallApi";

const VolumeContainer = styled.div`
  width: 100vh;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
`;

const XAxis = ({ selected, start, end }) => {
  const [xAxis, setXAxis] = useState([]);
  const value = useRecoilValue(selectedValue);

  // yyyymmddhhmmss 형태로 만듬.
  useEffect(() => {
    setXAxis(createXAxis(start, end, value));
  }, [selected, start, end, value]);

  return (
    <>
      <VolumeContainer>
        <CallApi
          start={start}
          end={end}
          selected={selected}
          xAxis={xAxis}
        />
      </VolumeContainer>
    </>
  );
};

export default React.memo(XAxis);
