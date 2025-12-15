import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import TabNavigation from './TabNavigation';

export default function Routes() {
  return (
    <NavigationContainer>
      <TabNavigation />
    </NavigationContainer>
  );
}