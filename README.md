# Calculator App - React Native

A beautiful, fully-functional calculator app built with React Native and Expo.

## Features

### 📱 Simple Calculator
- Basic arithmetic operations (+, -, ×, ÷)
- Percentage calculations
- Decimal support
- Delete/Backspace functionality
- **Live calculation history** - See your recent calculations as you work
- Clear history option
- Elegant dark theme UI

### 🔬 Scientific Calculator
- All simple calculator features
- Trigonometric functions (sin, cos, tan)
- Logarithmic functions (log, ln)
- Power functions (x², x³, x^y)
- Square root and absolute value
- Exponential functions (e^x)
- DEG/RAD angle mode toggle
- **Calculation history tracking**

### 💰 Money Converter (NEW!)
- Convert between 20+ currencies
- Real-time conversion display
- Swap currencies with one tap
- **Conversion history** - Track all your recent conversions
- Exchange rate reference
- Supported currencies: USD, EUR, GBP, JPY, CNY, INR, AUD, CAD, CHF, MXN, BRL, ZAR, RUB, KRW, SGD, HKD, NOK, SEK, DKK, PLN

## ✨ New Features Added

✅ **Proper Working Calculator History**
- Automatically saves calculations when you press "="
- Shows recent calculations in a scrollable list
- Example: "2 + 3 = 5" then "5 + 2 = 7" both appear in history
- Clear history button to remove all entries
- Keeps last 20 calculations

✅ **Money Converter Tab**
- New dedicated tab for currency conversion
- Easy-to-use interface with horizontal currency selection
- Live conversion as you type
- Shows exchange rate reference

✅ **Show Recents While Calculating**
- History appears above the calculator display
- Doesn't interfere with current calculations
- Compact design to save screen space

## Installation

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Expo CLI (will be installed with dependencies)

### Setup

1. **Navigate to the project directory:**
   ```bash
   cd Calculator
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

## Running the App

### Development Server
```bash
npm start
```

This will open the Expo CLI menu with options to:

### Run on Specific Platforms

**Android Emulator:**
```bash
npm run android
```

**iOS Simulator (macOS only):**
```bash
npm run ios
```

**Web Browser:**
```bash
npm run web
```

**Physical Device:**
1. Install Expo Go app from App Store or Google Play
2. Run `npm start`
3. Scan the QR code with Expo Go app

## Project Structure

```
Calculator/
├── App.js                          # Main app with navigation
├── screens/
│   ├── SimpleCalculator.js        # Simple calculator with history
│   ├── ScientificCalculator.js    # Scientific calculator with history
│   └── MoneyConverter.js          # Currency converter (NEW!)
├── index.js                        # Entry point
├── app.json                        # Expo configuration
├── package.json                    # Project dependencies
└── README.md                       # This file
```

## How to Use

### Simple & Scientific Calculator
1. **Numbers**: Tap number buttons (0-9) to enter values
2. **Operations**: Tap operation buttons (+, -, ×, ÷)
3. **Decimal**: Tap the dot (.) button for decimal numbers
4. **Calculate**: Press the equals (=) button to see the result
5. **View History**: Recent calculations appear automatically above the display
6. **Clear History**: Tap "Clear" button in the history section
7. **Clear**: Press AC to clear everything
8. **Delete**: Press ⌫ to remove the last digit

### Money Converter
1. **Enter Amount**: Type the amount you want to convert
2. **Select From Currency**: Scroll and tap the source currency
3. **Select To Currency**: Scroll and tap the target currency
4. **Swap**: Use the "⇅ Swap" button to reverse conversion
5. **View History**: See all your recent conversions below the result

## Customization

### Change Colors
Edit the `styles` object in calculator files to customize:
- Background color: `backgroundColor: '#000'`
- Button color: `backgroundColor: '#333'`
- Operation button color: `backgroundColor: '#ff9500'`
- Equals button color: `backgroundColor: '#4CAF50'`
- Display text color: `color: '#fff'`

### Extend Features
- Add more currencies to MoneyConverter
- Implement persistent storage for history
- Add sound effects on button press
- Create custom themes
- Add unit converter (length, weight, temperature)

## Troubleshooting

**Port already in use:**
```bash
npm start -- --clear
```

**Clear cache and reinstall:**
```bash
npm install
npm start -- --clear
```

**Dependencies issues:**
```bash
rm -rf node_modules package-lock.json
npm install
```

## Technologies Used

- **React Native**: Cross-platform mobile development
- **Expo**: Development and deployment platform
- **React Navigation**: Tab navigation between calculators
- **JavaScript/JSX**: Programming language
- **React Hooks**: State management (useState)

## Screenshots

The app includes three main tabs:
1. **Simple** - Basic calculator with history
2. **Scientific** - Advanced calculator with scientific functions
3. **Converter** - Currency converter with live rates

## License

ISC

## Author

Your Name

---

**Happy Calculating! 🧮**
