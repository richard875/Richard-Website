import React from "react";

// Ticks once a minute off the browser's real local clock - fine-grained
// enough that a visitor leaving the tab open across, say, sunset actually
// sees the scene drift, without re-rendering every frame for a value that
// only matters at whole-minute resolution.
export const useCurrentHour = () => {
  const readHour = () => {
    const now = new Date();
    return now.getHours() + now.getMinutes() / 60;
  };
  const [hour, setHour] = React.useState(readHour);
  React.useEffect(() => {
    const id = setInterval(() => setHour(readHour()), 60_000);
    return () => clearInterval(id);
  }, []);
  return hour;
};
