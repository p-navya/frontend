import React from 'react'
import Header from '../Header/Header'
import Footer from '../Footer/Footer'
import Routers from '../Routers/Routers'
import { BrowserRouter as Router, useLocation } from 'react-router-dom'

function LayoutContent() {
    const location = useLocation()
    const isLoginPage = location.pathname === '/login'
    const isSignupPage = location.pathname === '/signup'
    const isHomePage = location.pathname === '/'
    const isDashboard = location.pathname === '/dashboard'
    const isChatPage = location.pathname === '/chat'
    const isResumePage = location.pathname === '/resume'
    const isResourcesPage = location.pathname === '/resources'
    const isWellnessPage = location.pathname === '/wellness'
    const isStudyGroupsPage = location.pathname === '/study-groups'
    const isAchievementsPage = location.pathname === '/achievements'
    const isEditProfilePage = location.pathname === '/edit-profile'

    const hideHeader = isLoginPage || isSignupPage || isHomePage || isChatPage || isResumePage || isResourcesPage || isWellnessPage || isStudyGroupsPage || isAchievementsPage || isEditProfilePage
    const hideFooter = isLoginPage || isSignupPage || isHomePage || isDashboard || isChatPage || isResumePage || isResourcesPage || isWellnessPage || isStudyGroupsPage || isAchievementsPage || isEditProfilePage

    return (
        <>
            {!hideHeader && <Header />}
            <div>
                <Routers />
            </div>
            {!hideFooter && <Footer />}
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