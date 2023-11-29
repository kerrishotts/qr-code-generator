// To support: theme="express" scale="medium" color="light"
// import these spectrum web components modules:
import "@spectrum-web-components/theme/express/scale-medium.js";
import "@spectrum-web-components/theme/express/theme-light.js";
import "@spectrum-web-components/theme/scale-medium.js";
import "@spectrum-web-components/theme/theme-light.js";

import React, { useState, useRef, useEffect, useContext } from "react";
import {useDebounce, useDebounceCallback} from "@react-hook/debounce";


// To learn more about using "swc-react" visit:
// https://opensource.adobe.com/spectrum-web-components/using-swc-react/
import { Button } from "@swc-react/button";
import { Textfield } from "@swc-react/textfield";
import { FieldGroup } from "@swc-react/field-group";
import { FieldLabel } from "@swc-react/field-label";
import { NumberField } from "@swc-react/number-field";
import { Radio, RadioGroup } from '@swc-react/radio';
import { Picker } from "@swc-react/picker";
import { MenuItem } from "@swc-react/menu";
import { Checkbox } from '@swc-react/checkbox';
import { Accordion, AccordionItem } from "@swc-react/accordion";
import { Link } from "@swc-react/link";
import { HelpText } from "@swc-react/help-text";
import { WC } from "./WC";

import { AdaptiveTheme } from "./AdaptiveTheme.jsx";
import { AddOnUiSdkContext } from "../contexts/AddOnUiSdkContext.jsx";
import { ColorPicker } from "./ColorPicker.jsx";

import { dataTypes, dataTypeKeys } from "../datatypes/index.js";

import "./App.css";

import QRCodeStyling from "nvp-qr-code-styling";

const qrCode = new QRCodeStyling({
    type: "canvas",
    width: 1200,
    height: 1200,
});


