import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { Upload, AlertCircle } from 'lucide-react-native';

export function ImportPlaceholder({ onImport, onCancel, isLoading }) {
  const [jsonText, setJsonText] = useState('');
  const [error, setError] = useState('');

  const handleValidateAndSubmit = () => {
    setError('');
    if (!jsonText.trim()) {
      setError('Please paste JSON configuration data.');
      return;
    }

    try {
      const parsed = JSON.parse(jsonText);
      if (!Array.isArray(parsed)) {
        setError('Configuration must be a JSON array of objects.');
        return;
      }
      for (const item of parsed) {
        if (!item.code || !item.name) {
          setError('Each object in the array must contain "code" and "name" properties.');
          return;
        }
      }
      onImport(jsonText);
    } catch (err) {
      setError(`Invalid JSON syntax: ${err.message}`);
    }
  };

  const loadSample = () => {
    const sample = [
      { "code": "NEW_SAMPLE_1", "name": "Sample Option A", "description": "Imported option details" },
      { "code": "NEW_SAMPLE_2", "name": "Sample Option B", "description": "Alternative option details" }
    ];
    setJsonText(JSON.stringify(sample, null, 2));
    setError('');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Upload size={24} color="#4F46E5" />
        <Text style={styles.title}>Import Configuration JSON</Text>
      </View>
      <Text style={styles.description}>
        Paste a valid configuration JSON array to load bulk reference items. Existing system defaults will not be overwritten.
      </Text>

      <Button mode="text" onPress={loadSample} style={styles.sampleBtn} labelStyle={styles.sampleLabel}>
        Load Sample JSON Format
      </Button>

      <TextInput
        mode="outlined"
        multiline
        numberOfLines={10}
        value={jsonText}
        onChangeText={setJsonText}
        placeholder='[\n  { "code": "SAMPLE_CODE", "name": "Sample Name", "description": "Description" }\n]'
        style={styles.textInput}
        outlineColor="#D1D5DB"
        activeOutlineColor="#4F46E5"
      />

      {error ? (
        <View style={styles.errorBox}>
          <AlertCircle size={14} color="#DC2626" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      <View style={styles.actions}>
        <Button mode="outlined" onPress={onCancel} style={styles.btn} disabled={isLoading} labelStyle={styles.cancelLabel}>
          Cancel
        </Button>
        <Button
          mode="contained"
          onPress={handleValidateAndSubmit}
          style={[styles.btn, styles.submitBtn]}
          loading={isLoading}
          disabled={isLoading}
        >
          Import Configuration
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
  description: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 16,
    marginBottom: 12,
  },
  sampleBtn: {
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  sampleLabel: {
    fontSize: 11,
    color: '#4F46E5',
    fontWeight: '700',
  },
  textInput: {
    fontSize: 12,
    fontFamily: 'monospace',
    backgroundColor: '#FAFAFA',
    textAlignVertical: 'top',
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    padding: 10,
    borderRadius: 6,
    marginTop: 12,
  },
  errorText: {
    fontSize: 11,
    color: '#DC2626',
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 20,
  },
  btn: {
    borderRadius: 6,
  },
  submitBtn: {
    backgroundColor: '#4F46E5',
  },
  cancelLabel: {
    color: '#4B5563',
  },
});
