import { Slot, useNavigationContainerRef, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useAuthStore } from '../store/authStore';

export default function RootLayout() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  const navigationRef = useNavigationContainerRef();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsReady(true);
    }, 0);

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (!isReady) return;

    if (!user || !user.accessToken) {
      router.replace('/login');
    } else {
      router.replace('/(tabs)');
    }
  }, [isReady, user]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <Slot />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
