import React from "react";
import {Outlet} from "react-router";
import Header from "../components/Header";
import {ToastContainer} from "react-toastify";

function Layout() {
    return (
        <div>
            <ToastContainer/>
            <Header/>
            <div className={'pt-16 '}>
                <Outlet/>

            </div>
        </div>
    );
}

export default Layout;
