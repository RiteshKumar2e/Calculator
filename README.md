# Calculator App - React Native

A beautiful, fully-functional calculator app built with React Native and Expo.

## Features

✨ **Full Calculator Functionality:**
- Basic arithmetic operations (addition, subtraction, multiplication, division)
- Percentage calculations
- Decimal number support
- Delete/Backspace functionality
- Clear all (C) button
- Elegant dark theme UI
- Responsive design

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
├── App.js                 # Main calculator component
├── index.js              # Entry point
├── app.json              # Expo configuration
├── package.json          # Project dependencies
└── README.md             # This file
```

## How to Use

1. **Numbers**: Tap number buttons (0-9) to enter values
2. **Operations**: Tap operation buttons (+, -, ×, ÷)
3. **Decimal**: Tap the dot (.) button for decimal numbers
4. **Percentage**: Calculate percentages using the % button
5. **Calculate**: Press the equals (=) button to see the result
6. **Clear**: Press C to clear everything
7. **Delete**: Press DEL to remove the last digit

## Customization

### Change Colors
Edit the `styles` object in [App.js](App.js) to customize:
- Background color: `backgroundColor: '#1a1a1a'`
- Button color: `backgroundColor: '#333'`
- Operation button color: `backgroundColor: '#ff9500'`
- Equals button color: `backgroundColor: '#4CAF50'`
- Display text color: `color: '#fff'`

### Add More Features
- Sound effects on button press
- Calculation history
- Scientific calculator mode
- Custom themes

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
- **JavaScript/JSX**: Programming language
- **React Hooks**: State management (useState)

## License

ISC

## Author

Your Name

---

**Happy Calculating! 🧮**
