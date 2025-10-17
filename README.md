# ☕ CaisseCafé - Point of Sale System

[![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/)
[![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactnative.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Zustand](https://img.shields.io/badge/Zustand-000000?style=for-the-badge&logo=react&logoColor=white)](https://zustand-demo.pmnd.rs/)

A modern, intuitive Point of Sale (POS) system designed specifically for Tunisian cafés and restaurants. Built with React Native and Expo for cross-platform compatibility.

## 📱 Demo

![CaisseCafé Demo](assets/demoFinal.gif)

## ✨ Features

### 🛒 Point of Sale (Caisse)
- **Product Management**: Browse products by categories (Hot Drinks, Cold Drinks, Pastries)
- **Smart Cart**: Add/remove items, quantity management, real-time total calculation
- **Table Assignment**: Assign orders to specific tables
- **Server Management**: Track which server handles each order
- **VAT Calculation**: Automatic VAT breakdown (7% and 18% rates)
- **Order Creation**: Seamless order processing with client information

### 📊 Dashboard
- **Real-time Statistics**: Live tracking of orders, revenue, and table status
- **Revenue Analytics**: Daily sales, average order value, conversion rates
- **Order Monitoring**: Pending and completed orders overview
- **Table Status**: Visual representation of occupied/free tables
- **Export Reports**: Generate and share daily reports via native sharing

### 🪑 Table Management
- **Dynamic Table Creation**: Add new tables on-the-fly
- **Status Tracking**: Monitor table availability (Free, Occupied, Reserved)
- **Order History**: View complete order history per table
- **Client Management**: Track clients per table
- **Revenue per Table**: Individual table performance metrics

### ⚙️ Settings
- **Printer Configuration**: Network printer setup for thermal receipts
- **App Preferences**: Sound notifications, dark mode, auto-print
- **Data Management**: Export/import data, clear all records
- **System Information**: Version tracking and support details

## 🛠️ Technologies Used

- **Frontend**: React Native, Expo
- **Language**: TypeScript
- **State Management**: Zustand with persistence
- **Navigation**: React Navigation (Bottom Tabs & Stack)
- **Styling**: React Native StyleSheet
- **Icons**: Expo Vector Icons
- **Async Storage**: Data persistence
- **Build Tools**: Webpack, Babel

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/TayssirBenAhmed/caissecafe.git
   cd caissecafe
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Run on device/emulator**
   - For Android: `npm run android`
   - For iOS: `npm run ios`
   - For Web: `npm run web`

## 📖 Usage

### Getting Started
1. Launch the app on your device
2. Navigate through the bottom tabs: Caisse, Tableau, Tables, Paramètres

### Processing an Order
1. **Select Table**: Choose a table from the grid
2. **Assign Server**: Select a server from the dropdown
3. **Browse Products**: Use category tabs to find items
4. **Add to Cart**: Tap products to add them to the order
5. **Review Order**: Check the cart modal for totals and VAT
6. **Complete Order**: Process payment and mark as complete

### Managing Tables
1. Go to "Tables" tab
2. Add new tables using the quick add feature
3. Monitor table status and revenue
4. View detailed order history per table

### Generating Reports
1. Access the "Tableau" (Dashboard) tab
2. View real-time statistics
3. Export daily reports using the "Rapport" button

## 📁 Project Structure

```
caissecafe/
├── assets/                 # Static assets (images, icons, demo.gif)
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── Cart.tsx       # Shopping cart component
│   │   ├── ProductGrid.tsx # Product display grid
│   │   ├── CategoryTabs.tsx # Category navigation
│   │   ├── ServerList.tsx  # Server selection
│   │   ├── TableGrid.tsx   # Table selection grid
│   │   └── Ticket.tsx      # Receipt component
│   ├── screens/           # Main app screens
│   │   ├── PointOfSale.tsx # Main POS interface
│   │   ├── Dashboard.tsx   # Analytics dashboard
│   │   ├── TableManagement.tsx # Table management
│   │   └── Settings.tsx    # App settings
│   ├── store/             # State management
│   │   └── useCartStore.ts # Zustand store
│   ├── types/             # TypeScript type definitions
│   │   └── index.ts       # Type definitions
│   └── data/              # Static data
│       └── products.ts    # Product catalog
├── App.tsx                # Main app component
├── package.json           # Dependencies and scripts
└── README.md             # This file
```

## 🔧 Configuration

### Printer Setup
- Navigate to Settings → Printer Configuration
- Enter your thermal printer's IP address
- Enable auto-print for automatic receipt printing

### Data Persistence
- All data is automatically saved using AsyncStorage
- Data persists between app sessions
- Use Settings → Data Management to export or clear data

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Developer

**Café des Arts Team**
- Email: support@cafe-arts.tn
- Website: [cafe-arts.tn](https://cafe-arts.tn)

## 🙏 Acknowledgments

- Built for the Tunisian café industry
- Optimized for small to medium-sized restaurants
- Designed with user experience in mind
- Supports both Arabic and French languages

---

**Made with ❤️ for Tunisian cafés and restaurants**
