"use client";

import { useCallback, useEffect, useState } from "react";

type Operator = "+" | "−" | "×" | "÷";

const symbols: Record<Operator, (a: number, b: number) => number> = {
  "+": (a, b) => a + b,
  "−": (a, b) => a - b,
  "×": (a, b) => a * b,
  "÷": (a, b) => a / b,
};

const tidy = (value: number) => Number(value.toPrecision(12)).toString();

export default function Home() {
  const [display, setDisplay] = useState("0");
  const [stored, setStored] = useState<number | null>(null);
  const [operator, setOperator] = useState<Operator | null>(null);
  const [waiting, setWaiting] = useState(false);
  const [expression, setExpression] = useState("");

  const clear = useCallback(() => {
    setDisplay("0");
    setStored(null);
    setOperator(null);
    setWaiting(false);
    setExpression("");
  }, []);

  const inputDigit = useCallback((digit: string) => {
    setDisplay((current) => {
      if (waiting) {
        setWaiting(false);
        return digit;
      }
      if (current === "Error") return digit;
      return current === "0" ? digit : current.length < 12 ? current + digit : current;
    });
  }, [waiting]);

  const inputDecimal = useCallback(() => {
    setDisplay((current) => {
      if (waiting || current === "Error") {
        setWaiting(false);
        return "0.";
      }
      return current.includes(".") ? current : current + ".";
    });
  }, [waiting]);

  const chooseOperator = useCallback((next: Operator) => {
    const value = Number(display);
    if (display === "Error") return;

    if (stored !== null && operator && !waiting) {
      const result = symbols[operator](stored, value);
      if (!Number.isFinite(result)) {
        setDisplay("Error");
        setExpression("Cannot divide by zero");
        setStored(null);
        setOperator(null);
        return;
      }
      const resultText = tidy(result);
      setDisplay(resultText);
      setStored(result);
      setExpression(`${resultText} ${next}`);
    } else {
      setStored(value);
      setExpression(`${display} ${next}`);
    }
    setOperator(next);
    setWaiting(true);
  }, [display, operator, stored, waiting]);

  const calculate = useCallback(() => {
    if (stored === null || !operator || display === "Error") return;
    const value = Number(display);
    const result = symbols[operator](stored, value);
    if (!Number.isFinite(result)) {
      setDisplay("Error");
      setExpression("Cannot divide by zero");
    } else {
      setExpression(`${tidy(stored)} ${operator} ${display} =`);
      setDisplay(tidy(result));
    }
    setStored(null);
    setOperator(null);
    setWaiting(true);
  }, [display, operator, stored]);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (/^[0-9]$/.test(event.key)) inputDigit(event.key);
      else if (event.key === ".") inputDecimal();
      else if (event.key === "Enter" || event.key === "=") calculate();
      else if (event.key === "Escape" || event.key.toLowerCase() === "c") clear();
      else if (["+", "-", "*", "/"].includes(event.key)) {
        const mapped = ({ "+": "+", "-": "−", "*": "×", "/": "÷" } as const)[event.key as "+" | "-" | "*" | "/"];
        chooseOperator(mapped);
      } else return;
      event.preventDefault();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [calculate, chooseOperator, clear, inputDecimal, inputDigit]);

  return (
    <main className="page-shell">
      <section className="calculator" aria-label="Calculator">
        <div className="brand-row">
          <span className="brand-mark" aria-hidden="true" />
          <span>CALC / 01</span>
        </div>

        <div className="display" aria-live="polite" aria-atomic="true">
          <div className="expression">{expression || "Ready"}</div>
          <output className={display.length > 9 ? "display-value compact" : "display-value"}>{display}</output>
        </div>

        <div className="keypad">
          <button className="key clear-key" onClick={clear} aria-label="Clear calculator">CLEAR</button>
          <button className="key operator-key" onClick={() => chooseOperator("÷")} aria-label="Divide">÷</button>

          {["7", "8", "9"].map((digit) => <button className="key" key={digit} onClick={() => inputDigit(digit)}>{digit}</button>)}
          <button className="key operator-key" onClick={() => chooseOperator("×")} aria-label="Multiply">×</button>

          {["4", "5", "6"].map((digit) => <button className="key" key={digit} onClick={() => inputDigit(digit)}>{digit}</button>)}
          <button className="key operator-key" onClick={() => chooseOperator("−")} aria-label="Subtract">−</button>

          {["1", "2", "3"].map((digit) => <button className="key" key={digit} onClick={() => inputDigit(digit)}>{digit}</button>)}
          <button className="key operator-key" onClick={() => chooseOperator("+")} aria-label="Add">+</button>

          <button className="key" onClick={inputDecimal} aria-label="Decimal point">.</button>
          <button className="key" onClick={() => inputDigit("0")}>0</button>
          <button className="key equals-key" onClick={calculate} aria-label="Equals">=</button>
        </div>

        <p className="shortcut-note">Keyboard ready · Esc to clear</p>
      </section>
    </main>
  );
}
