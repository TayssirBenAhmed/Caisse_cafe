import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';

interface TicketProps {
  order: any;
  onClose: () => void;
}

const Ticket: React.FC<TicketProps> = ({ order, onClose }) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.ticketContent}>
        {/* En-tête du ticket */}
        <View style={styles.header}>
          <Text style={styles.restaurantName}>BRASSERIE DES ARTS</Text>
          <Text style={styles.restaurantAddress}>12 Rue du Puit, 1000 Bruxelles</Text>
          <Text style={styles.restaurantPhone}>Tel: 0478/24.30.80</Text>
        </View>

        <View style={styles.separator} />

        {/* Informations de la commande */}
        <View style={styles.orderInfo}>
          <Text style={styles.orderNumber}>COMMANDE #{order.id?.slice(-6) || '000000'}</Text>
          <Text style={styles.orderDetail}>Client: {order.clientName}</Text>
          {order.tableNumber && (
            <Text style={styles.orderDetail}>Table: {order.tableNumber}</Text>
          )}
          <Text style={styles.orderDetail}>
            Serveur: {order.server || 'Non assigné'}
          </Text>
          <Text style={styles.orderDetail}>
            Heure: {formatTime(new Date())}
          </Text>
        </View>

        <View style={styles.separator} />

        {/* Articles */}
        <View style={styles.itemsSection}>
          <Text style={styles.sectionTitle}>ARTICLES</Text>
          {order.items?.map((item: any, index: number) => (
            <View key={index} style={styles.itemRow}>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.product.name}</Text>
                <Text style={styles.itemVat}>TVA {item.product.vatRate}%</Text>
              </View>
              <View style={styles.itemQuantityPrice}>
                <Text style={styles.itemQuantity}>x{item.quantity}</Text>
                <Text style={styles.itemPrice}>{(item.product.price * item.quantity).toFixed(2)}€</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.separator} />

        {/* Total et TVA */}
        <View style={styles.totalsSection}>
          <View style={styles.subtotalRow}>
            <Text>Sous-total</Text>
            <Text>{order.total?.toFixed(2)}€</Text>
          </View>
          
          {order.vatBreakdown?.map((vat: any, index: number) => (
            vat.amount > 0 && (
              <View key={index} style={styles.vatRow}>
                <Text>TVA {vat.rate}%</Text>
                <Text>{vat.amount.toFixed(2)}€</Text>
              </View>
            )
          ))}
          
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>TOTAL</Text>
            <Text style={styles.totalAmount}>{order.total?.toFixed(2)}€</Text>
          </View>
        </View>

        <View style={styles.separator} />

        {/* Pied de page */}
        <View style={styles.footer}>
          <Text style={styles.thankYou}>Merci de votre visite !</Text>
          <Text style={styles.footerText}>À bientôt à la Brasserie des Arts</Text>
        </View>
      </ScrollView>

      {/* Bouton de fermeture */}
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Text style={styles.closeButtonText}>RETOUR À LA CAISSE</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  ticketContent: {
    flex: 1,
    padding: 20
  },
  header: {
    alignItems: 'center',
    marginBottom: 16
  },
  restaurantName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4
  },
  restaurantAddress: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2
  },
  restaurantPhone: {
    fontSize: 12,
    color: '#666'
  },
  separator: {
    height: 1,
    backgroundColor: '#000',
    marginVertical: 12
  },
  orderInfo: {
    marginBottom: 16
  },
  orderNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center'
  },
  orderDetail: {
    fontSize: 12,
    marginBottom: 2,
    textAlign: 'center'
  },
  itemsSection: {
    marginBottom: 16
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center'
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8
  },
  itemInfo: {
    flex: 1
  },
  itemName: {
    fontSize: 12,
    fontWeight: '600'
  },
  itemVat: {
    fontSize: 10,
    color: '#666',
    marginTop: 2
  },
  itemQuantityPrice: {
    alignItems: 'flex-end'
  },
  itemQuantity: {
    fontSize: 12,
    color: '#666'
  },
  itemPrice: {
    fontSize: 12,
    fontWeight: '600'
  },
  totalsSection: {
    marginBottom: 16
  },
  subtotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4
  },
  vatRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#ccc'
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  footer: {
    alignItems: 'center',
    marginTop: 16
  },
  thankYou: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4
  },
  footerText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center'
  },
  closeButton: {
    backgroundColor: '#007AFF',
    margin: 20,
    padding: 16,
    borderRadius: 8
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center'
  }
});

export default Ticket;