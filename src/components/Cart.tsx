import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet, 
  Alert, 
  Modal,
  Share,
  Dimensions
} from 'react-native';
import { useCartStore } from '../store/useCartStore';

const { width, height } = Dimensions.get('window');

const Cart = () => {
  const {
    cart,
    currentTable,
    removeFromCart,
    updateQuantity,
    clearCart,
    createOrder,
    getCartTotal,
    getVatBreakdown,
    selectedCustomer,
    markOrderAsPaid,
    currentServer
  } = useCartStore();

  const [showTicket, setShowTicket] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [lastOrder, setLastOrder] = useState<any>(null);

  const handleRemoveItem = (productId: string) => {
    removeFromCart(productId);
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    updateQuantity(productId, quantity);
  };

  const handleClearCart = () => {
    Alert.alert(
      'Vider le panier',
      'Êtes-vous sûr de vouloir vider toute la commande ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Vider', 
          style: 'destructive',
          onPress: () => clearCart()
        }
      ]
    );
  };

  const handleCreateOrder = () => {
    if (!currentTable) {
      Alert.alert('❌ Erreur', 'Veuillez sélectionner une table');
      return;
    }

    if (cart.length === 0) {
      Alert.alert('❌ Erreur', 'La commande est vide');
      return;
    }

    // Calculer les valeurs AVANT de créer la commande
    const total = getCartTotal();
    const vatBreakdown = getVatBreakdown();
    const items = [...cart];

    // Créer la commande
    const order = createOrder(currentTable);

    const orderDetails = {
      ...order,
      tableNumber: currentTable,
      customer: selectedCustomer,
      items: items,
      total: total,
      vatBreakdown: vatBreakdown,
      timestamp: new Date().toLocaleString('fr-FR'),
      server: currentServer
    };

    setLastOrder(orderDetails);
    setShowTicket(true);
  };
  

  const handlePayOrder = () => {
    if (lastOrder) {
      markOrderAsPaid(lastOrder.id);
      setShowPaymentDialog(true);
      setShowTicket(false);
      clearCart();
    }
  };

  const handleDownloadTicket = async () => {
    if (!lastOrder) return;

    try {
      const ticketContent = generateTicketContent(lastOrder);
      
      await Share.share({
        message: ticketContent,
        title: `Ticket Commande Table ${lastOrder.tableNumber}`
      });
    } catch (error) {
      Alert.alert('❌ Erreur', 'Impossible de partager le ticket');
    }
  };
  

  const generateTicketContent = (order: any) => {
    let content = `📋 TICKET DE COMMANDE\n`;
    content += `CAFÉ RESTAURANT\n\n`;
    content += `Table: ${order.tableNumber}\n`;
    content += `Client: ${order.customer || 'Non spécifié'}\n`;
    content += `Serveur: ${order.server || 'Non assigné'}\n`;
    content += `Date: ${order.timestamp}\n`;
    content += `Statut: ${order.status === 'paid' ? '✅ PAYÉ' : '⏳ EN ATTENTE'}\n\n`;
    content += `ARTICLES COMMANDÉS:\n`;
    
    order.items.forEach((item: any) => {
      content += `${item.quantity}x ${item.product.name} - ${formatPrice(item.product.price * item.quantity)}\n`;
    });
    
    content += `\nSOUS-TOTAL: ${formatPrice(order.total)}\n`;
    
    order.vatBreakdown.forEach((vat: any) => {
      if (vat.amount > 0) {
        content += `TVA ${vat.rate}%: ${formatPrice(vat.amount)}\n`;
      }
    });
    
    content += `\nTOTAL: ${formatPrice(order.total)}\n\n`;
    content += `Merci pour votre visite !\n`;
    content += `À bientôt au Café Restaurant`;

    return content;
  };

  const vatBreakdown = getVatBreakdown();
  const total = getCartTotal();

  const formatPrice = (price: number) => {
    return price.toFixed(3) + ' DT';
  };

  return (
    <View style={styles.container}>
      {/* En-tête mobile */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>📋 COMMANDE DU JOUR</Text>
          {currentTable && (
            <View style={styles.tableBadge}>
              <Text style={styles.tableBadgeText}>Table {currentTable}</Text>
            </View>
          )}
        </View>
        {selectedCustomer && (
          <Text style={styles.customerText}>Client: {selectedCustomer}</Text>
        )}
        {currentServer && (
          <Text style={styles.serverText}>Serveur: {currentServer}</Text>
        )}
      </View>

      {/* Liste des articles */}
      <ScrollView 
        style={styles.cartItems} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={cart.length === 0 ? styles.emptyContainer : null}
      >
        {cart.length === 0 ? (
          <View style={styles.emptyCart}>
            <Text style={styles.emptyIcon}>🛒</Text>
            <Text style={styles.emptyText}>Aucune commande</Text>
            <Text style={styles.emptySubtext}>Ajoutez des produits pour commencer</Text>
          </View>
        ) : (
          <>
            {cart.map((item: any) => (
              <View key={item.product.id} style={styles.cartItem}>
                <View style={styles.itemImage}>
                  <Text style={styles.itemEmoji}>🍴</Text>
                </View>

                <View style={styles.itemDetails}>
                  <Text style={styles.itemName}>{item.product.name}</Text>
                  <Text style={styles.itemPrice}>{formatPrice(item.product.price)}</Text>
                  <Text style={styles.vatText}>TVA {item.product.vatRate}%</Text>
                </View>

                <View style={styles.quantitySection}>
                  <View style={styles.quantityControls}>
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() => handleUpdateQuantity(item.product.id, item.quantity - 1)}
                    >
                      <Text style={styles.quantityButtonText}>−</Text>
                    </TouchableOpacity>

                    <View style={styles.quantityDisplay}>
                      <Text style={styles.quantity}>{item.quantity}</Text>
                    </View>

                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() => handleUpdateQuantity(item.product.id, item.quantity + 1)}
                    >
                      <Text style={styles.quantityButtonText}>+</Text>
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.itemTotal}>
                    {formatPrice(item.product.price * item.quantity)}
                  </Text>

                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => handleRemoveItem(item.product.id)}
                  >
                    <Text style={styles.removeButtonText}>🗑️</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            {/* Détail TVA */}
            <View style={styles.vatSection}>
              <Text style={styles.vatTitle}>DÉTAIL DES TAXES</Text>
              {vatBreakdown.map((vat: any, index: number) =>
                vat.amount > 0 ? (
                  <View key={index} style={styles.vatRow}>
                    <Text style={styles.vatLabel}>TVA {vat.rate}%</Text>
                    <Text style={styles.vatAmount}>{formatPrice(vat.amount)}</Text>
                  </View>
                ) : null
              )}
            </View>
          </>
        )}
      </ScrollView>

      {/* Pied de page avec boutons - Fixé en bas */}
      {cart.length > 0 && (
        <View style={styles.footer}>
          <View style={styles.totalSection}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>SOUS-TOTAL</Text>
              <Text style={styles.totalAmount}>{formatPrice(total)}</Text>
            </View>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity 
              style={styles.clearButton} 
              onPress={handleClearCart}
            >
              <Text style={styles.clearButtonText}>🗑️ Vider</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.orderButton, !currentTable && styles.orderButtonDisabled]}
              onPress={handleCreateOrder}
              disabled={!currentTable}
            >
              <Text style={styles.orderButtonText}>💾 ENREGISTRER</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Modal ticket */}
      <Modal
        visible={showTicket}
        animationType="slide"
        transparent={true}
        statusBarTranslucent={true}
        onRequestClose={() => setShowTicket(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.ticketModal}>
            <View style={styles.ticketHeader}>
              <Text style={styles.ticketTitle}>📋 TICKET DE COMMANDE</Text>
              <Text style={styles.ticketSubtitle}>CAFÉ RESTAURANT</Text>
            </View>

            <ScrollView style={styles.ticketContent}>
              <View style={styles.ticketInfo}>
                <Text style={styles.ticketRow}>
                  <Text style={styles.ticketLabel}>Table: </Text>
                  {lastOrder?.tableNumber}
                </Text>
                <Text style={styles.ticketRow}>
                  <Text style={styles.ticketLabel}>Client: </Text>
                  {lastOrder?.customer || 'Non spécifié'}
                </Text>
                <Text style={styles.ticketRow}>
                  <Text style={styles.ticketLabel}>Serveur: </Text>
                  {lastOrder?.server || 'Non assigné'}
                </Text>
                <Text style={styles.ticketRow}>
                  <Text style={styles.ticketLabel}>Date: </Text>
                  {lastOrder?.timestamp}
                </Text>
                <Text style={styles.ticketRow}>
                  <Text style={styles.ticketLabel}>Statut: </Text>
                  <Text style={styles.statusPending}>⏳ EN ATTENTE</Text>
                </Text>
              </View>

              <View style={styles.ticketItems}>
                <Text style={styles.ticketSectionTitle}>ARTICLES COMMANDÉS:</Text>
                {lastOrder?.items.map((item: any, index: number) => (
                  <View key={index} style={styles.ticketItem}>
                    <Text style={styles.ticketItemName}>
                      {item.quantity}x {item.product.name}
                    </Text>
                    <Text style={styles.ticketItemPrice}>
                      {formatPrice(item.product.price * item.quantity)}
                    </Text>
                  </View>
                ))}
              </View>

              <View style={styles.ticketVatSection}>
                <Text style={styles.ticketVatTitle}>DÉTAIL DES TAXES:</Text>
                {lastOrder?.vatBreakdown.map((vat: any, index: number) => 
                  vat.amount > 0 ? (
                    <View key={index} style={styles.ticketVatRow}>
                      <Text style={styles.ticketVatLabel}>TVA {vat.rate}%</Text>
                      <Text style={styles.ticketVatAmount}>{formatPrice(vat.amount)}</Text>
                    </View>
                  ) : null
                )}
              </View>

              <View style={styles.ticketTotal}>
                <Text style={styles.ticketTotalLabel}>TOTAL:</Text>
                <Text style={styles.ticketTotalAmount}>{formatPrice(lastOrder?.total || 0)}</Text>
              </View>
            </ScrollView>

            <View style={styles.ticketActions}>
              <TouchableOpacity
                style={styles.downloadButton}
                onPress={handleDownloadTicket}
              >
                <Text style={styles.downloadButtonText}>📥 Télécharger</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.closeTicketButton}
                onPress={() => setShowTicket(false)}
              >
                <Text style={styles.closeTicketButtonText}>Fermer</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.payButton} onPress={handlePayOrder}>
                <Text style={styles.payButtonText}>💳 PAYER</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal confirmation paiement */}
      <Modal
        visible={showPaymentDialog}
        animationType="fade"
        transparent={true}
        statusBarTranslucent={true}
        onRequestClose={() => setShowPaymentDialog(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.paymentDialog}>
            <Text style={styles.paymentIcon}>✅</Text>
            <Text style={styles.paymentTitle}>Paiement Réussi</Text>
            <Text style={styles.paymentMessage}>La commande a été payée avec succès</Text>
            <Text style={styles.paymentAmount}>{formatPrice(lastOrder?.total || 0)}</Text>
            
            <TouchableOpacity
              style={styles.downloadButton}
              onPress={handleDownloadTicket}
            >
              <Text style={styles.downloadButtonText}>📥 Télécharger Reçu</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.paymentCloseButton}
              onPress={() => setShowPaymentDialog(false)}
            >
              <Text style={styles.paymentCloseButtonText}>RETOUR À LA CAISSE</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    backgroundColor: '#2c3e50',
    padding: 16,
    paddingTop: 60,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ecf0f1',
  },
  tableBadge: {
    backgroundColor: '#e74c3c',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  tableBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  customerText: {
    color: '#bdc3c7',
    fontSize: 14,
    marginBottom: 4,
  },
  serverText: {
    color: '#bdc3c7',
    fontSize: 14,
  },
  cartItems: {
    flex: 1,
  },
  emptyContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  emptyCart: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
    opacity: 0.5,
  },
  emptyText: {
    fontSize: 18,
    color: '#7f8c8d',
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#95a5a6',
    textAlign: 'center',
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  itemImage: {
    width: 44,
    height: 44,
    backgroundColor: '#3498db',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  itemEmoji: {
    fontSize: 18,
  },
  itemDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    color: '#27ae60',
    fontWeight: '600',
    marginBottom: 2,
  },
  vatText: {
    fontSize: 11,
    color: '#7f8c8d',
  },
  quantitySection: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 2,
    marginBottom: 6,
  },
  quantityButton: {
    width: 26,
    height: 26,
    backgroundColor: '#3498db',
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  quantityDisplay: {
    minWidth: 28,
    alignItems: 'center',
  },
  quantity: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  itemTotal: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#e74c3c',
    marginBottom: 6,
  },
  removeButton: {
    backgroundColor: '#e74c3c',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  removeButtonText: {
    color: 'white',
    fontSize: 11,
  },
  vatSection: {
    backgroundColor: '#ecf0f1',
    margin: 16,
    borderRadius: 10,
    padding: 12,
    marginTop: 8,
  },
  vatTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
  },
  vatRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  vatLabel: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  vatAmount: {
    fontSize: 12,
    color: '#2c3e50',
    fontWeight: '600',
  },
  footer: {
    backgroundColor: 'white',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  totalSection: {
    marginBottom: 12,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#7f8c8d',
  },
  totalAmount: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#27ae60',
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
  clearButton: {
    flex: 1,
    backgroundColor: '#95a5a6',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  clearButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  orderButton: {
    flex: 2,
    backgroundColor: '#27ae60',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    shadowColor: '#27ae60',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  orderButtonDisabled: {
    backgroundColor: '#bdc3c7',
    shadowColor: '#bdc3c7',
  },
  orderButtonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  ticketModal: {
    backgroundColor: 'white',
    borderRadius: 16,
    width: '100%',
    maxWidth: 400,
    maxHeight: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  ticketHeader: {
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  ticketTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  ticketSubtitle: {
    fontSize: 14,
    color: '#7f8c8d',
    fontWeight: '600',
  },
  ticketContent: {
    maxHeight: 400,
  },
  ticketInfo: {
    padding: 20,
    paddingBottom: 0,
  },
  ticketRow: {
    fontSize: 14,
    color: '#2c3e50',
    marginBottom: 6,
  },
  ticketLabel: {
    fontWeight: 'bold',
    color: '#34495e',
  },
  statusPending: {
    color: '#f39c12',
    fontWeight: 'bold',
  },
  ticketItems: {
    padding: 20,
    paddingBottom: 0,
  },
  ticketSectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
    paddingBottom: 8,
  },
  ticketItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  ticketItemName: {
    fontSize: 14,
    color: '#2c3e50',
    flex: 2,
  },
  ticketItemPrice: {
    fontSize: 14,
    color: '#e74c3c',
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
  ticketVatSection: {
    backgroundColor: '#f8f9fa',
    margin: 20,
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#3498db',
  },
  ticketVatTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  ticketVatRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  ticketVatLabel: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  ticketVatAmount: {
    fontSize: 12,
    color: '#2c3e50',
    fontWeight: '600',
  },
  ticketTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1',
    marginTop: 16,
  },
  ticketTotalLabel: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  ticketTotalAmount: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#27ae60',
  },
  ticketActions: {
    flexDirection: 'row',
    gap: 8,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1',
  },
  downloadButton: {
    flex: 1,
    backgroundColor: '#3498db',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  downloadButtonText: {
    color: 'white',
    fontSize: 13,
    fontWeight: 'bold',
  },
  closeTicketButton: {
    flex: 1,
    backgroundColor: '#95a5a6',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeTicketButtonText: {
    color: 'white',
    fontSize: 13,
    fontWeight: 'bold',
  },
  payButton: {
    flex: 1,
    backgroundColor: '#27ae60',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#27ae60',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  payButtonText: {
    color: 'white',
    fontSize: 13,
    fontWeight: 'bold',
  },
  paymentDialog: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    width: '100%',
    maxWidth: 300,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  paymentIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  paymentTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#27ae60',
    marginBottom: 8,
  },
  paymentMessage: {
    fontSize: 16,
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 22,
  },
  paymentAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#e74c3c',
    marginBottom: 20,
  },
  paymentCloseButton: {
    backgroundColor: '#3498db',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  paymentCloseButtonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
  },
});

export default Cart;