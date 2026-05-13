import React, { useState } from 'react';
import './Calculator.css';

const Calculator = () => {
  const [display, setDisplay] = useState('0');
  const [history, setHistory] = useState('');
  const [mode, setMode] = useState('standard'); // standard or scientific

  const handleInput = (value) => {
    if (display === '0' && value !== '.' && !value.includes('Math')) {
      setDisplay(value);
    } else {
      setDisplay(display + value);
    }
  };

  const clear = () => {
    setDisplay('0');
    setHistory('');
  };

  const backspace = () => {
    const newValue = display.slice(0, -1) || '0';
    setDisplay(newValue);
  };

  const toggleSign = () => {
    if (display !== '0') {
      if (display.startsWith('-')) {
        setDisplay(display.substring(1));
      } else {
        setDisplay('-' + display);
      }
    }
  };

  const percent = () => {
    try {
      const result = (eval(display) / 100).toString();
      setDisplay(result);
    } catch (e) {
      setDisplay('Error');
      setTimeout(() => setDisplay('0'), 1000);
    }
  };

  const calculateFunction = (func) => {
    try {
      let result;
      const num = eval(display);

      switch (func) {
        case 'sqrt':
          result = Math.sqrt(num);
          break;
        case 'pow':
          result = Math.pow(num, 2);
          break;
        case 'sin':
          result = Math.sin(num);
          break;
        case 'cos':
          result = Math.cos(num);
          break;
        case 'tan':
          result = Math.tan(num);
          break;
        case 'ln':
          result = Math.log(num);
          break;
        case 'log':
          result = Math.log10(num);
          break;
        case 'exp':
          result = Math.exp(num);
          break;
        case 'fact':
          result = factorial(num);
          break;
        default:
          result = num;
      }

      setHistory(`${func}(${num})`);
      setDisplay(result.toString());
    } catch (e) {
      setDisplay('Error');
      setTimeout(() => setDisplay('0'), 1000);
    }
  };

  const factorial = (n) => {
    if (n < 0) return NaN;
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
      result *= i;
    }
    return result;
  };

  const equals = () => {
    try {
      setHistory(display);
      // Replace ^ with ** for exponentiation
      const expression = display.replace(/\^/g, '**');
      const result = eval(expression).toString();
      setDisplay(result);
      setHistory(display + ' =');
    } catch (e) {
      setDisplay('Error');
      setTimeout(() => setDisplay('0'), 1000);
    }
  };

  const switchMode = (newMode) => {
    setMode(newMode);
  };

  return (
    <div className="calculator-container">
      <div className="calculator-mode-switch">
        <button
          className={`mode-btn ${mode === 'standard' ? 'active' : ''}`}
          onClick={() => switchMode('standard')}
        >
          Standard
        </button>
        <button
          className={`mode-btn ${mode === 'scientific' ? 'active' : ''}`}
          onClick={() => switchMode('scientific')}
        >
          Scientific
        </button>
      </div>

      <div className="calculator-display">{display}</div>
      <div className="calculator-history">{history}</div>

      {mode === 'standard' ? (
        <div className="calculator-grid">
          <button className="calc-btn special" onClick={clear}>C</button>
          <button className="calc-btn special" onClick={backspace}>⌫</button>
          <button className="calc-btn special" onClick={percent}>%</button>
          <button className="calc-btn operator" onClick={() => handleInput('/')}>/</button>

          <button className="calc-btn" onClick={() => handleInput('7')}>7</button>
          <button className="calc-btn" onClick={() => handleInput('8')}>8</button>
          <button className="calc-btn" onClick={() => handleInput('9')}>9</button>
          <button className="calc-btn operator" onClick={() => handleInput('*')}>×</button>

          <button className="calc-btn" onClick={() => handleInput('4')}>4</button>
          <button className="calc-btn" onClick={() => handleInput('5')}>5</button>
          <button className="calc-btn" onClick={() => handleInput('6')}>6</button>
          <button className="calc-btn operator" onClick={() => handleInput('-')}>-</button>

          <button className="calc-btn" onClick={() => handleInput('1')}>1</button>
          <button className="calc-btn" onClick={() => handleInput('2')}>2</button>
          <button className="calc-btn" onClick={() => handleInput('3')}>3</button>
          <button className="calc-btn operator" onClick={() => handleInput('+')}>+</button>

          <button className="calc-btn" onClick={toggleSign}>+/-</button>
          <button className="calc-btn" onClick={() => handleInput('0')}>0</button>
          <button className="calc-btn" onClick={() => handleInput('.')}>.</button>
          <button className="calc-btn equals" onClick={equals}>=</button>
        </div>
      ) : (
        <div className="calculator-grid scientific-grid">
          <button className="calc-btn special" onClick={clear}>C</button>
          <button className="calc-btn special" onClick={backspace}>⌫</button>
          <button className="calc-btn special" onClick={percent}>%</button>
          <button className="calc-btn operator" onClick={() => handleInput('/')}>/</button>
          <button className="calc-btn scientific" onClick={() => calculateFunction('sqrt')}>√</button>
          <button className="calc-btn scientific" onClick={() => calculateFunction('pow')}>x²</button>

          <button className="calc-btn scientific" onClick={() => calculateFunction('sin')}>sin</button>
          <button className="calc-btn scientific" onClick={() => calculateFunction('cos')}>cos</button>
          <button className="calc-btn scientific" onClick={() => calculateFunction('tan')}>tan</button>
          <button className="calc-btn operator" onClick={() => handleInput('*')}>×</button>
          <button className="calc-btn scientific" onClick={() => calculateFunction('ln')}>ln</button>
          <button className="calc-btn scientific" onClick={() => calculateFunction('log')}>log</button>

          <button className="calc-btn" onClick={() => handleInput('7')}>7</button>
          <button className="calc-btn" onClick={() => handleInput('8')}>8</button>
          <button className="calc-btn" onClick={() => handleInput('9')}>9</button>
          <button className="calc-btn operator" onClick={() => handleInput('-')}>-</button>
          <button className="calc-btn scientific" onClick={() => handleInput('Math.PI')}>π</button>
          <button className="calc-btn scientific" onClick={() => handleInput('Math.E')}>e</button>

          <button className="calc-btn" onClick={() => handleInput('4')}>4</button>
          <button className="calc-btn" onClick={() => handleInput('5')}>5</button>
          <button className="calc-btn" onClick={() => handleInput('6')}>6</button>
          <button className="calc-btn operator" onClick={() => handleInput('+')}>+</button>
          <button className="calc-btn scientific" onClick={() => handleInput('(')}>(</button>
          <button className="calc-btn scientific" onClick={() => handleInput(')')}>)</button>

          <button className="calc-btn" onClick={() => handleInput('1')}>1</button>
          <button className="calc-btn" onClick={() => handleInput('2')}>2</button>
          <button className="calc-btn" onClick={() => handleInput('3')}>3</button>
          <button className="calc-btn equals" onClick={equals} style={{ gridRow: 'span 2' }}>=</button>
          <button className="calc-btn scientific" onClick={() => calculateFunction('fact')}>n!</button>
          <button className="calc-btn scientific" onClick={() => calculateFunction('exp')}>exp</button>

          <button className="calc-btn" onClick={toggleSign}>+/-</button>
          <button className="calc-btn" onClick={() => handleInput('0')}>0</button>
          <button className="calc-btn" onClick={() => handleInput('.')}>.</button>
          <button className="calc-btn scientific" onClick={() => handleInput('^')}>^</button>
        </div>
      )}
    </div>
  );
};

export default Calculator;
