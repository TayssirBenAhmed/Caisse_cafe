import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useCartStore } from '../store/useCartStore';
import { Table } from '../types';

const TableGrid = () => {
  const { tables, currentTable, setCurrentTable } = useCartStore();

  const getStatusColor = (status: Table['status']) => {
    switch (status) {
      case 'occupée': return '#FF9500';
      case 'réservée': return '#007AFF';
      case 'libre': return '#34C759';
      default: return '#8E8E93';
    }
  };

  const getStatusIcon = (status: Table['status']) => {
    switch (status) {
      case 'occupée': return '🟡';
      case 'réservée': return '🔵';
      case 'libre': return '🟢';
      default: return '⚪';
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>🪑 Sélection de Table</Text>
      
      <View style={styles.grid}>
        {tables.map((table: Table) => (
          <TouchableOpacity
            key={table.id}
            style={[
              styles.tableCard,
              { 
                backgroundColor: getStatusColor(table.status) + '20',
                borderColor: currentTable === table.number ? '#007AFF' : 'transparent',
                borderWidth: currentTable === table.number ? 3 : 0,
              }
            ]}
            onPress={() => setCurrentTable(table.number)}
          >
            <View style={styles.tableHeader}>
              <Text style={styles.tableNumber}>Table {table.number}</Text>
              <Text style={styles.statusIcon}>
                {getStatusIcon(table.status)}
              </Text>
            </View>
            
            <Text style={[styles.statusText, { color: getStatusColor(table.status) }]}>
              {table.status.toUpperCase()}
            </Text>
            
            {table.clients.length > 0 && (
              <Text style={styles.clientsText}>
                👥 {table.clients.length} client(s)
              </Text>
            )}
            
            {table.server && (
              <Text style={styles.serverText}>
                🤵 {table.server}
              </Text>
            )}
          </TouchableOpacity>
        ))}
      </View>
      
      {tables.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Aucune table disponible</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#1a1a1a',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  tableCard: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  tableNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  statusIcon: {
    fontSize: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  clientsText: {
    fontSize: 11,
    color: '#666',
    marginBottom: 2,
  },
  serverText: {
    fontSize: 11,
    color: '#666',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default TableGrid;