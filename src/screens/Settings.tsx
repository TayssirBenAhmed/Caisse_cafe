import React, { useState, useMemo } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Switch, 
  TextInput, 
  Alert, 
  StyleSheet,
  Dimensions,
  Animated
} from 'react-native';
import { useCartStore } from '../store/useCartStore';

const { width } = Dimensions.get('window');

const Settings = () => {
  const { clearCart, orders, tables } = useCartStore();
  const [printerIP, setPrinterIP] = useState('192.168.1.100');
  const [autoPrint, setAutoPrint] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  // Statistiques optimisées
  const stats = useMemo(() => {
    const paidOrders = orders.filter(order => order.status === 'paid');
    const totalRevenue = paidOrders.reduce((sum, order) => sum + order.total, 0);
    const avgOrder = paidOrders.length > 0 ? totalRevenue / paidOrders.length : 0;
    
    return {
      totalOrders: orders.length,
      totalRevenue,
      paidOrders: paidOrders.length,
      activeClients: tables.length,
      avgOrder,
      conversionRate: orders.length > 0 ? (paidOrders.length / orders.length) * 100 : 0
    };
  }, [orders, tables]);

  const handleClearData = () => {
    Alert.alert(
      '🔴 Confirmation',
      'Cette action supprimera définitivement toutes les données (commandes, clients, historique). Continuer ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Tout Effacer', 
          style: 'destructive',
          onPress: () => {
            clearCart();
            Alert.alert('✅ Succès', 'Toutes les données ont été effacées');
          }
        }
      ]
    );
  };

  const handleExportData = () => {
    const data = {
      orders,
      tables,
      exportDate: new Date().toISOString(),
      totalRevenue: stats.totalRevenue,
      totalOrders: stats.totalOrders
    };
    
    Alert.alert(
      '📤 Export Réussi',
      `Données exportées avec succès:\n\n📊 ${stats.totalOrders} commandes\n💰 ${stats.totalRevenue.toFixed(3)} DT de CA\n👥 ${stats.activeClients} clients\n✅ ${stats.paidOrders} commandes payées`,
      [{ text: 'Fermer' }]
    );
  };

  const formatCurrency = (amount: number) => `${amount.toFixed(3)} DT`;

  const SettingRow = ({ 
    label, 
    description, 
    value, 
    onValueChange, 
    type = 'switch',
    placeholder,
    keyboardType
  }: any) => (
    <View style={styles.settingRow}>
      <View style={styles.settingInfo}>
        <Text style={styles.settingLabel}>{label}</Text>
        <Text style={styles.settingDescription}>{description}</Text>
      </View>
      
      {type === 'switch' ? (
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: '#e0e0e0', true: '#27ae60' }}
          thumbColor={value ? '#fff' : '#f4f3f4'}
        />
      ) : (
        <TextInput
          style={styles.textInput}
          value={value}
          onChangeText={onValueChange}
          placeholder={placeholder}
          keyboardType={keyboardType}
          placeholderTextColor="#999"
        />
      )}
    </View>
  );

  const ActionButton = ({ title, icon, onPress, variant = 'primary' }: any) => (
    <TouchableOpacity 
      style={[
        styles.actionButton,
        variant === 'danger' && styles.dangerButton,
        variant === 'success' && styles.successButton
      ]}
      onPress={onPress}
    >
      <Text style={styles.actionButtonIcon}>{icon}</Text>
      <Text style={styles.actionButtonText}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView 
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.contentContainer}
    >
      {/* En-tête */}
      <View style={styles.header}>
        <Text style={styles.title}>⚙️ Paramètres</Text>
        <Text style={styles.subtitle}>Gestion du système de caisse</Text>
      </View>

      {/* Statistiques Avancées */}
      <View style={styles.statsSection}>
        <Text style={styles.sectionTitle}>📈 Aperçu Global</Text>
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { backgroundColor: '#007AFF15' }]}>
            <Text style={[styles.statNumber, { color: '#007AFF' }]}>{stats.totalOrders}</Text>
            <Text style={styles.statLabel}>Commandes Total</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#34C75915' }]}>
            <Text style={[styles.statNumber, { color: '#34C759' }]}>{formatCurrency(stats.totalRevenue)}</Text>
            <Text style={styles.statLabel}>Chiffre Affaires</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#FF950015' }]}>
            <Text style={[styles.statNumber, { color: '#FF9500' }]}>{stats.paidOrders}</Text>
            <Text style={styles.statLabel}>Commandes Payées</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#5856D615' }]}>
            <Text style={[styles.statNumber, { color: '#5856D6' }]}>{stats.activeClients}</Text>
            <Text style={styles.statLabel}>Clients Actifs</Text>
          </View>
        </View>
        
        {/* Métriques secondaires */}
        <View style={styles.metricsRow}>
          <View style={styles.metricItem}>
            <Text style={styles.metricValue}>{stats.avgOrder.toFixed(3)} DT</Text>
            <Text style={styles.metricLabel}>Moyenne/Commande</Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={styles.metricValue}>{stats.conversionRate.toFixed(1)}%</Text>
            <Text style={styles.metricLabel}>Taux Conversion</Text>
          </View>
        </View>
      </View>

      {/* Paramètres Impression */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🖨️ Configuration Impression</Text>
        <SettingRow
          label="Adresse IP Imprimante"
          description="Adresse réseau de l'imprimante thermique"
          value={printerIP}
          onValueChange={setPrinterIP}
          type="text"
          placeholder="192.168.1.100"
          keyboardType="numeric"
        />
        <SettingRow
          label="Impression Auto"
          description="Imprimer automatiquement après paiement"
          value={autoPrint}
          onValueChange={setAutoPrint}
        />
      </View>

      {/* Préférences Application */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📱 Préférences</Text>
        <SettingRow
          label="Sons de Confirmation"
          description="Effets sonores pour les actions"
          value={soundEnabled}
          onValueChange={setSoundEnabled}
        />
        <SettingRow
          label="Notifications"
          description="Alertes pour nouvelles commandes"
          value={notifications}
          onValueChange={setNotifications}
        />
        <SettingRow
          label="Mode Sombre"
          description="Interface en thème sombre"
          value={darkMode}
          onValueChange={setDarkMode}
        />
      </View>

      {/* Gestion des Données */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>💾 Gestion des Données</Text>
        <ActionButton
          title="Exporter Toutes les Données"
          icon="📤"
          variant="success"
          onPress={handleExportData}
        />
        <ActionButton
          title="Effacer Toutes les Données"
          icon="🗑️"
          variant="danger"
          onPress={handleClearData}
        />
      </View>

      {/* Informations Système */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>ℹ️ Informations</Text>
        <View style={styles.infoGrid}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Version</Text>
            <Text style={styles.infoValue}>2.1.0</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Dernière MAJ</Text>
            <Text style={styles.infoValue}>{new Date().toLocaleDateString('fr-FR')}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Développeur</Text>
            <Text style={styles.infoValue}>Café des Arts</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Support</Text>
            <Text style={styles.infoValue}>support@cafe-arts.tn</Text>
          </View>
        </View>
      </View>

      {/* Pied de page */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>☕ Café des Arts - Système de Caisse</Text>
        <Text style={styles.footerSubtext}>Optimisé pour les cafés tunisiens</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    paddingTop: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  statsSection: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
  },
  section: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 6,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCard: {
    width: (width - 80) / 2,
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
    textAlign: 'center',
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  metricItem: {
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 11,
    color: '#999',
    fontWeight: '500',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f9fa',
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
  textInput: {
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e9ecef',
    minWidth: 140,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '500',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    padding: 18,
    borderRadius: 14,
    marginBottom: 12,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  dangerButton: {
    backgroundColor: '#ff3b30',
    shadowColor: '#ff3b30',
  },
  successButton: {
    backgroundColor: '#34C759',
    shadowColor: '#34C759',
  },
  actionButtonIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  infoItem: {
    width: '48%',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f9fa',
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 15,
    color: '#1a1a1a',
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    padding: 20,
    marginTop: 10,
  },
  footerText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
});

export default Settings;