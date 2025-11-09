import { useState, useEffect, useRef, useContext } from "react";
import { UnitsContext } from "../context/UnitsContext";
import "./header.css";
import applogo from "../assets/images/logo.svg";
import icon_units from "../assets/images/icon-units.svg";
import icon_dropdown from "../assets/images/icon-dropdown.svg";

function Header() {
  const [open, setOpen] = useState(false);
  const {
    temperatureUnit,
    setTemperatureUnit,
    windspeedUnit,
    setWindspeedUnit,
    precipitationUnit,
    setPrecipitationUnit,
    unitSystem,
  } = useContext(UnitsContext);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const options = [
    {
      title: "Temperature",
      type: "temperature",
      values: [
        { label: "Celsius (°C)", key: "celsius" },
        { label: "Fahrenheit (°F)", key: "fahrenheit" },
      ],
      selected: temperatureUnit,
      setter: setTemperatureUnit,
    },
    {
      title: "Wind Speed",
      type: "wind",
      values: [
        { label: "km/h", key: "kmh" },
        { label: "mph", key: "mph" },
      ],
      selected: windspeedUnit,
      setter: setWindspeedUnit,
    },
    {
      title: "Precipitation",
      type: "precipitation",
      values: [
        { label: "Millimeters (mm)", key: "mm" },
        { label: "Inches (in)", key: "inch" },
      ],
      selected: precipitationUnit,
      setter: setPrecipitationUnit,
    },
  ];

  // Toggle full system (global)
  const toggleSystem = () => {
    if (unitSystem === "metric") {
      // Switch to Imperial
      setTemperatureUnit("fahrenheit");
      setWindspeedUnit("mph");
      setPrecipitationUnit("inch");
    } else {
      // Switch to Metric
      setTemperatureUnit("celsius");
      setWindspeedUnit("kmh");
      setPrecipitationUnit("mm");
    }
  };
  
  return (
    <header className="header">
      <div className="header__logo">
        <img src={applogo} alt="Weather Now" />
      </div>

      <div className="header__units" ref={menuRef}>
        <button className="header__btn" onClick={() => setOpen(!open)}>
          <img src={icon_units} alt="Units" width="18" />
          Units
          <img src={icon_dropdown} alt="Dropdown" width="12" />
        </button>

        {open && (
          <div id="header__menu" className="header__menu">
            <h4 onClick={toggleSystem} className="header__toggle">
              Switch to {unitSystem === "metric" ? "Imperial" : "Metric"}
            </h4>

            {options.map((opt, i) => (
              <div className="header__group" key={i}>
                <p className="header__group-title">{opt.title}</p>
                <ul className="header__options">
                  {opt.values.map((val) => (
                    <li
                      key={val.key}
                      className={`option-item ${
                        opt.selected === val.key ? "active" : ""
                      }`}
                      onClick={() => opt.setter(val.key)}
                    >
                      
                      {val.label}
                      {opt.selected === val.key && (
                        <span className="tick">✓</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;