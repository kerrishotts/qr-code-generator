import React from "react";
import { createRoot } from "react-dom/client";
import App from "./components/App";

import addOnUiSdk from "https://new.express.adobe.com/static/add-on-sdk/sdk.js";
import { AddOnUiSdkContext } from "./contexts/AddOnUiSdkContext";

console.log("before ready");
addOnUiSdk.ready.then(() => {
    console.log("After ready");
    const root = createRoot(document.getElementById("root"));
    console.log("beforfe render");
    root.render(
        <AddOnUiSdkContext.Provider value={addOnUiSdk}>
            <App />
        </AddOnUiSdkContext.Provider>
    );
    console.log("after render");
});
