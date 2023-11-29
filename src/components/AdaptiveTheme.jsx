import React, { useState, useContext, useEffect } from "react";
import { Theme } from "@swc-react/theme";

import { AddOnUiSdkContext } from "../contexts/AddOnUiSdkContext";

export function AdaptiveTheme({children}) {
    const AddOnUiSdk = useContext(AddOnUiSdkContext);
    const currentTheme = AddOnUiSdk.app.ui.theme;
    const [theme, setTheme] = useState(currentTheme);

    useEffect(() => {
        AddOnUiSdk.app.on("themechange", (data) => { setTheme(data.theme); });
    }, []);

    return (<>
        <Theme theme="express" color={theme} scale="medium" style={{backgroundColor: "var(--spectrum-global-color-gray-50)"}}>
            {children}
        </Theme>
    </>);
}