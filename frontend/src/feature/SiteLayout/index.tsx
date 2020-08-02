import React from "react";


const SiteLayout: React.FC = (props) => {

    return (
        <main>
            {props.children}
        </main>
    )
};

export default SiteLayout;