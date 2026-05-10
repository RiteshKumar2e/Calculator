import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';

export default function ScientificCalculator() {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState(null);
  const [operation, setOperation] = useState(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [angleMode, setAngleMode] = useState('DEG');
  const [history, setHistory] = useState('');

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
      case 'log':
        result = Math.log10(value);
        break;
      case 'ln':
        result = Math.log(value);
        break;
      case 'sqrt':
        result = Math.sqrt(value);
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
      case '|x|':
        result = Math.abs(value);
        break;
      default:
        result = value;
    }

    setDisplay(String(result));
    setWaitingForOperand(true);
  };

  const handleEquals = () => {
    const inputValue = parseFloat(display);

    if (previousValue !== null && operation) {
      const result = calculate(previousValue, inputValue, operation);
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
          {/* Header with angle mode */}
          <View style={styles.headerRow}>
            <Text style={styles.modeTitle}>Scientific</Text>
            <TouchableOpacity
              style={[styles.angleModeButton]}
              onPress={() => setAngleMode(angleMode === 'DEG' ? 'RAD' : 'DEG')}
            >
              <Text style={styles.angleModeText}>{angleMode}</Text>
            </TouchableOpacity>
          </View>

          {/* Display Area */}
          <View style={styles.displayArea}>
            <Text style={styles.historyText} numberOfLines={1}>{history}</Text>
            <Text style={styles.mainDisplay} numberOfLines={2}>{display}</Text>
          </View>

          {/* Scientific Functions - Top Row */}
          <View style={styles.scientificRow}>
            <Button label="sin" onPress={() => handleScientificFunction('sin')} style={styles.sciButton} size="small" />
            <Button label="cos" onPress={() => handleScientificFunction('cos')} style={styles.sciButton} size="small" />
            <Button label="tan" onPress={() => handleScientificFunction('tan')} style={styles.sciButton} size="small" />
            <Button label="π" onPress={() => setDisplay(String(Math.PI))} style={styles.sciButton} size="small" />
          </View>

          {/* Scientific Functions - Row 2 */}
          <View style={styles.scientificRow}>
            <Button label="log" onPress={() => handleScientificFunction('log')} style={styles.sciButton} size="small" />
            <Button label="ln" onPress={() => handleScientificFunction('ln')} style={styles.sciButton} size="small" />
            <Button label="√" onPress={() => handleScientificFunction('sqrt')} style={styles.sciButton} size="small" />
            <Button label="e^x" onPress={() => handleScientificFunction('e^x')} style={styles.sciButton} size="small" />
          </View>

          {/* Scientific Functions - Row 3 */}
          <View style={styles.scientificRow}>
            <Button label="x²" onPress={() => handleScientificFunction('x²')} style={styles.sciButton} size="small" />
            <Button label="x³" onPress={() => handleScientificFunction('x³')} style={styles.sciButton} size="small" />
            <Button label="1/x" onPress={() => handleScientificFunction('1/x')} style={styles.sciButton} size="small" />
            <Button label="|x|" onPress={() => handleScientificFunction('|x|')} style={styles.sciButton} size="small" />
          </View>

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
    backgroundColor: '#000',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 0,
    paddingBottom: 10,
  },
  calculatorContainer: {
    backgroundColor: '#000',
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
  modeTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ff9500',
  },
  angleModeButton: {
    backgroundColor: '#505050',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  angleModeText: {
    color: '#ff9500',
    fontWeight: '600',
    fontSize: 12,
  },
  displayArea: {
    backgroundColor: '#000',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 30,
    marginBottom: 15,
    justifyContent: 'flex-end',
    minHeight: 100,
  },
  historyText: {
    fontSize: 18,
    color: '#666',
    fontWeight: '500',
    marginBottom: 8,
    textAlign: 'right',
  },
  mainDisplay: {
    fontSize: 56,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'right',
  },
  scientificRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
    paddingHorizontal: 2,
  },
  sciButton: {
    backgroundColor: '#2d5a7b',
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: '#333',
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
    backgroundColor: '#333',
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
    color: '#fff',
  },
  smallButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
  numberButton: {
    backgroundColor: '#333333',
  },
  functionButton: {
    backgroundColor: '#505050',
  },
  operationButton: {
    backgroundColor: '#ff9500',
  },
  equalsButton: {
    backgroundColor: '#4CAF50',
    flex: 1,
  },
  deleteButton: {
    backgroundColor: '#a84545',
  },
});
