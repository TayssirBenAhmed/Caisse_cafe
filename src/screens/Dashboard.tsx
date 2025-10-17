import React, { useMemo } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  TouchableOpacity, 
  Dimensions,
  Share,
  Alert
} from 'react-native';
import { useCartStore } from '../store/useCartStore';

const { width } = Dimensions.get('window');

const Dashboard = () => {
  const { orders, clients, tables } = useCartStore();
  
  // Calculs optimisés avec useMemo
  const { pendingOrders, paidOrders, totalRevenue, averageOrder, tableStats } = useMemo(() => {
    const pending = orders.filter(order => order.status === 'pending');
    const paid = orders.filter(order => order.status === 'paid');
    const revenue = paid.reduce((sum: number, order: any) => sum + order.total, 0);
    const avg = paid.length > 0 ? revenue / paid.length : 0;
    
    const occupiedTables = tables.filter((t: any) => t.status === 'occupée').length;
    const freeTables = tables.filter((t: any) => t.status === 'libre').length;
    
    return {
      pendingOrders: pending,
      paidOrders: paid,
      totalRevenue: revenue,
      averageOrder: avg,
      tableStats: { occupiedTables, freeTables }
    };
  }, [orders, tables]);

  // Statistiques en temps réel - Design moderne
  const stats = [
    { 
      label: 'Commandes En Attente', 
      value: pendingOrders.length, 
      color: '#FF6B35',
      icon: '⏳',
      gradient: ['#FF6B35', '#FF8E53']
    },
    { 
      label: 'Commandes Payées', 
      value: paidOrders.length, 
      color: '#00C851',
      icon: '✅',
      gradient: ['#00C851', '#00E676']
    },
    { 
      label: 'Tables Occupées', 
      value: tableStats.occupiedTables, 
      color: '#FF4444',
      icon: '🪑',
      gradient: ['#FF4444', '#FF6B6B']
    },
    { 
      label: 'Chiffre Affaires', 
      value: totalRevenue, 
      color: '#33B5E5',
      icon: '💰',
      gradient: ['#33B5E5', '#4FC3F7'],
      isCurrency: true
    },
  ];

  const secondaryStats = [
    {
      label: 'Moyenne/Commande',
      value: averageOrder,
      color: '#AA66CC',
      icon: '📊',
      isCurrency: true
    },
    {
      label: 'Taux Conversion',
      value: orders.length > 0 ? ((paidOrders.length / orders.length) * 100) : 0,
      color: '#FFBB33',
      icon: '📈',
      isPercentage: true
    },
    {
      label: 'Clients Actifs',
      value: clients.length,
      color: '#2BBBAD',
      icon: '👥'
    },
    {
      label: 'Tables Libres',
      value: tableStats.freeTables,
      color: '#4285F4',
      icon: '🆓'
    }
  ];

  const formatCurrency = (amount: number) => {
    return `${amount.toFixed(3)} DT`;
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDownloadReport = async () => {
    try {
      const reportContent = generateReportContent();
      
      await Share.share({
        message: reportContent,
        title: 'Rapport Journalier - Café Restaurant'
      });
    } catch (error) {
      Alert.alert('❌ Erreur', 'Impossible de générer le rapport');
    }
  };

  const generateReportContent = () => {
    const now = new Date();
    let content = `📊 RAPPORT JOURNALIER - CAFÉ RESTAURANT\n`;
    content += `Date: ${now.toLocaleDateString('fr-FR')}\n`;
    content += `Heure de génération: ${now.toLocaleTimeString('fr-FR')}\n\n`;
    
    content += `📈 STATISTIQUES PRINCIPALES:\n`;
    content += `Commandes en attente: ${pendingOrders.length}\n`;
    content += `Commandes payées: ${paidOrders.length}\n`;
    content += `Chiffre d'affaires: ${formatCurrency(totalRevenue)}\n`;
    content += `Tables occupées: ${tableStats.occupiedTables}/${tables.length}\n\n`;
    
    content += `💰 CHIFFRE D'AFFAIRES:\n`;
    content += `Total: ${formatCurrency(totalRevenue)}\n`;
    content += `Moyenne/commande: ${formatCurrency(averageOrder)}\n`;
    content += `Taux de conversion: ${orders.length > 0 ? ((paidOrders.length / orders.length) * 100).toFixed(1) : 0}%\n\n`;
    
    content += `🪑 ÉTAT DES TABLES:\n`;
    content += `Occupées: ${tableStats.occupiedTables}\n`;
    content += `Libres: ${tableStats.freeTables}\n`;
    content += `Total: ${tables.length}\n\n`;
    
    content += `👥 CLIENTS:\n`;
    content += `Clients actifs: ${clients.length}\n\n`;
    
    content += `📋 COMMANDES EN ATTENTE (${pendingOrders.length}):\n`;
    pendingOrders.forEach((order: any, index: number) => {
      content += `${index + 1}. Table ${order.tableNumber} - ${formatCurrency(order.total)} - ${order.items.length} article(s)\n`;
    });
    
    content += `\n💳 DERNIÈRES COMMANDES PAYÉES:\n`;
    paidOrders.slice(-5).forEach((order: any, index: number) => {
      content += `${index + 1}. Table ${order.tableNumber} - ${formatCurrency(order.total)} - ${order.paidAt ? formatTime(order.paidAt) : ''}\n`;
    });

    return content;
  };

  const StatCard = ({ stat, isLarge = false }: { stat: any, isLarge?: boolean }) => (
    <View style={[
      styles.statCard,
      isLarge ? styles.largeStatCard : styles.smallStatCard,
      { borderLeftColor: stat.color }
    ]}>
      <View style={styles.statHeader}>
        <Text style={[styles.statIcon, { color: stat.color }]}>
          {stat.icon}
        </Text>
        <View style={styles.statValues}>
          <Text style={[styles.statNumber, { color: stat.color }]}>
            {stat.isCurrency 
              ? formatCurrency(stat.value)
              : stat.isPercentage
              ? `${stat.value.toFixed(1)}%`
              : stat.value
            }
          </Text>
          <Text style={styles.statLabel}>{stat.label}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <ScrollView 
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.contentContainer}
    >
      {/* En-tête élégant */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.title}>📊 Tableau de Bord</Text>
            <Text style={styles.subtitle}>
              {new Date().toLocaleDateString('fr-FR', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </Text>
          </View>
          <TouchableOpacity style={styles.downloadButton} onPress={handleDownloadReport}>
            <Text style={styles.downloadButtonText}>📥 Rapport</Text>
          </TouchableOpacity>
        </View>
        
        {/* Indicateurs rapides */}
        <View style={styles.quickStats}>
          <View style={styles.quickStat}>
            <Text style={styles.quickStatValue}>{orders.length}</Text>
            <Text style={styles.quickStatLabel}>Total Cdes</Text>
          </View>
          <View style={styles.quickStat}>
            <Text style={styles.quickStatValue}>{formatCurrency(totalRevenue)}</Text>
            <Text style={styles.quickStatLabel}>Chiffre Affaires</Text>
          </View>
          <View style={styles.quickStat}>
            <Text style={styles.quickStatValue}>{tableStats.occupiedTables}/{tables.length}</Text>
            <Text style={styles.quickStatLabel}>Tables</Text>
          </View>
        </View>
      </View>

      {/* Statistiques Principales */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📈 Statistiques en Temps Réel</Text>
        <View style={styles.statsGrid}>
          {stats.map((stat, index) => (
            <StatCard key={stat.label} stat={stat} isLarge={true} />
          ))}
        </View>
      </View>

      {/* Statistiques Secondaires */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📊 Métriques Complémentaires</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.horizontalScroll}
        >
          <View style={styles.secondaryStatsContainer}>
            {secondaryStats.map((stat) => (
              <StatCard key={stat.label} stat={stat} />
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Commandes en Temps Réel */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>🔄 Commandes en Cours</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{pendingOrders.length}</Text>
          </View>
        </View>
        
        {pendingOrders.length > 0 ? (
          pendingOrders.slice(0, 6).map((order: any, index: number) => (
            <TouchableOpacity 
              key={order.id} 
              style={[
                styles.orderCard,
                { borderLeftColor: '#FF6B35' }
              ]}
            >
              <View style={styles.orderHeader}>
                <View style={styles.orderIdentity}>
                  <Text style={styles.orderTable}>Table {order.tableNumber}</Text>
                  <Text style={styles.orderClient}>{order.clientName || 'Client non spécifié'}</Text>
                </View>
                <View style={styles.orderAmountSection}>
                  <Text style={styles.orderTotal}>{formatCurrency(order.total)}</Text>
                  <Text style={styles.orderTime}>
                    {formatTime(order.createdAt)}
                  </Text>
                </View>
              </View>
              <View style={styles.orderDetails}>
                <Text style={styles.orderItemsCount}>
                  {order.items.length} article(s) • Serveur: {order.server || 'Non assigné'}
                </Text>
                <View style={styles.orderItemsPreview}>
                  {order.items.slice(0, 2).map((item: any, idx: number) => (
                    <Text key={idx} style={styles.itemPreview}>
                      {item.quantity}x {item.product.name}
                    </Text>
                  ))}
                  {order.items.length > 2 && (
                    <Text style={styles.moreItems}>
                      +{order.items.length - 2} autre(s)
                    </Text>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🎉</Text>
            <Text style={styles.emptyText}>Aucune commande en attente</Text>
            <Text style={styles.emptySubtext}>Toutes les commandes sont traitées</Text>
          </View>
        )}
      </View>

      {/* Derniers Paiements */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>💳 Transactions Récentes</Text>
          <View style={[styles.badge, styles.paidBadge]}>
            <Text style={styles.badgeText}>{paidOrders.length}</Text>
          </View>
        </View>
        
        {paidOrders.slice(-5).reverse().map((order: any) => (
          <View 
            key={order.id} 
            style={[
              styles.paidOrderCard,
              { borderLeftColor: '#00C851' }
            ]}
          >
            <View style={styles.orderHeader}>
              <View style={styles.orderIdentity}>
                <View style={styles.paidOrderHeader}>
                  <Text style={styles.orderTable}>Table {order.tableNumber}</Text>
                  <View style={styles.paidTag}>
                    <Text style={styles.paidTagText}>PAYÉ</Text>
                  </View>
                </View>
                <Text style={styles.orderClient}>{order.clientName || 'Client non spécifié'}</Text>
              </View>
              <View style={styles.orderAmountSection}>
                <Text style={styles.paidTotal}>{formatCurrency(order.total)}</Text>
                <Text style={styles.paidTime}>
                  {order.paidAt ? formatTime(order.paidAt) : ''}
                </Text>
              </View>
            </View>
            <View style={styles.orderDetails}>
              <Text style={styles.orderMeta}>
                {order.items.length} article(s) • {order.server} • 
                {order.paidAt && ` Payé à ${formatTime(order.paidAt)}`}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 30,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    fontWeight: '500',
  },
  downloadButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  downloadButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  quickStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  quickStat: {
    alignItems: 'center',
    flex: 1,
  },
  quickStatValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  quickStatLabel: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
    textAlign: 'center',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  largeStatCard: {
    width: (width - 60) / 2,
  },
  smallStatCard: {
    width: (width - 80) / 2,
    marginRight: 12,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  statValues: {
    flex: 1,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  horizontalScroll: {
    marginHorizontal: -10,
  },
  secondaryStatsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
  badge: {
    backgroundColor: '#e2e8f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  paidBadge: {
    backgroundColor: '#dcfce7',
  },
  badgeText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#475569',
  },
  orderCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  paidOrderCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  orderIdentity: {
    flex: 1,
    marginRight: 12,
  },
  paidOrderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  orderTable: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginRight: 8,
  },
  orderClient: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 4,
  },
  orderAmountSection: {
    alignItems: 'flex-end',
  },
  orderTotal: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF6B35',
    marginBottom: 2,
  },
  paidTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00C851',
    marginBottom: 2,
  },
  orderTime: {
    fontSize: 12,
    color: '#94a3b8',
  },
  paidTime: {
    fontSize: 12,
    color: '#00C851',
    fontWeight: '500',
  },
  orderDetails: {
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 12,
  },
  orderItemsCount: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 8,
  },
  orderItemsPreview: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  itemPreview: {
    fontSize: 12,
    color: '#475569',
    backgroundColor: '#f8fafc',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 8,
    marginBottom: 4,
  },
  moreItems: {
    fontSize: 11,
    color: '#94a3b8',
    fontStyle: 'italic',
  },
  orderMeta: {
    fontSize: 12,
    color: '#64748b',
  },
  paidTag: {
    backgroundColor: '#00C851',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  paidTagText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  emptyState: {
    backgroundColor: 'white',
    padding: 40,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
  },
});

export default Dashboard;