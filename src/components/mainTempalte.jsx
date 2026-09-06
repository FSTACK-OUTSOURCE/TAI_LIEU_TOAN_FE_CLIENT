'use client'

import Right from "./right";

const MainTempalte = ({ children }) => {
    return (
        <div className="row">
            <div className="col-lg-9 col-xl-9">
                {children}
            </div>
            <div className="col-lg-3 col-xl-3 hide-on-tablet">
                <Right />
            </div>
        </div>
    );
}

export default MainTempalte;