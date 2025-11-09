import { createContext, useState, useMemo } from "react";

export const UnitsContext = createContext();

export function UnitsProvider({ children }) {
  const [temperatureUnit, setTemperatureUnit] = useState("celsius");
  const [windspeedUnit, setWindspeedUnit] = useState("kmh");
  const [precipitationUnit, setPrecipitationUnit] = useState("mm");

  const unitSystem = useMemo(() => {
    const isMetric =
      temperatureUnit === "celsius" &&
      windspeedUnit === "kmh" &&
      precipitationUnit === "mm";
    const isImperial =
      temperatureUnit === "fahrenheit" &&
      windspeedUnit === "mph" &&
      precipitationUnit === "inch";
    if(isMetric)
      return "metric";
    else if(isImperial)
      return "imperial";
    else
      return "mixed"
  }, [temperatureUnit, windspeedUnit, precipitationUnit]);
  const selectedUnits = useMemo(
    () => ({
      temperature: temperatureUnit,
      wind: windspeedUnit,
      precipitation: precipitationUnit,
    }),
    [temperatureUnit, windspeedUnit, precipitationUnit]
  );

  return (
    <UnitsContext.Provider
      value={{
        temperatureUnit,
        setTemperatureUnit,
        windspeedUnit,
        setWindspeedUnit,
        precipitationUnit,
        setPrecipitationUnit,
        unitSystem,
        selectedUnits,
      }}
    >
      {children}
    </UnitsContext.Provider>
  );
}