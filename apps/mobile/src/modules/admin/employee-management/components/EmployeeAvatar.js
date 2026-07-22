import React from 'react';
import { Avatar } from 'react-native-paper';

export default function EmployeeAvatar({ size = 48, photoUrl, firstName = '', lastName = '', style }) {
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

  if (photoUrl) {
    return <Avatar.Image size={size} source={{ uri: photoUrl }} style={style} />;
  }

  return <Avatar.Text size={size} label={initials} style={style} />;
}
