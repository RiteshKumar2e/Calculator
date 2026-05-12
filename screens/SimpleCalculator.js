import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Dimensions, ScrollView, Modal } from 'react-native';

const { width } = Dimensions.get('window');
const BUTTON_SIZE = (width - 60) / 4;

export default function SimpleCalculator({ navigation }) {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('');
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  const calculatePreview = (expr) => {
    try {
      if (!expr) {
        setResult('');
        return;
      }
      const sanitizedExpr = expr.replace(/×/g, '*').replace(/÷/g, '/').replace(/%/g, '/100');
      
      if (/[+\-*/.]$/.test(sanitizedExpr)) {
        return;
      }

      const evalResult = new Function(`return ${sanitizedExpr}`)();
      if (evalResult !== undefined && !isNaN(evalResult)) {
        const formattedResult = Number(evalResult.toFixed(8));
        setResult(String(formattedResult));
      }
    } catch (e) {
      // Preview stays empty on error
    }
  };

  useEffect(() => {
    calculatePreview(expression);
  }, [expression]);

  const saveToHistory = (expr, res) => {
    if (!expr || !res || expr === res) return;
    const item = { expression: expr, result: res, id: Date.now() };
    setHistory(prev => [item, ...prev].slice(0, 50));
  };

  const handlePress = (value) => {
    const isOperator = (c) => ['+', '-', '×', '÷', '%'].includes(c);
    const lastChar = expression.slice(-1);

    if (value === 'AC') {
      setExpression('');
      setResult('');
    } else if (value === '⌫') {
      setExpression(prev => prev.slice(0, -1));
    } else if (value === '=') {
      if (result && result !== 'Error' && expression !== result) {
        saveToHistory(expression, result);
        setExpression(result);
        setResult('');
      }
    } else if (value === '+/-') {
      if (!expression) return;
      setExpression(prev => {
        const parts = prev.split(/([+\-×÷])/);
        const lastPart = parts[parts.length - 1];
        if (lastPart && !isNaN(lastPart)) {
          parts[parts.length - 1] = String(parseFloat(lastPart) * -1);
          return parts.join('');
        }
        return prev;
      });
    } else if (value === '.') {
      const parts = expression.split(/[+\-×÷]/);
      const lastNumber = parts[parts.length - 1] || '';
      if (!lastNumber.includes('.')) {
        setExpression(prev => prev + '.');
      }
    } else if (isOperator(value)) {
      if (!expression && value !== '-') return;
      if (isOperator(lastChar)) {
        setExpression(prev => prev.slice(0, -1) + value);
      } else {
        setExpression(prev => prev + value);
      }
    } else {
      if (expression === '0') {
        setExpression(value);
      } else {
        setExpression(prev => prev + value);
      }
    }
  };

  const Button = ({ label, type = 'number', onPress, flex = 1 }) => {
    let backgroundColor = '#f8f9fa';
    let textColor = '#000';

    if (type === 'operator') {
      backgroundColor = '#dbe2f9';
      textColor = '#1a237e';
    } else if (type === 'function') {
      backgroundColor = '#ece7f2';
      textColor = '#4a148c';
    } else if (type === 'equals') {
      backgroundColor = '#4b56a0';
      textColor = '#fff';
    }

    return (
      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor, flex },
          flex > 1 ? { borderRadius: 40, width: 'auto' } : { width: BUTTON_SIZE }
        ]}
        onPress={() => onPress(label)}
        activeOpacity={0.7}
      >
        <Text style={[styles.buttonText, { color: textColor }]}>{label}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Icons Area */}
      <View style={styles.iconBar}>
        <TouchableOpacity style={styles.iconButton} onPress={() => setShowHistory(true)}>
          <Text style={styles.iconText}>🕒</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Scientific')}>
          <Text style={styles.iconText}>📏</Text>
        </TouchableOpacity>
      </View>

      {/* History Modal */}
      <Modal
        visible={showHistory}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowHistory(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.historyContainer}>
            <View style={styles.historyHeader}>
              <Text style={styles.historyTitle}>History</Text>
              <TouchableOpacity onPress={() => setShowHistory(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.historyList}>
              {history.length === 0 ? (
                <Text style={styles.emptyHistory}>No history yet</Text>
              ) : (
                history.map((item) => (
                  <TouchableOpacity 
                    key={item.id} 
                    style={styles.historyItem}
                    onPress={() => {
                      setExpression(item.expression);
                      setShowHistory(false);
                    }}
                  >
                    <Text style={styles.historyExpr}>{item.expression}</Text>
                    <Text style={styles.historyRes}>= {item.result}</Text>
                  </TouchableOpacity>
                ))
              )}
            </ScrollView>
            <TouchableOpacity 
              style={styles.clearHistoryButton}
              onPress={() => setHistory([])}
            >
              <Text style={styles.clearHistoryText}>Clear History</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Display Area */}
      <View style={styles.displayArea}>
        <View style={styles.expressionContainer}>
          <Text style={styles.expressionText} numberOfLines={2} ellipsizeMode="head">
            {expression || '0'}
          </Text>
        </View>
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>
            {result}
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      {/* Button Grid */}
      <View style={styles.buttonGrid}>
        <View style={styles.row}>
          <Button label="AC" type="function" onPress={handlePress} />
          <Button label="⌫" type="function" onPress={handlePress} />
          <Button label="+/-" type="function" onPress={handlePress} />
          <Button label="÷" type="operator" onPress={handlePress} />
        </View>

        <View style={styles.row}>
          <Button label="7" onPress={handlePress} />
          <Button label="8" onPress={handlePress} />
          <Button label="9" onPress={handlePress} />
          <Button label="×" type="operator" onPress={handlePress} />
        </View>

        <View style={styles.row}>
          <Button label="4" onPress={handlePress} />
          <Button label="5" onPress={handlePress} />
          <Button label="6" onPress={handlePress} />
          <Button label="-" type="operator" onPress={handlePress} />
        </View>

        <View style={styles.row}>
          <Button label="1" onPress={handlePress} />
          <Button label="2" onPress={handlePress} />
          <Button label="3" onPress={handlePress} />
          <Button label="+" type="operator" onPress={handlePress} />
        </View>

        <View style={styles.row}>
          <Button label="%" type="number" onPress={handlePress} />
          <Button label="0" onPress={handlePress} />
          <Button label="." onPress={handlePress} />
          <Button label="=" type="equals" onPress={handlePress} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  iconBar: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 10,
    gap: 20,
  },
  iconButton: {
    padding: 5,
  },
  iconText: {
    fontSize: 20,
    color: '#5f6368',
  },
  displayArea: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 25,
    paddingBottom: 20,
  },
  expressionContainer: {
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  expressionText: {
    fontSize: 56,
    color: '#202124',
    textAlign: 'right',
  },
  resultContainer: {
    alignItems: 'flex-end',
    minHeight: 40,
  },
  resultText: {
    fontSize: 32,
    color: '#70757a',
    textAlign: 'right',
  },
  divider: {
    height: 1,
    backgroundColor: '#e8eaed',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  buttonGrid: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  button: {
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  buttonText: {
    fontSize: 24,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  historyContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: '70%',
    padding: 24,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  historyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#202124',
  },
  closeButton: {
    fontSize: 24,
    color: '#5f6368',
    padding: 5,
  },
  historyList: {
    flex: 1,
  },
  historyItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f4',
  },
  historyExpr: {
    fontSize: 18,
    color: '#5f6368',
    textAlign: 'right',
  },
  historyRes: {
    fontSize: 24,
    fontWeight: '600',
    color: '#202124',
    textAlign: 'right',
    marginTop: 4,
  },
  emptyHistory: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    color: '#70757a',
  },
  clearHistoryButton: {
    padding: 16,
    alignItems: 'center',
    marginTop: 10,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
  },
  clearHistoryText: {
    color: '#d93025',
    fontWeight: '600',
    fontSize: 16,
  },
});

