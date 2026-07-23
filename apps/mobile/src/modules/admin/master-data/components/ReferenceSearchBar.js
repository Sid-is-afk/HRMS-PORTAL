import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Searchbar, Menu } from 'react-native-paper';
import { ArrowUpDown } from 'lucide-react-native';

export function ReferenceSearchBar({ query, onSearch, sortBy, sortOrder, onSortChange }) {
  const [menuVisible, setMenuVisible] = React.useState(false);

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Search code, name, description..."
        onChangeText={onSearch}
        value={query}
        style={styles.search}
        inputStyle={styles.searchInput}
      />
      
      <Menu
        visible={menuVisible}
        onDismiss={() => setMenuVisible(false)}
        anchor={
          <TouchableOpacity style={styles.sortBtn} onPress={() => setMenuVisible(true)}>
            <ArrowUpDown size={16} color="#4B5563" />
            <Text style={styles.sortBtnText}>
              Sort: {sortBy === 'name' ? 'Name' : 'Code'}
            </Text>
          </TouchableOpacity>
        }
      >
        <Menu.Item
          onPress={() => {
            onSortChange({ sortBy: 'name' });
            setMenuVisible(false);
          }}
          title="Sort by Display Name"
          leadingIcon={sortBy === 'name' ? 'check' : undefined}
        />
        <Menu.Item
          onPress={() => {
            onSortChange({ sortBy: 'code' });
            setMenuVisible(false);
          }}
          title="Sort by System Code"
          leadingIcon={sortBy === 'code' ? 'check' : undefined}
        />
        <Menu.Item
          onPress={() => {
            onSortChange({ sortOrder: sortOrder === 'asc' ? 'desc' : 'asc' });
            setMenuVisible(false);
          }}
          title={`Order: ${sortOrder === 'asc' ? 'Ascending' : 'Descending'}`}
          leadingIcon={sortOrder === 'asc' ? 'sort-ascending' : 'sort-descending'}
        />
      </Menu>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  search: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 6,
    height: 40,
    elevation: 0,
  },
  searchInput: {
    minHeight: 40,
    fontSize: 13,
  },
  sortBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 6,
    paddingHorizontal: 12,
    height: 40,
  },
  sortBtnText: {
    fontSize: 12,
    color: '#4B5563',
    fontWeight: '600',
  },
});
