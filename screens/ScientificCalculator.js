import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';

export default function ScientificCalculator() {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState(null);
  const [operation, setOperation] = useState(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [angleMode, setAngleMode] = useState('DEG');
  const [history, setHistory] = useState('');
  const [calculationHistory, setCalculationHistory] = useState([]);
  const [memory, setMemory] = useState(0);
  const [showMemory, setShowMemory] = useState(false);
  const [hexMode, setHexMode] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleNumberPress = (num) => {
    if (waitingForOperand) {
      setDisplay(String(num));
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? String(num) : display + num);
    }
  };

  const handleDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  const handleOperation = (nextOperation) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
      setHistory(display + ' ' + nextOperation);
    } else if (operation) {
      const result = calculate(previousValue, inputValue, operation);
      setDisplay(String(result));
      setPreviousValue(result);
      setHistory(result + ' ' + nextOperation);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const calculate = (prev, current, op) => {
    switch (op) {
      case '+':
        return prev + current;
      case '-':
        return prev - current;
      case '×':
        return prev * current;
      case '÷':
        return current !== 0 ? prev / current : 0;
      case '%':
        return prev % current;
      case '^':
        return Math.pow(prev, current);
      default:
        return current;
    }
  };

  const toRad = (deg) => (deg * Math.PI) / 180;
  const toDeg = (rad) => (rad * 180) / Math.PI;

  const handleScientificFunction = (func) => {
    let result;
    const value = parseFloat(display);

    switch (func) {
      case 'sin':
        result = angleMode === 'DEG' ? Math.sin(toRad(value)) : Math.sin(value);
        break;
      case 'cos':
        result = angleMode === 'DEG' ? Math.cos(toRad(value)) : Math.cos(value);
        break;
      case 'tan':
        result = angleMode === 'DEG' ? Math.tan(toRad(value)) : Math.tan(value);
        break;
      case 'asin':
        result = angleMode === 'DEG' ? toDeg(Math.asin(value)) : Math.asin(value);
        break;
      case 'acos':
        result = angleMode === 'DEG' ? toDeg(Math.acos(value)) : Math.acos(value);
        break;
      case 'atan':
        result = angleMode === 'DEG' ? toDeg(Math.atan(value)) : Math.atan(value);
        break;
      case 'log':
        result = Math.log10(value);
        break;
      case 'log2':
        result = Math.log2(value);
        break;
      case 'ln':
        result = Math.log(value);
        break;
      case 'sqrt':
        result = Math.sqrt(value);
        break;
      case 'cbrt':
        result = Math.cbrt(value);
        break;
      case 'x²':
        result = Math.pow(value, 2);
        break;
      case 'x³':
        result = Math.pow(value, 3);
        break;
      case '1/x':
        result = value !== 0 ? 1 / value : 0;
        break;
      case 'e^x':
        result = Math.exp(value);
        break;
      case '10^x':
        result = Math.pow(10, value);
        break;
      case '|x|':
        result = Math.abs(value);
        break;
      case 'n!':
        result = factorial(value);
        break;
      case 'π':
        setDisplay(String(Math.PI));
        setWaitingForOperand(true);
        return;
      case 'e':
        setDisplay(String(Math.E));
        setWaitingForOperand(true);
        return;
      case '2^x':
        result = Math.pow(2, value);
        break;
      case 'sinh':
        result = Math.sinh(value);
        break;
      case 'cosh':
        result = Math.cosh(value);
        break;
      case 'tanh':
        result = Math.tanh(value);
        break;
      case 'Deg→Rad':
        result = toRad(value);
        break;
      case 'Rad→Deg':
        result = toDeg(value);
        break;
      case 'rand':
        result = Math.random();
        break;
      case 'sec':
        result = angleMode === 'DEG' ? 1 / Math.cos(toRad(value)) : 1 / Math.cos(value);
        break;
      case 'csc':
        result = angleMode === 'DEG' ? 1 / Math.sin(toRad(value)) : 1 / Math.sin(value);
        break;
      case 'cot':
        result = angleMode === 'DEG' ? 1 / Math.tan(toRad(value)) : 1 / Math.tan(value);
        break;
      case 'φ':
        setDisplay(String((1 + Math.sqrt(5)) / 2));
        setWaitingForOperand(true);
        return;
      case '°':
        setDisplay(display + '°');
        return;
      case 'Hex':
        setDisplay('0x' + Math.floor(value).toString(16).toUpperCase());
        setWaitingForOperand(true);
        return;
      case 'Bin':
        setDisplay('0b' + Math.floor(value).toString(2));
        setWaitingForOperand(true);
        return;
      case 'Oct':
        setDisplay('0o' + Math.floor(value).toString(8));
        setWaitingForOperand(true);
        return;
      default:
        result = value;
    }

    setDisplay(String(result));
    setWaitingForOperand(true);
  };

  const factorial = (n) => {
    n = Math.floor(n);
    if (n < 0) return NaN;
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
      result *= i;
    }
    return result;
  };

  const gcd = (a, b) => {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b !== 0) {
      const temp = b;
      b = a % b;
      a = temp;
    }
    return a;
  };

  const lcm = (a, b) => {
    return Math.abs(a * b) / gcd(a, b);
  };

  const permutation = (n, r) => {
    if (r > n) return 0;
    return factorial(n) / factorial(n - r);
  };

  const combination = (n, r) => {
    if (r > n) return 0;
    return factorial(n) / (factorial(r) * factorial(n - r));
  };

  // Memory Functions
  const handleMemoryAdd = () => {
    const value = parseFloat(display);
    setMemory(memory + value);
    setWaitingForOperand(true);
  };

  const handleMemorySubtract = () => {
    const value = parseFloat(display);
    setMemory(memory - value);
    setWaitingForOperand(true);
  };

  const handleMemoryRecall = () => {
    setDisplay(String(memory));
    setWaitingForOperand(true);
  };

  const handleMemoryClear = () => {
    setMemory(0);
  };

  const handleEquals = () => {
    const inputValue = parseFloat(display);

    if (previousValue !== null && operation) {
      const result = calculate(previousValue, inputValue, operation);
      const calculation = `${previousValue} ${operation} ${inputValue} = ${result}`;
      
      // Add to history
      setCalculationHistory(prev => [calculation, ...prev].slice(0, 20));
      
      setDisplay(String(result));
      setHistory('');
      setPreviousValue(null);
      setOperation(null);
      setWaitingForOperand(true);
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
    setHistory('');
  };

  const handleClearHistory = () => {
    setCalculationHistory([]);
  };

  const handleDelete = () => {
    if (display.length === 1) {
      setDisplay('0');
    } else {
      setDisplay(display.slice(0, -1));
    }
  };

  const handleNegate = () => {
    setDisplay(String(parseFloat(display) * -1));
  };

  const Button = ({ label, onPress, style, textStyle, size = 'normal' }) => (
    <TouchableOpacity
      style={[
        styles.button,
        size === 'small' && styles.smallButton,
        style
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={[styles.buttonText, size === 'small' && styles.smallButtonText, textStyle]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.calculatorContainer}>
          {/* Header with angle mode and memory */}
          <View style={styles.headerRow}>
            <View style={styles.headerLeft}>
              <Text style={styles.modeTitle}>Scientific</Text>
              {memory !== 0 && <Text style={styles.memoryIndicator}>M: {memory.toFixed(2)}</Text>}
            </View>
            <TouchableOpacity
              style={[styles.angleModeButton]}
              onPress={() => setAngleMode(angleMode === 'DEG' ? 'RAD' : 'DEG')}
            >
              <Text style={styles.angleModeText}>{angleMode}</Text>
            </TouchableOpacity>
          </View>

          {/* Display Area */}
          <View style={styles.displayArea}>
            <Text style={styles.mainDisplay} numberOfLines={2}>{display}</Text>
          </View>

          {/* Memory Buttons */}
          <View style={styles.memoryRow}>
            <Button label="M+" onPress={handleMemoryAdd} style={styles.memButton} size="small" />
            <Button label="M-" onPress={handleMemorySubtract} style={styles.memButton} size="small" />
            <Button label="MR" onPress={handleMemoryRecall} style={styles.memButton} size="small" />
            <Button label="MC" onPress={handleMemoryClear} style={styles.memButton} size="small" />
          </View>

          {/* Scientific Functions - Always Visible Row 1: Trigonometric */}
          <View style={styles.scientificRow}>
            <Button label="sin" onPress={() => handleScientificFunction('sin')} style={styles.sciButton} size="small" />
            <Button label="cos" onPress={() => handleScientificFunction('cos')} style={styles.sciButton} size="small" />
            <Button label="tan" onPress={() => handleScientificFunction('tan')} style={styles.sciButton} size="small" />
            <Button label="sinh" onPress={() => handleScientificFunction('sinh')} style={styles.sciButton} size="small" />
          </View>

          {/* Scientific Functions - Always Visible Row 2: Inverse Trig */}
          <View style={styles.scientificRow}>
            <Button label="asin" onPress={() => handleScientificFunction('asin')} style={styles.sciButton} size="small" />
            <Button label="acos" onPress={() => handleScientificFunction('acos')} style={styles.sciButton} size="small" />
            <Button label="atan" onPress={() => handleScientificFunction('atan')} style={styles.sciButton} size="small" />
            <Button label="cosh" onPress={() => handleScientificFunction('cosh')} style={styles.sciButton} size="small" />
          </View>

          {/* Scientific Functions - Always Visible Row 3: Logarithmic */}
          <View style={styles.scientificRow}>
            <Button label="log" onPress={() => handleScientificFunction('log')} style={styles.sciButton} size="small" />
            <Button label="ln" onPress={() => handleScientificFunction('ln')} style={styles.sciButton} size="small" />
            <Button label="log₂" onPress={() => handleScientificFunction('log2')} style={styles.sciButton} size="small" />
            <Button label="tanh" onPress={() => handleScientificFunction('tanh')} style={styles.sciButton} size="small" />
          </View>

          {/* Scientific Functions - Always Visible Row 4: Roots & Powers */}
          <View style={styles.scientificRow}>
            <Button label="√" onPress={() => handleScientificFunction('sqrt')} style={styles.sciButton} size="small" />
            <Button label="∛" onPress={() => handleScientificFunction('cbrt')} style={styles.sciButton} size="small" />
            <Button label="x^y" onPress={() => handleOperation('^')} style={styles.sciButton} size="small" />
            <Button label="2^x" onPress={() => handleScientificFunction('2^x')} style={styles.sciButton} size="small" />
          </View>

          {/* Show More Button */}
          <TouchableOpacity 
            style={styles.moreButton}
            onPress={() => setShowAdvanced(!showAdvanced)}
          >
            <Text style={styles.moreButtonText}>
              {showAdvanced ? '▼ LESS' : '► MORE'}
            </Text>
          </TouchableOpacity>

          {/* Additional Advanced Functions - Conditionally Shown */}
          {showAdvanced && (
            <>
              {/* Scientific Functions - More Functions Row */}
              <View style={styles.scientificRow}>
                <Button label="e" onPress={() => handleScientificFunction('e')} style={styles.sciButton} size="small" />
                <Button label="π" onPress={() => handleScientificFunction('π')} style={styles.sciButton} size="small" />
                <Button label="e^x" onPress={() => handleScientificFunction('e^x')} style={styles.sciButton} size="small" />
                <Button label="10^x" onPress={() => handleScientificFunction('10^x')} style={styles.sciButton} size="small" />
              </View>

              {/* Scientific Functions - Special Functions Row */}
              <View style={styles.scientificRow}>
                <Button label="x²" onPress={() => handleScientificFunction('x²')} style={styles.sciButton} size="small" />
                <Button label="x³" onPress={() => handleScientificFunction('x³')} style={styles.sciButton} size="small" />
                <Button label="1/x" onPress={() => handleScientificFunction('1/x')} style={styles.sciButton} size="small" />
                <Button label="n!" onPress={() => handleScientificFunction('n!')} style={styles.sciButton} size="small" />
              </View>

              {/* Scientific Functions - Final Row */}
              <View style={styles.scientificRow}>
                <Button label="|x|" onPress={() => handleScientificFunction('|x|')} style={styles.sciButton} size="small" />
                <Button label="DEL" onPress={handleDelete} style={styles.sciButton} size="small" />
                <Button label="(" onPress={() => setDisplay(display + '(')} style={styles.sciButton} size="small" />
                <Button label=")" onPress={() => setDisplay(display + ')')} style={styles.sciButton} size="small" />
              </View>

              {/* Additional Trig Functions Row */}
              <View style={styles.scientificRow}>
                <Button label="sec" onPress={() => handleScientificFunction('sec')} style={styles.sciButton} size="small" />
                <Button label="csc" onPress={() => handleScientificFunction('csc')} style={styles.sciButton} size="small" />
                <Button label="cot" onPress={() => handleScientificFunction('cot')} style={styles.sciButton} size="small" />
                <Button label="φ" onPress={() => handleScientificFunction('φ')} style={styles.sciButton} size="small" />
              </View>

              {/* Conversion Functions Row */}
              <View style={styles.scientificRow}>
                <Button label="°→Rad" onPress={() => handleScientificFunction('Deg→Rad')} style={styles.sciButton} size="small" />
                <Button label="Rad→°" onPress={() => handleScientificFunction('Rad→Deg')} style={styles.sciButton} size="small" />
                <Button label="rand" onPress={() => handleScientificFunction('rand')} style={styles.sciButton} size="small" />
                <Button label="π/2" onPress={() => setDisplay(String(Math.PI / 2))} style={styles.sciButton} size="small" />
              </View>

              {/* Number Base Conversion Row */}
              <View style={styles.scientificRow}>
                <Button label="Hex" onPress={() => handleScientificFunction('Hex')} style={styles.sciButton} size="small" />
                <Button label="Bin" onPress={() => handleScientificFunction('Bin')} style={styles.sciButton} size="small" />
                <Button label="Oct" onPress={() => handleScientificFunction('Oct')} style={styles.sciButton} size="small" />
                <Button label="e/2" onPress={() => setDisplay(String(Math.E / 2))} style={styles.sciButton} size="small" />
              </View>

              {/* Advanced Functions Row - More options*/}
              <View style={styles.scientificRow}>
                <Button label="2π" onPress={() => setDisplay(String(2 * Math.PI))} style={styles.sciButton} size="small" />
                <Button label="√2" onPress={() => setDisplay(String(Math.sqrt(2)))} style={styles.sciButton} size="small" />
                <Button label="1/2π" onPress={() => setDisplay(String(1 / (2 * Math.PI)))} style={styles.sciButton} size="small" />
                <Button label="ln(2)" onPress={() => setDisplay(String(Math.log(2)))} style={styles.sciButton} size="small" />
              </View>
            </>
          )}

          {/* Divider */}
          <View style={styles.divider} />

          {/* Main Button Grid */}
          <View style={styles.buttonGrid}>
            {/* Row 1 - Functions */}
            <View style={styles.row}>
              <Button label="AC" onPress={handleClear} style={[styles.functionButton, { flex: 2 }]} />
              <Button label="+/-" onPress={handleNegate} style={styles.functionButton} />
              <Button label="%" onPress={() => handleOperation('%')} style={styles.functionButton} />
              <Button label="÷" onPress={() => handleOperation('÷')} style={styles.operationButton} />
            </View>

            {/* Row 2 */}
            <View style={styles.row}>
              <Button label="7" onPress={() => handleNumberPress(7)} style={styles.numberButton} />
              <Button label="8" onPress={() => handleNumberPress(8)} style={styles.numberButton} />
              <Button label="9" onPress={() => handleNumberPress(9)} style={styles.numberButton} />
              <Button label="×" onPress={() => handleOperation('×')} style={styles.operationButton} />
            </View>

            {/* Row 3 */}
            <View style={styles.row}>
              <Button label="4" onPress={() => handleNumberPress(4)} style={styles.numberButton} />
              <Button label="5" onPress={() => handleNumberPress(5)} style={styles.numberButton} />
              <Button label="6" onPress={() => handleNumberPress(6)} style={styles.numberButton} />
              <Button label="-" onPress={() => handleOperation('-')} style={styles.operationButton} />
            </View>

            {/* Row 4 */}
            <View style={styles.row}>
              <Button label="1" onPress={() => handleNumberPress(1)} style={styles.numberButton} />
              <Button label="2" onPress={() => handleNumberPress(2)} style={styles.numberButton} />
              <Button label="3" onPress={() => handleNumberPress(3)} style={styles.numberButton} />
              <Button label="+" onPress={() => handleOperation('+')} style={styles.operationButton} />
            </View>

            {/* Row 5 */}
            <View style={styles.row}>
              <Button label="0" onPress={() => handleNumberPress(0)} style={[styles.numberButton, { flex: 2 }]} />
              <Button label="." onPress={handleDecimal} style={styles.numberButton} />
              <Button label="=" onPress={handleEquals} style={styles.equalsButton} />
            </View>

            {/* Backspace Row */}
            <View style={styles.row}>
              <Button label="⌫" onPress={handleDelete} style={[styles.deleteButton, { flex: 1 }]} />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 0,
    paddingBottom: 10,
  },
  calculatorContainer: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingHorizontal: 14,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  memoryIndicator: {
    fontSize: 12,
    color: '#1a237e',
    fontWeight: '600',
    backgroundColor: '#ece7f2',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  memoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  memButton: {
    backgroundColor: '#f1f3f4',
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  modeTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a237e',
  },
  angleModeButton: {
    backgroundColor: '#f1f3f4',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  angleModeText: {
    color: '#4b56a0',
    fontWeight: '600',
    fontSize: 12,
  },
  displayArea: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 30,
    marginBottom: 15,
    justifyContent: 'flex-end',
    minHeight: 100,
  },
  mainDisplay: {
    fontSize: 56,
    fontWeight: '600',
    color: '#202124',
    textAlign: 'right',
  },
  scientificRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
    paddingHorizontal: 2,
  },
  sciButton: {
    backgroundColor: '#e8f0fe',
    flex: 1,
  },
  moreButton: {
    backgroundColor: '#ffffff',
    paddingVertical: 12,
    marginHorizontal: 2,
    marginBottom: 10,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e8eaed',
  },
  moreButtonText: {
    color: '#4b56a0',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
  },
  divider: {
    height: 1,
    backgroundColor: '#e8eaed',
    marginVertical: 12,
  },
  buttonGrid: {
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 2,
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 15,
    margin: 5,
    height: 60,
  },
  smallButton: {
    aspectRatio: 1.2,
    minHeight: 55,
  },
  buttonText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#202124',
  },
  smallButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a237e',
  },
  numberButton: {
    backgroundColor: '#f8f9fa',
  },
  functionButton: {
    backgroundColor: '#ece7f2',
  },
  operationButton: {
    backgroundColor: '#dbe2f9',
  },
  equalsButton: {
    backgroundColor: '#4b56a0',
    flex: 1,
  },
  deleteButton: {
    backgroundColor: '#fad2cf',
  },
});
