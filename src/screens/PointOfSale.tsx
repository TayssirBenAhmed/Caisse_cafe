import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Modal } from 'react-native';
import CategoryTabs from '../components/CategoryTabs';
import ProductGrid from '../components/ProductGrid';
import Cart from '../components/Cart';
import ServerList from '../components/ServerList';
import TableGrid from '../components/TableGrid';
import { useCartStore } from '../store/useCartStore';

const PointOfSale = () => {
  const [activeCategory, setActiveCategory] = useState('chaud');
  const [showCartModal, setShowCartModal] = useState(false);
  const { cart } = useCartStore();

  return (
    <View style={styles.container}>
      {/* Header avec serveur */}
      <View style={styles.header}>
        <ServerList />
      </View>

      {/* Navigation par catégories */}
      <View style={styles.tabsContainer}>
        <CategoryTabs 
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />
      </View>

      {/* Contenu principal */}
      <View style={styles.mainContent}>
        {/* Sélection des tables */}
        <View style={styles.tablesSection}>
          <TableGrid />
        </View>

        {/* Grille des produits */}
        <View style={styles.productsSection}>
          <ProductGrid category={activeCategory} />
        </View>
      </View>

      {/* Bouton flottant pour la commande */}
      {cart.length > 0 && (
        <TouchableOpacity 
          style={styles.floatingCartButton}
          onPress={() => setShowCartModal(true)}
        >
          <Text style={styles.cartButtonIcon}>📋</Text>
          <View style={styles.cartButtonBadge}>
            <Text style={styles.cartButtonBadgeText}>{cart.length}</Text>
          </View>
          <Text style={styles.cartButtonText}>COMMANDE</Text>
        </TouchableOpacity>
      )}

      {/* Bouton normal quand panier vide */}
      {cart.length === 0 && (
        <TouchableOpacity 
          style={styles.cartButton}
          onPress={() => setShowCartModal(true)}
        >
          <Text style={styles.cartButtonIcon}>📋</Text>
          <Text style={styles.cartButtonText}>COMMANDE DU JOUR</Text>
          <Text style={styles.cartButtonSubtext}>Voir le panier</Text>
        </TouchableOpacity>
      )}

      {/* Modal de la commande en plein écran */}
      <Modal
        visible={showCartModal}
        animationType="slide"
        statusBarTranslucent={true}
        onRequestClose={() => setShowCartModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => setShowCartModal(false)}
            >
              <Text style={styles.backButtonText}>← Retour</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>COMMANDE DU JOUR</Text>
            <View style={styles.placeholder} />
          </View>
          <Cart />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa'
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5'
  },
  tabsContainer: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5'
  },
  mainContent: {
    flex: 1,
    flexDirection: 'row'
  },
  tablesSection: {
    flex: 3,
    backgroundColor: 'white',
    borderRightWidth: 1,
    borderRightColor: '#e5e5e5'
  },
  productsSection: {
    flex: 4,
    backgroundColor: 'white',
    borderRightWidth: 1,
    borderRightColor: '#e5e5e5'
  },
  cartButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    left: 20,
    backgroundColor: '#2c3e50',
    padding: 16,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    borderLeftWidth: 4,
    borderLeftColor: '#3498db',
  },
  floatingCartButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#e74c3c',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    flexDirection: 'row',
    gap: 8,
  },
  cartButtonIcon: {
    fontSize: 20,
  },
  cartButtonBadge: {
    backgroundColor: 'white',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartButtonBadgeText: {
    color: '#e74c3c',
    fontSize: 12,
    fontWeight: 'bold',
  },
  cartButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  cartButtonSubtext: {
    fontSize: 12,
    color: '#bdc3c7',
    fontStyle: 'italic',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 12,
    backgroundColor: '#2c3e50',
    borderBottomWidth: 1,
    borderBottomColor: '#34495e',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    color: '#3498db',
    fontSize: 16,
    fontWeight: '600',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  placeholder: {
    width: 60,
  },
});

export default PointOfSale;