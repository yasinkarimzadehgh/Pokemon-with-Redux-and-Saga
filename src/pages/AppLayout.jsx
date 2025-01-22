// AppLayout.jsx
import "../styles/AppLayout.css";
import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";

function AppLayout({ abilityList }) {
  return (
    <div className="app-layout">
      <main className="main">
        <Outlet />
      </main>
      <Footer abilityList={abilityList} />
    </div>
  );
}

export default AppLayout;
