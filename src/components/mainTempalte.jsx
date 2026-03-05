'use client'

import Right from "./right";

const MainTempalte = ({ children }) => {
    return (
        <div className="row">
            <div className="col-lg-9 col-xl-9">
                {children}
            </div>
            <Right />
        </div>
    );
}

export default MainTempalte;