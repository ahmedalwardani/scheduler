import { useState } from "react";

export default function useVisualMode(initial) {
  // Manage state for modes (show, empty, etc...) and history of modes (modes stored in history array)
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  function transition(newMode, replace = false) {
    const historyToUpdate = [...history];
    if (replace) {
      historyToUpdate.pop();
    }
    historyToUpdate.push(newMode);
    setHistory(historyToUpdate);
    setMode(newMode);
  }

  function back() {
    const historyToUpdate = [...history];
    if (historyToUpdate.length > 1) {
      historyToUpdate.pop();
      setMode(historyToUpdate[historyToUpdate.length - 1]);
      setHistory(historyToUpdate);
    }
  }
  return { mode, transition, back };
}
