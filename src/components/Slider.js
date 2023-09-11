import { useRecoilState, useRecoilValue } from "recoil"
import { SliderBar, blackMode, selectedValue } from "../atom"

const Slider = () => {
    const [value, setValue] = useRecoilState(selectedValue)
    const mode = useRecoilValue(blackMode)

    const handleSliderBar = (e) => {
        setValue(e.target.value)
    }

    return (
        <SliderBar
                active={mode}
                type="range"
                min="2"
                max="300"
                step="1"
                value={value}
                onChange={handleSliderBar}
            />
    )
}

export default Slider;