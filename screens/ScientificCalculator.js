import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Dimensions, ScrollView, Modal } from 'react-native';

const { width } = Dimensions.get('window');
const BUTTON_SIZE = (width - 60) / 4;
const SCI_BUTTON_SIZE = (width - 70) / 4;

export default function ScientificCalculator({ navigation }) {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('');
  const [angleMode, setAngleMode] = useState('DEG');
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [memory, setMemory] = useState(0);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const calculatePreview = (expr) => {
    try {
      if (!expr) {
        setResult('');
        return;
      }
      // Helper for trig functions with angle mode
      const trig = (func, val) => {
        if (angleMode === 'DEG' && ['sin', 'cos', 'tan'].includes(func)) {
          return Math[func](val * Math.PI / 180);
        }
        if (angleMode === 'DEG' && ['asin', 'acos', 'atan'].includes(func)) {
          return Math[func](val) * 180 / Math.PI;
        }
        return Math[func](val);
      };

      // Replace symbols for evaluation
      let sanitizedExpr = expr
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/π/g, 'Math.PI')
        .replace(/e/g, 'Math.E')
        .replace(/√\(/g, 'Math.sqrt(')
        .replace(/∛\(/g, 'Math.cbrt(')
        .replace(/log\(/g, 'Math.log10(')
        .replace(/ln\(/g, 'Math.log(')
        .replace(/\^/g, '**')
        .replace(/(sin|cos|tan|asin|acos|atan|sinh|cosh|tanh)\(/g, 'trig("$1", ');

      // Basic check for trailing operators or unclosed parens
      if (/[+\-*/.**]$/.test(sanitizedExpr)) return;
      
      const evalResult = new Function('trig', `return ${sanitizedExpr}`)(trig);
      if (evalResult !== undefined && !isNaN(evalResult)) {
        const formattedResult = Number(evalResult.toFixed(8));
        setResult(String(formattedResult));
      }
    } catch (e) {
      // Don't show error in preview
    }
  };

  useEffect(() => {
    calculatePreview(expression);
  }, [expression, angleMode]);

  const saveToHistory = (expr, res) => {
    if (!expr || !res || expr === res) return;
    const item = { expression: expr, result: res, id: Date.now() };
    setHistory(prev => [item, ...prev].slice(0, 50));
  };

  const handlePress = (value) => {
    const isOperator = (c) => ['+', '-', '×', '÷', '%', '^'].includes(c);
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
    } else if (['sin', 'cos', 'tan', 'log', 'ln', '√', '∛'].includes(value)) {
      setExpression(prev => prev + value + '(');
    } else if (value === 'x²') {
      setExpression(prev => prev + '**2');
    } else if (value === 'x^y') {
      setExpression(prev => prev + '^');
    } else if (value === 'π' || value === 'e') {
      setExpression(prev => prev + value);
    } else if (value === '(' || value === ')') {
      setExpression(prev => prev + value);
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

  const handleMemory = (type) => {
    const currentVal = parseFloat(result || expression || '0');
    if (type === 'M+') setMemory(prev => prev + currentVal);
    if (type === 'M-') setMemory(prev => prev - currentVal);
    if (type === 'MR') setExpression(prev => prev + memory);
    if (type === 'MC') setMemory(0);
  };

  const Button = ({ label, type = 'number', onPress, flex = 1, size = 'normal' }) => {
    let backgroundColor = '#f8f9fa';
    let textColor = '#202124';
    let btnWidth = size === 'sci' ? SCI_BUTTON_SIZE : BUTTON_SIZE;

    if (type === 'operator') {
      backgroundColor = '#dbe2f9';
      textColor = '#1a237e';
    } else if (type === 'function') {
      backgroundColor = '#ece7f2';
      textColor = '#4a148c';
    } else if (type === 'equals') {
      backgroundColor = '#4b56a0';
      textColor = '#fff';
    } else if (type === 'sci') {
      backgroundColor = '#e8f0fe';
      textColor = '#1a237e';
    }

    return (
      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor, flex, height: size === 'sci' ? 45 : BUTTON_SIZE },
          flex > 1 ? { borderRadius: 40, width: 'auto' } : { width: btnWidth }
        ]}
        onPress={() => onPress(label)}
        activeOpacity={0.7}
      >
        <Text style={[styles.buttonText, size === 'sci' && styles.sciButtonText, { color: textColor }]}>
          {label}
        </Text>
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
        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Simple')}>
          <Text style={styles.iconText}>🔢</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.angleToggle} 
          onPress={() => setAngleMode(angleMode === 'DEG' ? 'RAD' : 'DEG')}
        >
          <Text style={styles.angleText}>{angleMode}</Text>
        </TouchableOpacity>
      </View>

      {/* History Modal */}
      <Modal visible={showHistory} animationType="slide" transparent={true}>
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
                    onPress={() => { setExpression(item.expression); setShowHistory(false); }}
                  >
                    <Text style={styles.historyExpr}>{item.expression}</Text>
                    <Text style={styles.historyRes}>= {item.result}</Text>
                  </TouchableOpacity>
                ))
              )}
            </ScrollView>
            <TouchableOpacity style={styles.clearHistoryButton} onPress={() => setHistory([])}>
              <Text style={styles.clearHistoryText}>Clear History</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Display Area */}
        <View style={styles.displayArea}>
          <Text style={styles.expressionText} numberOfLines={2}>{expression || '0'}</Text>
          <Text style={styles.resultText}>{result}</Text>
        </View>

        <View style={styles.divider} />

        {/* Scientific Section */}
        <View style={styles.sciGrid}>
          <View style={styles.row}>
            <Button label="M+" type="sci" size="sci" onPress={() => handleMemory('M+')} />
            <Button label="M-" type="sci" size="sci" onPress={() => handleMemory('M-')} />
            <Button label="MR" type="sci" size="sci" onPress={() => handleMemory('MR')} />
            <Button label="MC" type="sci" size="sci" onPress={() => handleMemory('MC')} />
          </View>
          <View style={styles.row}>
            <Button label="sin" type="sci" size="sci" onPress={handlePress} />
            <Button label="cos" type="sci" size="sci" onPress={handlePress} />
            <Button label="tan" type="sci" size="sci" onPress={handlePress} />
            <Button label="(" type="sci" size="sci" onPress={handlePress} />
          </View>
          <View style={styles.row}>
            <Button label="log" type="sci" size="sci" onPress={handlePress} />
            <Button label="ln" type="sci" size="sci" onPress={handlePress} />
            <Button label="√" type="sci" size="sci" onPress={handlePress} />
            <Button label=")" type="sci" size="sci" onPress={handlePress} />
          </View>
          {showAdvanced && (
            <>
              <View style={styles.row}>
                <Button label="x²" type="sci" size="sci" onPress={handlePress} />
                <Button label="x^y" type="sci" size="sci" onPress={handlePress} />
                <Button label="π" type="sci" size="sci" onPress={handlePress} />
                <Button label="e" type="sci" size="sci" onPress={handlePress} />
              </View>
            </>
          )}
          <TouchableOpacity style={styles.moreButton} onPress={() => setShowAdvanced(!showAdvanced)}>
            <Text style={styles.moreText}>{showAdvanced ? '▼ LESS' : '► MORE'}</Text>
          </TouchableOpacity>
        </View>

        {/* Main Grid */}
        <View style={styles.mainGrid}>
          <View style={styles.row}>
            <Button label="AC" type="function" onPress={handlePress} />
            <Button label="⌫" type="function" onPress={handlePress} />
            <Button label="%" type="function" onPress={handlePress} />
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
            <Button label="+/-" onPress={handlePress} />
            <Button label="0" onPress={handlePress} />
            <Button label="." onPress={handlePress} />
            <Button label="=" type="equals" onPress={handlePress} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContent: { paddingBottom: 20 },
  iconBar: { flexDirection: 'row', paddingHorizontal: 20, paddingTop: 10, gap: 20, alignItems: 'center' },
  iconButton: { padding: 5 },
  iconText: { fontSize: 20, color: '#5f6368' },
  angleToggle: { backgroundColor: '#f1f3f4', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 6 },
  angleText: { fontSize: 12, fontWeight: '700', color: '#4b56a0' },
  displayArea: { minHeight: 150, justifyContent: 'flex-end', paddingHorizontal: 25, paddingVertical: 20 },
  expressionText: { fontSize: 40, color: '#202124', textAlign: 'right' },
  resultText: { fontSize: 28, color: '#70757a', textAlign: 'right', marginTop: 10 },
  divider: { height: 1, backgroundColor: '#e8eaed', marginHorizontal: 20, marginBottom: 15 },
  sciGrid: { paddingHorizontal: 20, gap: 8, marginBottom: 15 },
  mainGrid: { paddingHorizontal: 20, gap: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
  button: { borderRadius: 15, justifyContent: 'center', alignItems: 'center', elevation: 1 },
  buttonText: { fontSize: 22, fontWeight: '500' },
  sciButtonText: { fontSize: 16, fontWeight: '600' },
  moreButton: { alignItems: 'center', paddingVertical: 8, backgroundColor: '#f8f9fa', borderRadius: 8, marginTop: 4 },
  moreText: { fontSize: 12, fontWeight: '700', color: '#4b56a0' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  historyContainer: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, height: '70%', padding: 24 },
  historyHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  historyTitle: { fontSize: 24, fontWeight: '700', color: '#202124' },
  closeButton: { fontSize: 24, color: '#5f6368' },
  historyList: { flex: 1 },
  historyItem: { paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#f1f3f4' },
  historyExpr: { fontSize: 18, color: '#5f6368', textAlign: 'right' },
  historyRes: { fontSize: 24, fontWeight: '600', color: '#202124', textAlign: 'right', marginTop: 4 },
  emptyHistory: { textAlign: 'center', marginTop: 40, color: '#70757a' },
  clearHistoryButton: { padding: 16, alignItems: 'center', marginTop: 10, backgroundColor: '#f8f9fa', borderRadius: 12 },
  clearHistoryText: { color: '#d93025', fontWeight: '600' },
});

