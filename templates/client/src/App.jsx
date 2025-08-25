import { useEffect, useState } from "react";
// import celasterLogo from "../public/celaster.png";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prev) => prev + 1);
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div id="root" className="flex flex-col items-center justify-center gap-8 border-2 border-gray-700 rounded-xl p-8">
      {/* Logo */}
      <img
        src="/celaster.png"
        alt="Celestials Logo"
        width={150}       
      />
      <h1 className="text-4xl font-bold">React + Tailwind + Express</h1>
      <h2 className="text-2xl font-semibold">No setup. No Sh*t !</h2>
    </div>
  );
}

export default App;
