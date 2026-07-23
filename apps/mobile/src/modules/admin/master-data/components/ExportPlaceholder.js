import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { Clipboard, Download, Check } from 'lucide-react-native';
import * as ExpoClipboard from 'expo-clipboard';

export function ExportPlaceholder({ jsonContent, categoryName, onDismiss }) {
  const [copied, setCopied] = useState(false);

  const handleCopyToClipboard = async () => {
    try {
      await ExpoClipboard.setStringAsync(jsonContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      Alert.alert('Error', 'Clipboard copy failed.');
    }
  };

  const handleDownload = () => {
    Alert.alert(
      'Export Download Triggered',
      `Centralized configurations for category "${categoryName}" exported to local downloads folder (simulated).`
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Download size={24} color="#10B981" />
        <Text style={styles.title}>Export Configuration JSON</Text>
      </View>
      <Text style={styles.description}>
        Below is the serialized JSON configuration for category "{categoryName}". You can copy this payload to transfer it to other environments.
      </Text>

      <TextInput
        mode="outlined"
        multiline
        editable={false}
        value={jsonContent}
        style={styles.textInput}
        outlineColor="#D1D5DB"
      />

      <View style={styles.actions}>
        <Button mode="outlined" onPress={onDismiss} style={styles.btn} labelStyle={styles.dismissLabel}>
          Dismiss
        </Button>
        <Button
          mode="outlined"
          onPress={handleCopyToClipboard}
          style={styles.btn}
          icon={copied ? () => <Check size={14} color="#10B981" /> : () => <Clipboard size={14} color="#4B5563" />}
          labelStyle={styles.copyLabel}
        >
          {copied ? 'Copied!' : 'Copy Payload'}
        </Button>
        <Button
          mode="contained"
          onPress={handleDownload}
          style={[styles.btn, styles.downloadBtn]}
        >
          Download JSON
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
  textInput: {
    fontSize: 12,
    fontFamily: 'monospace',
    backgroundColor: '#FAFAFA',
    textAlignVertical: 'top',
    color: '#374151',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 20,
    flexWrap: 'wrap',
  },
  btn: {
    borderRadius: 6,
  },
  downloadBtn: {
    backgroundColor: '#10B981',
  },
  dismissLabel: {
    color: '#4B5563',
  },
  copyLabel: {
    color: '#4B5563',
  },
});
