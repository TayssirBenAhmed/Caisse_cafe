import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Image, 
  StyleSheet, 
  ScrollView,
  Dimensions 
} from 'react-native';
import { useCartStore } from '../store/useCartStore';
import { products } from '../data/products';

const { width } = Dimensions.get('window');

interface ProductGridProps {
  category: string;
}

const ProductGrid: React.FC<ProductGridProps> = ({ category }) => {
  const { addToCart } = useCartStore();

  const filteredProducts = products.filter(product => 
    product.category === category
  );

  const handleAddToCart = (product: any) => {
    addToCart(product);
  };

  return (
    <ScrollView 
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.grid}>
        {filteredProducts.map((product) => (
          <TouchableOpacity
            key={product.id}
            style={styles.productCard}
            onPress={() => handleAddToCart(product)}
          >
            <View style={styles.imageContainer}>
              <Image 
                source={{ uri: product.image }} 
                style={styles.productImage}
                resizeMode="cover"
              />
            </View>
            
            <View style={styles.productInfo}>
              <Text style={styles.productName} numberOfLines={2}>
                {product.name}
              </Text>
              <Text style={styles.productPrice}>
                {product.price.toFixed(3)} DT
              </Text>
              <Text style={styles.vatText}>
                TVA {product.vatRate}%
              </Text>
            </View>

            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => handleAddToCart(product)}
            >
              <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </View>

      {filteredProducts.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Aucun produit dans cette catégorie</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  contentContainer: {
    padding: 12,
    paddingBottom: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  productCard: {
    width: (width - 48) / 2,
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 12,
    // Remplacer shadow par boxShadow
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3, // Pour Android
  },
  imageContainer: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#f8f9fa',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  productInfo: {
    padding: 12,
    flex: 1,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
    lineHeight: 18,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 2,
  },
  vatText: {
    fontSize: 11,
    color: '#666',
    fontWeight: '500',
  },
  addButton: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: '#007AFF',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    // Remplacer shadow par boxShadow
    shadowColor: '#007AFF',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3, // Pour Android
  },
  addButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    lineHeight: 20,
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

export default ProductGrid;