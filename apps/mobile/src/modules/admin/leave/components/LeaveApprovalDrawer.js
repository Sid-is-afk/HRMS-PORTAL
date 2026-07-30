import React from 'react';
import { View, StyleSheet, ScrollView, Modal, TouchableOpacity } from 'react-native';
import { Text, Button, Divider, TextInput } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function LeaveApprovalDrawer({ 
  visible, 
  onClose, 
  request, 
  onApprove, 
  onReject,
  isProcessing
}) {
  const [comment, setComment] = React.useState('');

  if (!request) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} onPress={onClose} activeOpacity={1} />
        
        <View style={styles.drawer}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Leave Request Details</Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialCommunityIcons name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>
          <Divider />
          
          <ScrollView contentContainerStyle={styles.content}>
            <View style={styles.section}>
              <Text style={styles.label}>Employee</Text>
              <Text style={styles.value}>{request.employee_name || 'N/A'}</Text>
              <Text style={styles.subValue}>ID: {request.employee_id || 'N/A'} • {request.department || 'N/A'}</Text>
            </View>

            <View style={styles.row}>
              <View style={styles.sectionHalf}>
                <Text style={styles.label}>Leave Type</Text>
                <Text style={styles.value}>{request.leave_type_name || 'N/A'}</Text>
              </View>
              <View style={styles.sectionHalf}>
                <Text style={styles.label}>Status</Text>
                <View style={[styles.badge, { backgroundColor: request.status === 'PENDING' ? '#FEF3C7' : '#ECFEFF' }]}>
                  <Text style={[styles.badgeText, { color: request.status === 'PENDING' ? '#D97706' : '#0891B2' }]}>
                    {request.status}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.sectionHalf}>
                <Text style={styles.label}>From</Text>
                <Text style={styles.value}>{request.start_date || 'N/A'}</Text>
              </View>
              <View style={styles.sectionHalf}>
                <Text style={styles.label}>To</Text>
                <Text style={styles.value}>{request.end_date || 'N/A'}</Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>Total Days</Text>
              <Text style={styles.value}>{request.days || (request.start_date && request.end_date ? 'Multiple' : '1')}</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>Reason</Text>
              <Text style={styles.value}>{request.reason || 'No reason provided.'}</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>Add Comment</Text>
              <TextInput
                mode="outlined"
                placeholder="Required for rejection, optional for approval"
                value={comment}
                onChangeText={setComment}
                multiline
                numberOfLines={3}
                style={styles.input}
              />
            </View>
          </ScrollView>
          
          <Divider />
          <View style={styles.footer}>
            <Button 
              mode="outlined" 
              onPress={() => onReject(request.id, comment)} 
              style={styles.rejectBtn}
              textColor="#DC2626"
              loading={isProcessing}
              disabled={isProcessing}
            >
              Reject
            </Button>
            <Button 
              mode="contained" 
              onPress={() => onApprove(request.id, comment)} 
              style={styles.approveBtn}
              buttonColor="#16A34A"
              loading={isProcessing}
              disabled={isProcessing}
            >
              Approve
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  drawer: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#FFFFFF',
    height: '100%',
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  sectionHalf: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  value: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '500',
  },
  subValue: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#F9FAFB',
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  rejectBtn: {
    flex: 1,
    borderColor: '#DC2626',
  },
  approveBtn: {
    flex: 1,
  },
});
