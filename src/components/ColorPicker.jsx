import React, { useRef, useState, useContext, useEffect } from "react";
import { Swatch } from "@swc-react/swatch";
import { NumberField } from '@swc-react/number-field';
import { WC } from "./WC";

import "./ColorPicker.css";

export function ColorPicker({onChange, onInput, color = "#000000ff", id, allowAlpha = true} = {}) {
    const colorRef = useRef();
    const swatchRef = useRef();
    const opacityRef = useRef();

    function showPicker() {
        colorRef.current.click();
    }

    const colorForInput = color.substring(0,7);
    const alpha = color.length > 7 ? (parseInt(color.substring(7,9), 16) / 255) : 1;

    function getColor() {
        const color = `${colorRef.current.value}${(Math.max(0,Math.min(255,Math.floor(opacityRef.current.value * 255)))).toString(16).padStart(2,"0")}`;
        return color;
    }
    function fireInput() {
        if (onInput) onInput(getColor());
    }
    function fireChange() {
        if (onChange) onChange(getColor());
    }

    return <span className="color-swatch-picker">
        <Swatch id={id} onClick={showPicker} color={colorForInput} ref={swatchRef}></Swatch>
        <input value={colorForInput} onChange={fireChange} onInput={fireInput} ref={colorRef} type="color" style={{opacity: 0}}/>
        {allowAlpha && 
            <WC onInput={fireInput} onChange={fireChange}>
                <NumberField ref={opacityRef} min={0} max={1} value={alpha} formatOptions={{style: "percent"}} />
            </WC>
        }
    </span>;
}