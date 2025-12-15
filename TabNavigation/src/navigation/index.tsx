import { NavigationContainer } from '@react-navigation/native';
import DrawerNavigation from './DrawerNavigation';

export default function App() {
  return (
    <NavigationContainer>
      <DrawerNavigation />
    </NavigationContainer>
  );
}
