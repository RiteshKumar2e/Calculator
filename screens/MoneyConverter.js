import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, TextInput } from 'react-native';

export default function MoneyConverter() {
  const [amount, setAmount] = useState('1');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [conversionHistory, setConversionHistory] = useState([]);
  const [convertedAmount, setConvertedAmount] = useState('0.92');
  const [exchangeRates, setExchangeRates] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const defaultRates = {
    USD: 1,
    EUR: 0.92,
    GBP: 0.79,
    JPY: 149.50,
    CNY: 7.24,
    INR: 83.12,
    AUD: 1.53,
    CAD: 1.36,
    CHF: 0.88,
    MXN: 17.05,
    BRL: 4.97,
    ZAR: 18.65,
    RUB: 92.50,
    KRW: 1320.00,
    SGD: 1.34,
    HKD: 7.82,
    NOK: 10.65,
    SEK: 10.45,
    DKK: 6.86,
    PLN: 3.95,
  };

  const currencies = Object.keys(exchangeRates).length > 0 ? Object.keys(exchangeRates) : Object.keys(defaultRates);

  // Fetch real exchange rates from API
  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        const data = await response.json();
        
        if (data && data.rates) {
          // Filter to only include rates we want
          const filtered = {};
          Object.keys(defaultRates).forEach(currency => {
            if (data.rates[currency]) {
              filtered[currency] = data.rates[currency];
            } else {
              filtered[currency] = defaultRates[currency];
            }
          });
          setExchangeRates(filtered);
          setError(null);
        } else {
          setExchangeRates(defaultRates);
        }
      } catch (err) {
        console.warn('Failed to fetch exchange rates:', err);
        setExchangeRates(defaultRates);
        setError('Using offline rates');
      } finally {
        setLoading(false);
      }
    };

    fetchExchangeRates();
  }, []);

  // Update conversion result when inputs change
  useEffect(() => {
    if (Object.keys(exchangeRates).length === 0) return;
    
    const amountNum = parseFloat(amount) || 0;
    const fromRate = exchangeRates[fromCurrency];
    const toRate = exchangeRates[toCurrency];
    
    if (!fromRate || !toRate) return;
    
    // Convert to USD first, then to target currency
    const result = (amountNum / fromRate) * toRate;
    setConvertedAmount(result.toFixed(2));
    
    // Add to conversion history
    const conversion = `${amountNum.toFixed(2)} ${fromCurrency} = ${result.toFixed(2)} ${toCurrency}`;
    setConversionHistory(prev => [conversion, ...prev].slice(0, 15));
  }, [amount, fromCurrency, toCurrency, exchangeRates]);

  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const handleClearHistory = () => {
    setConversionHistory([]);
  };

  const CurrencyButton = ({ currency, isSelected, onPress }) => (
    <TouchableOpacity
      style={[styles.currencyButton, isSelected && styles.currencyButtonSelected]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.currencyButtonText, isSelected && styles.currencyButtonTextSelected]}>
        {currency}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.converterContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>💰 Money Converter</Text>
            <Text style={styles.headerSubtitle}>Convert between currencies</Text>
            {loading && <Text style={styles.loadingText}>Fetching live rates...</Text>}
            {error && <Text style={styles.errorText}>{error}</Text>}
          </View>

          {/* Amount Input */}
          <View style={styles.inputSection}>
            <Text style={styles.label}>Amount</Text>
            <TextInput
              style={styles.input}
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              placeholder="Enter amount"
              placeholderTextColor="#666"
            />
          </View>

          {/* From Currency */}
          <View style={styles.currencySection}>
            <Text style={styles.label}>From</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.currencyScroll}>
              {currencies.map((currency) => (
                <CurrencyButton
                  key={currency}
                  currency={currency}
                  isSelected={fromCurrency === currency}
                  onPress={() => setFromCurrency(currency)}
                />
              ))}
            </ScrollView>
          </View>

          {/* Swap Button */}
          <TouchableOpacity style={styles.swapButton} onPress={handleSwapCurrencies}>
            <Text style={styles.swapButtonText}>⇅ Swap</Text>
          </TouchableOpacity>

          {/* To Currency */}
          <View style={styles.currencySection}>
            <Text style={styles.label}>To</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.currencyScroll}>
              {currencies.map((currency) => (
                <CurrencyButton
                  key={currency}
                  currency={currency}
                  isSelected={toCurrency === currency}
                  onPress={() => setToCurrency(currency)}
                />
              ))}
            </ScrollView>
          </View>

          {/* Result Display */}
          <View style={styles.resultSection}>
            <Text style={styles.resultLabel}>Result</Text>
            <Text style={styles.resultAmount}>
              {loading ? '...' : `${convertedAmount} ${toCurrency}`}
            </Text>
            {!loading && exchangeRates[toCurrency] && exchangeRates[fromCurrency] && (
              <Text style={styles.resultSubtext}>
                1 {fromCurrency} = {(exchangeRates[toCurrency] / exchangeRates[fromCurrency]).toFixed(4)} {toCurrency}
              </Text>
            )}
          </View>

          {/* Conversion History */}
          {conversionHistory.length > 0 && (
            <View style={styles.historySection}>
              <View style={styles.historyHeader}>
                <Text style={styles.historyTitle}>Recent Conversions</Text>
                <TouchableOpacity onPress={handleClearHistory}>
                  <Text style={styles.clearHistoryText}>Clear</Text>
                </TouchableOpacity>
              </View>
              <ScrollView style={styles.historyList} showsVerticalScrollIndicator={false}>
                {conversionHistory.map((conversion, index) => (
                  <Text key={index} style={styles.historyItem}>{conversion}</Text>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Disclaimer */}
          <Text style={styles.disclaimer}>
            * Exchange rates fetched from live data (Updated daily)
          </Text>
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
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  converterContainer: {
    flex: 1,
  },
  header: {
    marginBottom: 30,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ff9500',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#999',
  },
  loadingText: {
    fontSize: 12,
    color: '#ff9500',
    marginTop: 8,
  },
  errorText: {
    fontSize: 12,
    color: '#ff6b6b',
    marginTop: 8,
  },
  inputSection: {
    marginBottom: 25,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 18,
    fontSize: 24,
    color: '#fff',
    fontWeight: '600',
    borderWidth: 2,
    borderColor: '#333',
  },
  currencySection: {
    marginBottom: 20,
  },
  currencyScroll: {
    flexDirection: 'row',
  },
  currencyButton: {
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    marginRight: 10,
    borderWidth: 2,
    borderColor: '#333',
  },
  currencyButtonSelected: {
    backgroundColor: '#ff9500',
    borderColor: '#ff9500',
  },
  currencyButtonText: {
    color: '#999',
    fontSize: 14,
    fontWeight: '600',
  },
  currencyButtonTextSelected: {
    color: '#000',
  },
  swapButton: {
    backgroundColor: '#2d5a7b',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  swapButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  resultSection: {
    backgroundColor: '#1a1a1a',
    borderRadius: 15,
    padding: 25,
    marginBottom: 25,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ff9500',
  },
  resultLabel: {
    fontSize: 14,
    color: '#999',
    marginBottom: 10,
  },
  resultAmount: {
    fontSize: 36,
    fontWeight: '700',
    color: '#ff9500',
    marginBottom: 10,
  },
  resultSubtext: {
    fontSize: 13,
    color: '#666',
  },
  historySection: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    maxHeight: 200,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
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
    maxHeight: 150,
  },
  historyItem: {
    color: '#999',
    fontSize: 13,
    paddingVertical: 4,
    fontFamily: 'monospace',
  },
  disclaimer: {
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
