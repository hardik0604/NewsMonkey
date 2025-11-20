import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const NavBar = ({ theme = 'dark', onToggleTheme = () => {} }) => {
    const [temp, setTemp] = useState(null);
    const [status, setStatus] = useState("...");
    const [dateStr, setDateStr] = useState("");
    const [timeStr, setTimeStr] = useState("");

    // DATE + TIME
    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            setDateStr(now.toLocaleDateString("en-US"));
            setTimeStr(
                now.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                })
            );
        };
        updateTime();
        const interval = setInterval(updateTime, 30000);
        return () => clearInterval(interval);
    }, []);

    // WEATHER
    useEffect(() => {
        if (!navigator.geolocation) {
            setStatus("NO-LOC");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                const lat = pos.coords.latitude;
                const lon = pos.coords.longitude;

                setStatus("OK");

                try {
                    const weatherRes = await fetch(
                        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
                    );
                    const data = await weatherRes.json();
                    setTemp(Math.round(data.current_weather.temperature));
                } catch (error) {
                    setStatus("ERR");
                }
            },
            () => setStatus("DENIED")
        );
    }, []);

    return (
        <nav className="navbar fixed-top navbar-expand-lg navbar-dark bg-dark">
            <div className="container-fluid d-flex align-items-center">

                {/* LEFT - BRAND */}
                <Link className="navbar-brand" to="/">NewsMonkey</Link>

                {/* HAMBURGER */}
                <button className="navbar-toggler" type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent">
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/* NAV LINKS */}
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item"><Link className="nav-link" to="/">Home</Link></li>
                        <li className="nav-item"><Link className="nav-link" to="/business">Business</Link></li>
                        <li className="nav-item"><Link className="nav-link" to="/entertainment">Entertainment</Link></li>
                        <li className="nav-item"><Link className="nav-link" to="/general">General</Link></li>
                        <li className="nav-item"><Link className="nav-link" to="/health">Health</Link></li>
                        <li className="nav-item"><Link className="nav-link" to="/science">Science</Link></li>
                        <li className="nav-item"><Link className="nav-link" to="/sports">Sports</Link></li>
                        <li className="nav-item"><Link className="nav-link" to="/technology">Technology</Link></li>
                    </ul>
                </div>

                {/* RIGHT SIDE — ALWAYS FIXED RIGHT */}
                <div className="ms-auto d-flex align-items-center gap-3">
                    <button 
                        className={`theme-toggle-btn ${theme === 'light' ? 'light' : ''}`} 
                        type="button" 
                        onClick={onToggleTheme}
                        aria-label="Toggle color theme"
                    >
                        {theme === 'dark' ? 'LIGHT MODE' : 'DARK MODE'}
                    </button>
                    <div className="retro-nav-info text-end">
                        <small>
                            {dateStr} | {timeStr}
                            {temp !== null ? ` | ${temp}°C` : ""}
                            {status !== "OK" && temp == null ? " | NO-TEMP" : ""}
                        </small>
                    </div>
                </div>

            </div>
        </nav>
    );
};

export default NavBar;