const App = () => {
    const AddOnUiSdk = useContext(AddOnUiSdkContext);

    const [qrConfig, setQrConfig] = useState({
        dataType: dataTypeKeys[0],
        data: dataTypes[dataTypeKeys[0]].example,
        marginWidth: 5,
        transparent: "no",
        size: 1200,
        color: "#000000",
        backgroundColor: "#FFFFFF"
    });

    const [debouncedQrConfig, setDebouncedQrConfig] = useDebounce(qrConfig);

    const selectedDataType = dataTypes[qrConfig.dataType]

    const [addToPageEnabled, setAddToPageEnabled] = useState(false);
    const previewRef = useRef();

    function isDataValid() {
        return selectedDataType.valid(qrConfig.data);
    }

    useEffect(() => {
            qrCode.append(previewRef.current);
    }, []);

    useEffect(() => {
        const valid = (isDataValid() && qrConfig.size >= 33 && qrConfig.marginWidth >= 0);
        if (valid) {
            qrCode.update({
                data:selectedDataType.normalize(qrConfig.data),
                margin: qrConfig.size * (qrConfig.marginWidth/100),
                dotsOptions: {
                    color: qrConfig.color,
                    type: "square"
                },
                backgroundOptions: {
                    color: qrConfig.backgroundColor
                },
                width: qrConfig.size,
                height: qrConfig.size,
            });
        }
        setAddToPageEnabled(valid);
    }, [debouncedQrConfig]);
    //}, [qrConfig.data, qrConfig.marginWidth, qrConfig.dataType, qrConfig.transparent, qrConfig.size, qrConfig.color, qrConfig.backgroundColor]);


    async function handleClick() {
        const canvas = previewRef.current.querySelector("canvas");
        const blob = await new Promise((resolve, reject) => {
            canvas.toBlob(blob => { resolve(blob); })
        })
        AddOnUiSdk.app.document.addImage(blob);
    }

    function setQrConfigAndUpdate(config) {
        setAddToPageEnabled(false); 
        setQrConfig(config);
        setDebouncedQrConfig(config);
    }

    function dataChanged(event) {
        const newConfig = {...qrConfig, data: event.target.value};
        setQrConfigAndUpdate({...qrConfig, data: event.target.value});
    }

    function marginChanged(event) {
        setQrConfigAndUpdate({...qrConfig, marginWidth: event.target.value});
    }

    function dataTypeChanged(event) {
        let newConfig = {...qrConfig};
        newConfig.dataType = event.target.value;
        const newDataType = dataTypes[event.target.value];
        if (qrConfig.data === selectedDataType.example) {
            newConfig.data = newDataType.example;
        }
        setQrConfigAndUpdate(newConfig);
    }
    function transparentChanged(event) {
        setQrConfigAndUpdate({...qrConfig, transparent: event.target.checked ? "yes": "no" });
    }
    function sizeChanged(event) {
        setQrConfigAndUpdate({...qrConfig, size: event.target.value});
    }
    function colorChanged(color) {
        setQrConfigAndUpdate({...qrConfig, color});
    }
    function backgroundColorChanged(color) {
        setQrConfigAndUpdate({...qrConfig, backgroundColor: color});
    }

    return (
        <AdaptiveTheme>
            <div className="container">
                <div className="preview-section">
                    <div className="preview opacity-checkerboard" ref={previewRef} style={{filter: addToPageEnabled ? "blur(0)" : "blur(6px)"}}/>
                </div>
                <div className="settings-section">
                    <WC onChange={dataTypeChanged} className="wide-field">
                            <FieldLabel size="l" for="mnuDataType" sideAligned="start">Kind</FieldLabel>
                            <Picker id="mnuDataType" value={qrConfig.dataType}>
                                {dataTypeKeys.map(key => {
                                    const {label} = dataTypes[key]
                                    return <MenuItem key={key} value={key}>{label}</MenuItem>
                                })}
                            </Picker>
                    </WC>
                    <WC onInput={dataChanged}>
                        {/*<FieldLabel for="txtData" size="l">QR Code Data:</FieldLabel>*/}
                        {/* pattern from https://urlregex.com/index.html */}
                        <Textfield label="QR Code Data" rows={4} 
                                valid={isDataValid()  ? true : undefined} 
                                invalid={isDataValid()  ? undefined : true} 
                                id="txtData" maxlength={1024} required multiline value={qrConfig.data} 
                                placeholder={selectedDataType.placeholder}>
                            <HelpText slot="help-text">1024 characters max.</HelpText>
                            <HelpText slot="negative-help-text">{selectedDataType.invalidReason(qrConfig.data)}</HelpText>
                        </Textfield>
                    </WC>
                    <div className="wide-field">
                        <FieldLabel size="l" for="clrDotColor" sideAligned="start">Color</FieldLabel>
                        <ColorPicker id="clrDotColor" color={qrConfig.color} onInput={colorChanged}/>
                    </div>
                    <div className="wide-field">
                        <FieldLabel size="l" for="clrBackgroundColor" sideAligned="start">Background</FieldLabel>
                        <ColorPicker id="clrBackgroundColor" color={qrConfig.backgroundColor} onInput={backgroundColorChanged} />
                    </div>
                    <WC onInput={sizeChanged} className="wide-field">
                        <FieldLabel for="txtSize" size="l" sideAligned="start">Size (pixels)</FieldLabel>
                        <NumberField id="txtSize" min={0} max={8000} value={qrConfig.size}
                                hideStepper
                                valid={qrConfig.size>32  ? true : undefined} 
                                invalid={qrConfig.size>32  ? undefined : true} >
                            <HelpText slot="negative-help-text">Size must be between 33 and 8,000.</HelpText>
                        </NumberField>
                    </WC>
                    <WC onInput={marginChanged} className="wide-field">
                        <FieldLabel for="txtMargin" size="l" sideAligned="start">Margin Width %</FieldLabel>
                        <NumberField id="txtMargin" min={0} max={25} value={qrConfig.marginWidth}
                                hideStepper
                                valid={qrConfig.marginWidth>=0 ? true : undefined} 
                                invalid={qrConfig.marginWidth>=0 ? undefined : true} >
                            <HelpText slot="negative-help-text">Margin must be between 0 and 25.</HelpText>
                        </NumberField>
                    </WC>
                    <div className="spacer"></div>
                    <Accordion>
                        <AccordionItem label="Acknowledgements">
                            <p className="acknowledgements">
                                Made possible with the following open source components:
                                <ul>
                                    <li><Link target="_blank" href="https://www.npmjs.com/package/nvp-qr-code-styling">nvp-qr-code-styling</Link> &copy; 2021 Denys Kozak</li>
                                    <li><Link target="_blank" href="https://www.npmjs.com/package/@react-hook/debounce">debounce</Link> &copy; 2019 Jared Lunde </li>
                                    <li><Link target="_blank" href="https://opensource.adobe.com/spectrum-web-components/">Spectrum Web Components</Link> &copy; 2023 Adobe</li>
                                    <li><Link target="_blank" href="https://react.dev">React</Link> &copy; Meta Platforms, Inc. and affiliates.</li>
                                </ul>
                            </p>
                            <p className="acknowledgements">
                                Thanks to Shannon McCready for the wonderful add-on icon and marketing images.
                            </p>
                        </AccordionItem>
                    </Accordion>
                    <div className="bottom-spacer"></div>
                </div>
                <div className="bottom-section">
                    <Button size="m" onClick={handleClick} disabled={!addToPageEnabled}>Add to page</Button>
                </div>
            </div>
        </AdaptiveTheme>
    );
};

export default App;
