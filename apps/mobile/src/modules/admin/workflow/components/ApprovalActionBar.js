import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Portal, Dialog, Text } from 'react-native-paper';
import { TextInput } from '@/shared/components/TextInput';

export default function ApprovalActionBar({ onApprove, onReject, onReturn, isSubmitting }) {
  const [dialogVisible, setDialogVisible] = useState(false);
  const [actionType, setActionType] = useState(''); // 'REJECT' | 'RETURN'
  const [commentText, setCommentText] = useState('');
  const [commentError, setCommentError] = useState('');

  const showCommentDialog = (type) => {
    setActionType(type);
    setCommentText('');
    setCommentError('');
    setDialogVisible(true);
  };

  const handleConfirmAction = () => {
    if (!commentText.trim() || commentText.trim().length < 5) {
      setCommentError('A detailed comment (min 5 characters) is required.');
      return;
    }

    setDialogVisible(false);
    if (actionType === 'REJECT') {
      onReject(commentText.trim());
    } else {
      onReturn(commentText.trim());
    }
  };

  return (
    <View style={styles.container}>
      <Button
        mode="contained"
        icon="check"
        onPress={() => onApprove('')}
        loading={isSubmitting}
        disabled={isSubmitting}
        style={[styles.btn, styles.approveBtn]}
      >
        Approve
      </Button>

      <Button
        mode="contained"
        icon="close"
        onPress={() => showCommentDialog('REJECT')}
        loading={isSubmitting}
        disabled={isSubmitting}
        style={[styles.btn, styles.rejectBtn]}
      >
        Reject
      </Button>

      <Button
        mode="outlined"
        icon="arrow-left"
        onPress={() => showCommentDialog('RETURN')}
        loading={isSubmitting}
        disabled={isSubmitting}
        style={[styles.btn, styles.returnBtn]}
        labelStyle={styles.returnLabel}
      >
        Return
      </Button>

      <Portal>
        <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
          <Dialog.Title>{actionType === 'REJECT' ? 'Reject Request' : 'Return for Changes'}</Dialog.Title>
          <Dialog.Content>
            <Text style={styles.dialogText}>
              Please provide a detailed comment explaining your decision.
            </Text>
            <TextInput
              label="Comment/Reason"
              value={commentText}
              onChangeText={(text) => {
                setCommentText(text);
                if (commentError) setCommentError('');
              }}
              error={commentError}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDialogVisible(false)}>Cancel</Button>
            <Button onPress={handleConfirmAction}>Confirm</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    gap: 8,
  },
  btn: {
    flex: 1,
    borderRadius: 8,
  },
  approveBtn: {
    backgroundColor: '#10B981',
  },
  rejectBtn: {
    backgroundColor: '#EF4444',
  },
  returnBtn: {
    borderColor: '#F59E0B',
    borderWidth: 1.5,
  },
  returnLabel: {
    color: '#F59E0B',
  },
  dialogText: {
    fontSize: 13,
    color: '#4B5563',
    marginBottom: 12,
  },
});
