import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';

export default function SimpleCalculator() {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState(null);
  const [operation, setOperation] = useState(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [history, setHistory] = useState('');
  const [calculationHistory, setCalculationHistory] = useState([]);

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
      default:
        return current;
    }
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
      style={[styles.button, style]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={[styles.buttonText, textStyle]}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.calculatorContainer}>
        {/* History Section */}
        {calculationHistory.length > 0 && (
          <View style={styles.historySection}>
            <View style={styles.historyHeader}>
              <Text style={styles.historyTitle}>Recent Calculations</Text>
              <TouchableOpacity onPress={handleClearHistory}>
                <Text style={styles.clearHistoryText}>Clear</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.historyList} showsVerticalScrollIndicator={false}>
              {calculationHistory.map((calc, index) => (
                <Text key={index} style={styles.historyItem}>{calc}</Text>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Display Area */}
        <View style={styles.displayArea}>
          <Text style={styles.historyText} numberOfLines={1}>{history}</Text>
          <Text style={styles.mainDisplay} numberOfLines={2}>{display}</Text>
        </View>

        {/* Button Grid */}
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

          {/* Row 6 - Backspace */}
          <View style={styles.row}>
            <Button label="AC" onPress={handleClear} style={[styles.functionButton]} />
            <Button label="⌫" onPress={handleDelete} style={[styles.deleteButton, { flex: 2 }]} />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingHorizontal: 0,
  },
  calculatorContainer: {
    flex: 1,
    backgroundColor: '#000',
    paddingTop: 10,
    paddingHorizontal: 10,
    paddingBottom: 10,
    justifyContent: 'flex-end',
  },
  historySection: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    maxHeight: 150,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  historyTitle: {
    color: '#ff9500',
    fontSize: 14,
    fontWeight: '600',
  },
  clearHistoryText: {
    color: '#ff4444',
    fontSize: 12,
    fontWeight: '600',
  },
  historyList: {
    maxHeight: 100,
  },
  historyItem: {
    color: '#999',
    fontSize: 13,
    paddingVertical: 3,
    fontFamily: 'monospace',
  },
  displayArea: {
    backgroundColor: '#000',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 30,
    marginBottom: 20,
    justifyContent: 'flex-end',
    minHeight: 100,
  },
  historyText: {
    fontSize: 20,
    color: '#666',
    fontWeight: '500',
    marginBottom: 8,
    textAlign: 'right',
  },
  mainDisplay: {
    fontSize: 64,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'right',
  },
  buttonGrid: {
    gap: 10,
    marginBottom: 10,
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
  buttonText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
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
