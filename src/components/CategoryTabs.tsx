import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { categories } from '../data/products';

interface CategoryTabsProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const CategoryTabs: React.FC<CategoryTabsProps> = ({ activeCategory, onCategoryChange }) => {
  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      {categories.map(category => (
        <TouchableOpacity
          key={category.id}
          style={[
            styles.tab,
            activeCategory === category.id && styles.activeTab
          ]}
          onPress={() => onCategoryChange(category.id)}
        >
          <Text style={styles.tabIcon}>{category.icon}</Text>
          <Text style={[
            styles.tabText,
            activeCategory === category.id && styles.activeTabText
          ]}>
            {category.name}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5'
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 12
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: '#f8f9fa',
    minWidth: 100,
    justifyContent: 'center'
  },
  activeTab: {
    backgroundColor: '#007AFF'
  },
  tabIcon: {
    fontSize: 16,
    marginRight: 6
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666'
  },
  activeTabText: {
    color: 'white'
  }
});

export default CategoryTabs;