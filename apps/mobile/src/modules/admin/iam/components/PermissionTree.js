import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Checkbox } from 'react-native-paper';
import { ChevronDown, ChevronRight } from 'lucide-react-native';

export function PermissionTree({ groups, selectedPermissions = [], onChange }) {
  const [expanded, setExpanded] = useState({});

  const toggleExpand = (groupId) => {
    setExpanded(prev => ({
      ...prev,
      [groupId]: !prev[groupId]
    }));
  };

  const handleTogglePermission = (code) => {
    let updated = [...selectedPermissions];
    if (updated.includes(code)) {
      updated = updated.filter(p => p !== code);
    } else {
      updated.push(code);
    }
    onChange?.(updated);
  };

  const handleToggleCategory = (group) => {
    const permCodes = group.permissions.map(p => p.code);
    const allSelected = permCodes.every(code => selectedPermissions.includes(code));
    
    let updated = [...selectedPermissions];
    if (allSelected) {
      // Remove all permissions in this category
      updated = updated.filter(code => !permCodes.includes(code));
    } else {
      // Add all missing permissions in this category
      permCodes.forEach(code => {
        if (!updated.includes(code)) {
          updated.push(code);
        }
      });
    }
    onChange?.(updated);
  };

  return (
    <View style={styles.container}>
      {groups.map((group) => {
        const isExpanded = !!expanded[group.id];
        const permCodes = group.permissions.map(p => p.code);
        
        const selectedCount = permCodes.filter(code => selectedPermissions.includes(code)).length;
        const allSelected = selectedCount === permCodes.length;
        const indeterminate = selectedCount > 0 && selectedCount < permCodes.length;

        return (
          <View key={group.id} style={styles.groupContainer}>
            {/* Header with expand button and category checkbox */}
            <View style={styles.header}>
              <TouchableOpacity onPress={() => toggleExpand(group.id)} style={styles.expandBtn}>
                {isExpanded ? <ChevronDown size={18} color="#4B5563" /> : <ChevronRight size={18} color="#4B5563" />}
              </TouchableOpacity>
              
              <View style={styles.checkboxContainer}>
                <Checkbox.Android
                  status={allSelected ? 'checked' : indeterminate ? 'indeterminate' : 'unchecked'}
                  onPress={() => handleToggleCategory(group)}
                />
              </View>

              <TouchableOpacity 
                style={styles.categoryInfo} 
                onPress={() => toggleExpand(group.id)}
              >
                <Text style={styles.categoryName}>{group.name}</Text>
                <Text style={styles.categoryCount}>
                  {selectedCount} of {permCodes.length} selected
                </Text>
              </TouchableOpacity>
            </View>

            {/* Nested Permissions List */}
            {isExpanded && (
              <View style={styles.list}>
                {group.description && (
                  <Text style={styles.categoryDesc}>{group.description}</Text>
                )}
                {group.permissions.map((perm) => {
                  const isChecked = selectedPermissions.includes(perm.code);
                  return (
                    <TouchableOpacity
                      key={perm.code}
                      style={styles.item}
                      onPress={() => handleTogglePermission(perm.code)}
                    >
                      <View style={styles.itemCheckbox}>
                        <Checkbox.Android
                          status={isChecked ? 'checked' : 'unchecked'}
                          onPress={() => handleTogglePermission(perm.code)}
                        />
                      </View>
                      <View style={styles.itemInfo}>
                        <Text style={styles.itemName}>{perm.name}</Text>
                        <Text style={styles.itemCode}>{perm.code}</Text>
                        <Text style={styles.itemDesc}>{perm.description}</Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  groupContainer: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#F9FAFB',
  },
  expandBtn: {
    padding: 6,
  },
  checkboxContainer: {
    marginHorizontal: 4,
  },
  categoryInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 4,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#374151',
  },
  categoryCount: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  list: {
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  categoryDesc: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 12,
    fontStyle: 'italic',
    paddingLeft: 12,
  },
  item: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  itemCheckbox: {
    paddingTop: 2,
  },
  itemInfo: {
    flex: 1,
    paddingLeft: 8,
  },
  itemName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
  },
  itemCode: {
    fontSize: 10,
    fontFamily: 'monospace',
    color: '#2563EB',
    marginVertical: 2,
  },
  itemDesc: {
    fontSize: 11,
    color: '#6B7280',
    lineHeight: 14,
  },
});
