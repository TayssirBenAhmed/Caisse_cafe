import React, { useState, useMemo } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  StyleSheet, 
  Alert,
  Dimensions,
  Modal
} from 'react-native';
import { useCartStore } from '../store/useCartStore';
import { Table } from '../types';

const { width } = Dimensions.get('window');

const TableManagement = () => {
  const { tables, orders, addTable, updateTableStatus, markOrderAsPaid } = useCartStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [newTableNumber, setNewTableNumber] = useState('');
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [showTableDetails, setShowTableDetails] = useState(false);

  const filteredTables = useMemo(() => 
    tables.filter((table: Table) =>
      table.number.toString().includes(searchQuery)
    ),
    [tables, searchQuery]
  );

  const tableStats = useMemo(() => {
    const occupiedTables = tables.filter((t: Table) => t.status === 'occupée').length;
    const freeTables = tables.filter((t: Table) => t.status === 'libre').length;
    const reservedTables = tables.filter((t: Table) => t.status === 'réservée').length;
    const totalRevenue = orders
      .filter(order => order.status === 'paid')
      .reduce((sum, order) => sum + order.total, 0);

    return { occupiedTables, freeTables, reservedTables, totalRevenue };
  }, [tables, orders]);

  const handleAddTable = () => {
    const tableNum = parseInt(newTableNumber);
    if (!tableNum || tableNum < 1) {
      Alert.alert('❌ Erreur', 'Veuillez entrer un numéro de table valide');
      return;
    }

    if (tables.find((t: Table) => t.number === tableNum)) {
      Alert.alert('❌ Erreur', `La table ${tableNum} existe déjà`);
      return;
    }

    addTable(tableNum);
    setNewTableNumber('');
    Alert.alert('✅ Succès', `Table ${tableNum} ajoutée`);
  };

  const getTableOrders = (tableNumber: number) => {
    return orders.filter(order => order.tableNumber === tableNumber);
  };

  const getTableRevenue = (tableNumber: number) => {
    const tableOrders = getTableOrders(tableNumber);
    return tableOrders.reduce((sum, order) => sum + order.total, 0);
  };

  const formatCurrency = (amount: number) => `${amount.toFixed(3)} DT`;

  const handlePayOrder = (orderId: string) => {
    markOrderAsPaid(orderId);
    Alert.alert('✅ Succès', 'Commande marquée comme payée');
    setShowTableDetails(false);
  };

  const handleShowTableDetails = (table: Table) => {
    setSelectedTable(table);
    setShowTableDetails(true);
  };

  const TableCard = ({ table }: { table: Table }) => {
    const tableOrders = getTableOrders(table.number);
    const tableRevenue = getTableRevenue(table.number);
    const pendingOrders = tableOrders.filter(order => order.status === 'pending');
    const paidOrders = tableOrders.filter(order => order.status === 'paid');

    const getStatusColor = (status: string) => {
      switch (status) {
        case 'occupée': return '#e74c3c';
        case 'réservée': return '#f39c12';
        case 'libre': return '#27ae60';
        default: return '#95a5a6';
      }
    };

    const getStatusIcon = (status: string) => {
      switch (status) {
        case 'occupée': return '🔴';
        case 'réservée': return '🟡';
        case 'libre': return '🟢';
        default: return '⚪';
      }
    };

    return (
      <TouchableOpacity 
        style={[
          styles.tableCard,
          { 
            borderLeftColor: getStatusColor(table.status),
            backgroundColor: table.status === 'occupée' ? '#fff5f5' : 
                           table.status === 'réservée' ? '#fffbf0' : '#f8f9fa'
          }
        ]}
        onPress={() => handleShowTableDetails(table)}
      >
        <View style={styles.tableHeader}>
          <View style={styles.tableIdentity}>
            <View style={styles.tableTitle}>
              <Text style={styles.tableIcon}>🪑</Text>
              <Text style={styles.tableNumber}>Table {table.number}</Text>
            </View>
            <View style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(table.status) }
            ]}>
              <Text style={styles.statusText}>
                {getStatusIcon(table.status)} {table.status.toUpperCase()}
              </Text>
            </View>
          </View>
          <Text style={styles.tableRevenue}>{formatCurrency(tableRevenue)}</Text>
        </View>

        <View style={styles.tableDetails}>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{tableOrders.length}</Text>
              <Text style={styles.statLabel}>Commandes</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: '#e74c3c' }]}>{pendingOrders.length}</Text>
              <Text style={styles.statLabel}>En attente</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: '#27ae60' }]}>{paidOrders.length}</Text>
              <Text style={styles.statLabel}>Payées</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{table.clients.length}</Text>
              <Text style={styles.statLabel}>Clients</Text>
            </View>
          </View>
        </View>

        {table.server && (
          <View style={styles.serverSection}>
            <Text style={styles.serverText}>👨‍💼 Serveur: {table.server}</Text>
          </View>
        )}

        <View style={styles.actions}>
          <TouchableOpacity 
            style={styles.detailsButton}
            onPress={() => handleShowTableDetails(table)}
          >
            <Text style={styles.detailsButtonText}>📋 Détails</Text>
          </TouchableOpacity>
          {table.status === 'occupée' && (
            <TouchableOpacity style={styles.payButton}>
              <Text style={styles.payButtonText}>💳 Payer</Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* En-tête */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>🎯 GESTION DES TABLES</Text>
            <Text style={styles.subtitle}>
              {tables.length} tables • {formatCurrency(tableStats.totalRevenue)} CA total
            </Text>
          </View>
          <View style={styles.headerStats}>
            <View style={styles.statBadge}>
              <Text style={[styles.statBadgeText, { color: '#27ae60' }]}>🟢 {tableStats.freeTables}</Text>
            </View>
            <View style={styles.statBadge}>
              <Text style={[styles.statBadgeText, { color: '#e74c3c' }]}>🔴 {tableStats.occupiedTables}</Text>
            </View>
            <View style={styles.statBadge}>
              <Text style={[styles.statBadgeText, { color: '#f39c12' }]}>🟡 {tableStats.reservedTables}</Text>
            </View>
          </View>
        </View>

        {/* Ajout rapide de table */}
        <View style={styles.quickAddSection}>
          <Text style={styles.sectionTitle}>➕ AJOUTER UNE TABLE</Text>
          <View style={styles.quickAddForm}>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.numberInput}
                placeholder="Numéro de la nouvelle table..."
                value={newTableNumber}
                onChangeText={setNewTableNumber}
                keyboardType="numeric"
                placeholderTextColor="#999"
              />
              <TouchableOpacity 
                style={[
                  styles.addButton,
                  !newTableNumber.trim() && styles.addButtonDisabled
                ]}
                onPress={handleAddTable}
                disabled={!newTableNumber.trim()}
              >
                <Text style={styles.addButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Recherche */}
        <View style={styles.searchSection}>
          <TextInput
            style={styles.searchInput}
            placeholder="🔍 Rechercher une table par numéro..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            keyboardType="numeric"
            placeholderTextColor="#999"
          />
        </View>

        {/* Liste des tables */}
        <View style={styles.tablesSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              📋 LISTE DES TABLES ({filteredTables.length})
            </Text>
          </View>

          {filteredTables.length > 0 ? (
            filteredTables.map((table: Table) => (
              <TableCard key={table.id} table={table} />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>🪑</Text>
              <Text style={styles.emptyTitle}>Aucune table trouvée</Text>
              <Text style={styles.emptySubtitle}>
                {searchQuery ? 'Essayez avec un autre numéro' : 'Commencez par ajouter votre première table'}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Modal des détails de la table */}
      <Modal
        visible={showTableDetails}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowTableDetails(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedTable && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>🪑 Table {selectedTable.number}</Text>
                  <TouchableOpacity 
                    style={styles.closeButton}
                    onPress={() => setShowTableDetails(false)}
                  >
                    <Text style={styles.closeButtonText}>✕</Text>
                  </TouchableOpacity>
                </View>

                <ScrollView style={styles.modalBody}>
                  <View style={styles.tableInfo}>
                    <Text style={styles.infoItem}>
                      <Text style={styles.infoLabel}>Statut: </Text>
                      <Text style={[
                        styles.infoValue,
                        { color: selectedTable.status === 'occupée' ? '#e74c3c' : 
                                selectedTable.status === 'réservée' ? '#f39c12' : '#27ae60' }
                      ]}>
                        {selectedTable.status.toUpperCase()}
                      </Text>
                    </Text>
                    
                    {selectedTable.server && (
                      <Text style={styles.infoItem}>
                        <Text style={styles.infoLabel}>Serveur: </Text>
                        <Text style={styles.infoValue}>{selectedTable.server}</Text>
                      </Text>
                    )}

                    {selectedTable.clients.length > 0 && (
                      <View style={styles.clientsSection}>
                        <Text style={styles.clientsTitle}>👥 Clients présents:</Text>
                        {selectedTable.clients.map((client, index) => (
                          <Text key={index} style={styles.clientName}>• {client}</Text>
                        ))}
                      </View>
                    )}
                  </View>

                  <View style={styles.ordersSection}>
                    <Text style={styles.ordersTitle}>📦 COMMANDES:</Text>
                    {getTableOrders(selectedTable.number).map((order) => (
                      <View key={order.id} style={styles.orderCard}>
                        <View style={styles.orderHeader}>
                          <Text style={styles.orderId}>Commande #{order.id.slice(-6)}</Text>
                          <View style={[
                            styles.orderStatus,
                            { backgroundColor: order.status === 'paid' ? '#27ae60' : '#e74c3c' }
                          ]}>
                            <Text style={styles.orderStatusText}>
                              {order.status === 'paid' ? 'PAYÉE' : 'EN ATTENTE'}
                            </Text>
                          </View>
                        </View>
                        
                        <View style={styles.orderItems}>
                          {order.items.map((item, index) => (
                            <Text key={index} style={styles.orderItem}>
                              {item.quantity}x {item.product.name} - {formatCurrency(item.product.price * item.quantity)}
                            </Text>
                          ))}
                        </View>
                        
                        <View style={styles.orderFooter}>
                          <Text style={styles.orderTotal}>
                            Total: {formatCurrency(order.total)}
                          </Text>
                          
                          {order.status !== 'paid' && (
                            <TouchableOpacity 
                              style={styles.payOrderButton}
                              onPress={() => handlePayOrder(order.id)}
                            >
                              <Text style={styles.payOrderButtonText}>💳 Payer</Text>
                            </TouchableOpacity>
                          )}
                        </View>
                      </View>
                    ))}
                    
                    {getTableOrders(selectedTable.number).length === 0 && (
                      <Text style={styles.noOrders}>Aucune commande pour cette table</Text>
                    )}
                  </View>
                </ScrollView>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#7f8c8d',
    fontWeight: '600',
  },
  headerStats: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  statBadge: {
    backgroundColor: 'white',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  quickAddSection: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 6,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 16,
  },
  quickAddForm: {},
  inputRow: {
    flexDirection: 'row',
    gap: 12,
  },
  numberInput: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
    fontSize: 16,
    fontWeight: '500',
  },
  addButton: {
    width: 56,
    backgroundColor: '#3498db',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#3498db',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  addButtonDisabled: {
    backgroundColor: '#bdc3c7',
    shadowColor: '#bdc3c7',
  },
  addButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  searchSection: {
    marginBottom: 20,
  },
  searchInput: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e9ecef',
    fontSize: 16,
    paddingLeft: 48,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  tablesSection: {},
  sectionHeader: {
    marginBottom: 16,
  },
  tableCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 20,
    marginBottom: 12,
    borderLeftWidth: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  tableIdentity: {
    flex: 1,
  },
  tableTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tableIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  tableNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
  },
  tableRevenue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#27ae60',
  },
  tableDetails: {
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: '#7f8c8d',
    fontWeight: '500',
  },
  serverSection: {
    marginBottom: 16,
  },
  serverText: {
    fontSize: 14,
    color: '#3498db',
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  detailsButton: {
    flex: 1,
    backgroundColor: '#3498db',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  detailsButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  payButton: {
    flex: 1,
    backgroundColor: '#27ae60',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  payButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyState: {
    backgroundColor: 'white',
    padding: 60,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
    lineHeight: 20,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    width: '90%',
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  closeButton: {
    width: 32,
    height: 32,
    backgroundColor: '#e74c3c',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalBody: {
    padding: 20,
  },
  tableInfo: {
    marginBottom: 20,
  },
  infoItem: {
    fontSize: 16,
    marginBottom: 8,
    color: '#2c3e50',
  },
  infoLabel: {
    fontWeight: 'bold',
    color: '#34495e',
  },
  infoValue: {
    fontWeight: '600',
  },
  clientsSection: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
  },
  clientsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  clientName: {
    fontSize: 14,
    color: '#2c3e50',
    marginLeft: 8,
    marginBottom: 4,
  },
  ordersSection: {
    marginTop: 20,
  },
  ordersTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 16,
  },
  orderCard: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#3498db',
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderId: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  orderStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  orderStatusText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'white',
  },
  orderItems: {
    marginBottom: 12,
  },
  orderItem: {
    fontSize: 12,
    color: '#2c3e50',
    marginBottom: 4,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderTotal: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#e74c3c',
  },
  payOrderButton: {
    backgroundColor: '#27ae60',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  payOrderButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  noOrders: {
    textAlign: 'center',
    color: '#7f8c8d',
    fontStyle: 'italic',
    marginVertical: 20,
  },
});

export default TableManagement;