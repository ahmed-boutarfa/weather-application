import "./hourly-forecast.css";
import getWeatherIcon from "./get-weather-icon";
import { useState, useRef, useEffect } from "react";
import icon_dropdown from "../assets/images/icon-dropdown.svg";


export default function HourlyForecast({ hourly, daily, selectedUnits }) {
  //if (!hourly || !daily) return null;

  const [selectedDay, setSelectedDay] = useState(0);
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  const tempUnit = selectedUnits.temperature === "celsius" ? "°C" : "°F";

  // Fonction : récupérer les données horaires du jour sélectionné
  const getHourlyDataForDay = (dayIndex) => {
    const selectedDate = daily.time[dayIndex];
    const hourlyData = [];

    hourly.time.forEach((time, i) => {
      const hourDate = time.split("T")[0];
      if (hourDate === selectedDate) {
        const hour = new Date(time).getHours();
        hourlyData.push({
          time: hour,
          temp: hourly.temperature_2m[i],
          weatherCode: hourly.weather_code[i],
          precipitation: hourly.precipitation_probability?.[i] || 0,
        });
      }
    });

    return hourlyData;
  };

  const hourlyDataForSelectedDay = getHourlyDataForDay(selectedDay);

  // Formater les heures (ex: 3 PM, 4 PM)
  const formatHour = (hour) => {
    if (hour === 0) return "12 AM";
    if (hour === 12) return "12 PM";
    if (hour < 12) return `${hour} AM`;
    return `${hour - 12} PM`;
  };

  // Fermer le menu si on clique à l’extérieur
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Générer les noms des jours
  const days = daily.time.map((day) =>
    new Date(day).toLocaleDateString("en-US", { weekday: "long" })
  );

  return (
    <section className="hourly-forecast">
      <div className="hourly-header">
        <h2>Hourly Forecast</h2>

        {/* === Dropdown des jours === */}
        <div className="day-selector" ref={menuRef}>
          <button className="day-btn" onClick={() => setOpen(!open)}>
            {days[selectedDay] || "-"}
            <img
              src={icon_dropdown}
              alt="Dropdown"
              width="12"
              style={{ marginLeft: "6px" }}
            />
          </button>

          {open && (
            <div className="day-menu">
              {days.map((day, i) => (
                <div
                  key={i}
                  className={`day-option ${
                    i === selectedDay ? "active" : ""
                  }`}
                  onClick={() => {
                    setSelectedDay(i);
                    setOpen(false);
                  }}
                >
                  {day || "-"}
                  {i === selectedDay && <span className="tick">✓</span>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* === Grid des heures === */}
      <div className="hourly-forecast-grid">
        {hourlyDataForSelectedDay.map((hour, i) => (
          <div className="hourly-card" key={i}>
            <div className="hour-icon-time">
              <div className="hour-icon">{getWeatherIcon(hour.weatherCode) || "-"}</div>
              <p className="hour-time">{formatHour(hour.time)|| "-"}</p>
            </div>
            <p className="hour-temp">
              {Math.round(hour.temp)|| "-"}
              {tempUnit || "-"}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
