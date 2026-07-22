import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card, Avatar, Button } from 'react-native-paper';
import { TextInput } from '@/shared/components/TextInput';

export default function ApprovalComment({ comments = [], onAddComment, isSubmitting }) {
  const [text, setText] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!text.trim() || text.trim().length < 2) {
      setError('Comment must be at least 2 characters.');
      return;
    }
    setError('');
    onAddComment(text.trim());
    setText('');
  };

  const formatDate = (isoStr) => {
    try {
      return new Date(isoStr).toLocaleString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return '';
    }
  };

  return (
    <Card style={styles.card}>
      <Card.Title title="Comments & Discussion" titleStyle={styles.title} />
      <Card.Content>
        {comments.map((item) => (
          <View key={item.id} style={styles.commentRow}>
            <Avatar.Text size={28} label={item.authorName.charAt(0).toUpperCase()} style={styles.avatar} />
            <View style={styles.commentBody}>
              <View style={styles.commentHeader}>
                <Text style={styles.author}>{item.authorName}</Text>
                <Text style={styles.date}>{formatDate(item.timestamp)}</Text>
              </View>
              <Text style={styles.text}>{item.comment}</Text>
            </View>
          </View>
        ))}

        <View style={styles.inputContainer}>
          <TextInput
            label="Write a comment..."
            value={text}
            onChangeText={(val) => {
              setText(val);
              if (error) setError('');
            }}
            error={error}
          />
          <Button mode="contained" onPress={handleSubmit} loading={isSubmitting} style={styles.button}>
            Post Comment
          </Button>
        </View>
      </Card.Content>
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
    marginBottom: 16,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2937',
  },
  commentRow: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  avatar: {
    backgroundColor: '#10B981',
    marginRight: 10,
  },
  commentBody: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 8,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  author: {
    fontSize: 11,
    fontWeight: '700',
    color: '#374151',
  },
  date: {
    fontSize: 9,
    color: '#9CA3AF',
  },
  text: {
    fontSize: 12,
    color: '#4B5563',
  },
  inputContainer: {
    marginTop: 12,
  },
  button: {
    backgroundColor: '#3B82F6',
    marginTop: 8,
  },
});
