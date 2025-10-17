import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { servers } from '../data/products';
import { useCartStore } from '../store/useCartStore';

const ServerList: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const currentServer = useCartStore(state => state.currentServer);
  const setCurrentServer = useCartStore(state => state.setCurrentServer);

  const handleServerSelect = (server: string) => {
    setCurrentServer(server);
    setModalVisible(false);
  };

  return (
    <View>
      <TouchableOpacity 
        style={styles.serverButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.serverText}>👤 {currentServer}</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Sélectionner le serveur</Text>
            
            {servers.map(server => (
              <TouchableOpacity
                key={server}
                style={[
                  styles.serverOption,
                  currentServer === server && styles.selectedServer
                ]}
                onPress={() => handleServerSelect(server)}
              >
                <Text style={[
                  styles.serverOptionText,
                  currentServer === server && styles.selectedServerText
                ]}>
                  {server}
                </Text>
              </TouchableOpacity>
            ))}
            
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  serverButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f8f9fa',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd'
  },
  serverText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF'
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '80%',
    maxWidth: 300
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center'
  },
  serverOption: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 8
  },
  selectedServer: {
    backgroundColor: '#007AFF'
  },
  serverOptionText: {
    fontSize: 16,
    textAlign: 'center'
  },
  selectedServerText: {
    color: 'white',
    fontWeight: '600'
  },
  cancelButton: {
    marginTop: 16,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f8f9fa'
  },
  cancelButtonText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16
  }
});

export default ServerList;