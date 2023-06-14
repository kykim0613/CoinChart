import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom"
import Main from "./pages/Main"

const Router = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/CoinChart" element={<Main />} />
            </Routes>
        </BrowserRouter>
    )
}

export default Router;