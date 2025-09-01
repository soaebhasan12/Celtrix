import React, { useEffect, useState } from "react";
import "./App.css";

const App: React.FC = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prev) => prev + 1);
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="flex flex-col items-center justify-center gap-8 border-2 border-gray-700 rounded-xl p-8"
    >
      {/* Logo */}
      <img src="/celaster.png" alt="Celestials Logo" width={150} />
      <h1 className="text-4xl font-bold">
        React + Tailwind + Express + TypeScript
      </h1>
      <h2 className="text-2xl font-semibold">No setup. No Sh*t !</h2>
      <div className="card">
        <button onClick={() => setCount((c) => c + 1)}>Count is {count}</button>
        <p className="read-the-docs">
          Edit <code>src/App.tsx</code> and save to test HMR updates.
        </p>
      </div>
    </div>
  );
};

export default App;
