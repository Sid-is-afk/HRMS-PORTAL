import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Menu } from 'react-native-paper';
import { ChevronDown, Check } from 'lucide-react-native';

export function CategorySelector({ categories, selectedId, onSelect }) {
  const [visible, setVisible] = useState(false);
  const activeCategory = categories.find(c => c.id === selectedId);

  return (
    <View style={styles.container}>
      <Menu
        visible={visible}
        onDismiss={() => setVisible(false)}
        anchor={
          <TouchableOpacity style={styles.selector} onPress={() => setVisible(true)}>
            <Text style={styles.selectorLabel} numberOfLines={1}>
              {activeCategory ? activeCategory.name : 'Select Category'}
            </Text>
            <ChevronDown size={16} color="#4B5563" />
          </TouchableOpacity>
        }
        contentStyle={styles.menuContent}
      >
        <ScrollView style={styles.scrollView} keyboardShouldPersistTaps="handled">
          {categories.map((cat) => (
            <Menu.Item
              key={cat.id}
              onPress={() => {
                onSelect(cat.id);
                setVisible(false);
              }}
              title={
                <View style={styles.itemRow}>
                  <Text style={[styles.itemText, cat.id === selectedId && styles.activeItemText]}>
                    {cat.name}
                  </Text>
                  {cat.id === selectedId && <Check size={14} color="#4F46E5" />}
                </View>
              }
              style={[styles.menuItem, cat.id === selectedId && styles.activeMenuItem]}
            />
          ))}
        </ScrollView>
      </Menu>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  selectorLabel: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '500',
    flex: 1,
    marginRight: 8,
  },
  menuContent: {
    backgroundColor: '#FFFFFF',
    maxWidth: 320,
    maxHeight: 300,
  },
  scrollView: {
    maxHeight: 280,
  },
  menuItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  activeMenuItem: {
    backgroundColor: '#EEF2FF',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    minWidth: 180,
  },
  itemText: {
    fontSize: 13,
    color: '#4B5563',
  },
  activeItemText: {
    color: '#4F46E5',
    fontWeight: '600',
  },
});
