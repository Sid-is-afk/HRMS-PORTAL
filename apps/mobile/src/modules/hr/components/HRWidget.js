import React from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import { Card, IconButton } from 'react-native-paper';

export default function HRWidget({ id, title, size = 'medium', onHide, children }) {
  const { width } = useWindowDimensions();
  const isLargeScreen = width >= 768;

  let cardWidth = '100%';
  if (isLargeScreen) {
    if (size === 'small') cardWidth = '31.5%';
    else if (size === 'medium') cardWidth = '48.5%';
    else cardWidth = '100%';
  }

  return (
    <Card style={[styles.card, { width: cardWidth }]}>
      <Card.Title
        title={title}
        titleStyle={styles.title}
        right={(props) => onHide ? (
          <IconButton {...props} icon="eye-off-outline" size={20} iconColor="#9CA3AF" onPress={() => onHide(id)} />
        ) : null}
      />
      <Card.Content style={styles.content}>{children}</Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    elevation: 0,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2937',
  },
  content: {
    paddingTop: 0,
  },
});
