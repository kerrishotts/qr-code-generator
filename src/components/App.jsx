// To support: theme="express" scale="medium" color="light"
// import these spectrum web components modules:
import "@spectrum-web-components/theme/express/scale-medium.js";
import "@spectrum-web-components/theme/express/theme-light.js";
import "@spectrum-web-components/theme/scale-medium.js";
import "@spectrum-web-components/theme/theme-light.js";

// To learn more about using "swc-react" visit:
// https://opensource.adobe.com/spectrum-web-components/using-swc-react/
import { Button } from "@swc-react/button";
import { Textfield } from "@swc-react/textfield";
import { FieldLabel } from "@swc-react/field-label";
import { NumberField } from "@swc-react/number-field";
import { Radio, RadioGroup } from '@swc-react/radio';
import { Checkbox } from '@swc-react/checkbox';
import { Accordion, AccordionItem } from "@swc-react/accordion";
import { Link } from "@swc-react/link";
import { HelpText } from "@swc-react/help-text";
import { Theme } from "@swc-react/theme";
import { WC } from "./WC";

import React, { useState, useRef, useEffect } from "react";

import "./App.css";

import QRCodeStyling from "nvp-qr-code-styling";

const qrCode = new QRCodeStyling({
    type: "canvas",
    width: 1200,
    height: 1200,
});

const App = ({ addOnUISdk }) => {
    const [data, setData] = useState("https://www.example.com");
    const [addToPageEnabled, setAddToPageEnabled] = useState(true);
    const [marginWidth, setMarginWidth] = useState(5);
    const [dataType, setDataType] = useState("url");
    const [transparent, setTransparent] = useState("no");
    const [size, setSize] = useState(1200);
    const previewRef = useRef();

    let debounceTimer;

    function isDataValid() {
        if (dataType === "url") {
            return /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/.test(data)
        } else {
            return data.length > 0;
        }
    }

    useEffect(() => {
        qrCode.append(previewRef.current);
        debounceTimer = setTimeout(() => {
            qrCode.update({
                data,
                margin: size * (marginWidth/100),
                backgroundOptions: {
                    color: transparent === "yes" ? "transparent" : "#ffffff",
                },
                width: size,
                height: size,
            });
            setAddToPageEnabled(isDataValid() && size >= 33 && marginWidth >= 0);
        }, 100);
    }, [data, marginWidth,dataType, transparent, size]);


    async function handleClick() {
        const canvas = previewRef.current.querySelector("canvas");
        const blob = await new Promise((resolve, reject) => {
            canvas.toBlob(blob => { resolve(blob); })
        })
        addOnUISdk.app.document.addImage(blob);
    }

    function dataChanged(event) {
        setData(event.target.value);
        if (debounceTimer) { clearTimeout(debounceTimer); }
        setAddToPageEnabled(false); 
    }

    function marginChanged(event) {
        setMarginWidth(event.target.value);
        if (debounceTimer) { clearTimeout(debounceTimer); }
        setAddToPageEnabled(false); 
    }

    function dataTypeChanged(event) {
        setDataType(event.target.selected);
        if (debounceTimer) { clearTimeout(debounceTimer); }
        setAddToPageEnabled(false); 
    }
    function transparentChanged(event) {
        setTransparent(event.target.checked ? "yes": "no");
        if (debounceTimer) { clearTimeout(debounceTimer); }
        setAddToPageEnabled(false); 
    }
    function sizeChanged(event) {
        setSize(event.target.value);
        if (debounceTimer) { clearTimeout(debounceTimer); }
        setAddToPageEnabled(false); 
    }

    return (
        // Please note that the below "<Theme>" component does not react to theme changes in Express.
        // You may use "addOnUISdk.app.ui.theme" to get the current theme and react accordingly.
        <Theme theme="express" scale="medium" color="light">
            <div className="container">
                <WC onChange={dataTypeChanged}>
                    <FieldLabel size="l" for="rdoDataType">Type:</FieldLabel>
                    <RadioGroup vertical selected={dataType} id="rdoDataType">
                        <Radio value="url">Website Address (URL)</Radio>
                        <Radio value="text">Text</Radio>
                    </RadioGroup>
                </WC>
                <WC onInput={dataChanged}>
                    {/*<FieldLabel for="txtData" size="l">QR Code Data:</FieldLabel>*/}
                    {/* pattern from https://urlregex.com/index.html */}
                    <Textfield label="QR Code Data" rows={4} type={dataType} 
                               valid={isDataValid()  ? true : undefined} 
                               invalid={isDataValid()  ? undefined : true} 
                               id="txtData" maxlength={1024} required multiline value={data} 
                               placeholder="Web address or other data for your QR Code">
                        <HelpText slot="help-text">1024 characters max.</HelpText>
                        <HelpText slot="negative-help-text">{dataType==="url" ?
                            `Invalid web address. Be sure to start your web address with "https://" or "http://".` :
                            "Some data is required before a QR Code can be generated."}</HelpText>
                    </Textfield>
                </WC>
                <div className="preview" ref={previewRef} style={{visibility: addToPageEnabled ? "visible" : "hidden"}}/>
                <WC onChange={sizeChanged}>
                    <FieldLabel for="txtSize" size="l">Size (pixels)</FieldLabel>
                    <NumberField id="txtSize" min={0} max={8000} value={size}
                            hideStepper
                               valid={size>32  ? true : undefined} 
                               invalid={size>32  ? undefined : true} >
                        <HelpText slot="negative-help-text">Size must be between 33 and 8,000.</HelpText>
                    </NumberField>
                </WC>
                <WC onChange={marginChanged}>
                    <FieldLabel for="txtMargin" size="l">Margin Width %</FieldLabel>
                    <NumberField id="txtMargin" min={0} max={25} value={marginWidth}
                            hideStepper
                               valid={marginWidth>0 ? true : undefined} 
                               invalid={marginWidth>0 ? undefined : true} >
                        <HelpText slot="negative-help-text">Margin must be between 0 and 25.</HelpText>
                    </NumberField>
                </WC>
                <WC onChange={transparentChanged}>
                    <Checkbox checked={transparent==="yes" ? true : undefined} >Transparent?</Checkbox>
                </WC>
                <div className="spacer"></div>
                <Accordion>
                    <AccordionItem label="Acknowledgements">
                        <p className="acknowledgements">
                            Made possible with the open source component <Link target="_blank" href="https://www.npmjs.com/package/nvp-qr-code-styling">nvp-qr-code-styling</Link>. &copy; 2021 Denys Kozak
                        </p>
                        <p className="acknowledgements">
                            Thanks to Shannon McCready for the wonderful add-on icon and marketing images.
                        </p>
                        <p className="acknowledgements">
                            URL validation using <Link target="_blank" href="https://urlregex.com/index.html">The Perfect URL Regular Expression</Link>.
                        </p>
                    </AccordionItem>
                </Accordion>
                <div className="bottom-spacer"></div>
            </div>
            <div className="bottom">
                <Button size="m" onClick={handleClick} disabled={!addToPageEnabled}>Add to page</Button>
            </div>
        </Theme>
    );
};

export default App;
