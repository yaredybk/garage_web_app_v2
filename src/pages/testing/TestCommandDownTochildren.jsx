import React, { useState, useEffect } from "react";
// Parent Component
export default function TestComp() {
    const [handleSaveClick, setHandleSaveClick] = useState(null);

    return (
        <div>
            <Child handleSaveData={setHandleSaveClick} />

            <button onClick={handleSaveClick} color="primary">
                Save
            </button>
        </div>
    );
}

// Child Component
const Child = ({ handleSaveData }) => {
    useEffect(() => {
        handleSaveData(() => yared);
    }, []);

    const yared = () => {
        console.log("yared clicked");
    };

    return <div>the child</div>;
};
