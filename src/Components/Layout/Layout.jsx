import React from 'react'
import Header from '../Header/Header'
import Footer from '../Footer/Footer'
import Routers from '../Routers/Routers'
import { BrowserRouter as Router, useLocation } from 'react-router-dom'

function LayoutContent() {
    const location = useLocation()
    const isLoginPage = location.pathname === '/login'
    const isHomePage = location.pathname === '/'

    return (
        <>
            {!isLoginPage && !isHomePage && <Header />}
            <div>
                <Routers />
            </div>
            {!isLoginPage && !isHomePage && <Footer />}
        </>
    )
}

function Layout() {
    return (
        <Router>
            <LayoutContent />
        </Router>
    )
}

export default Layout