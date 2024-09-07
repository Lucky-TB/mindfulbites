import { View, Text, Image } from 'react-native'
import { Tabs, Redirect} from 'expo-router';
import { ModalProvider } from '../../components/ModalContext';

import { icons } from '../../constants';

const TabIcon = ({ icon, color, name, focused }) => {

  return (
    <View className="items-center justify-center gap-2 mt-4">
      <Image 
        source={icon}
        resizeMode="contain"
        tintColor={color}
        className="w-6 h-6"
        style={{ transform: [{ scale: focused ? 1.2 : 1 }] }}
      />
      <Text className={`${focused ? 'font-psemibold pt-1' : 'font-pregular'} text-xs`} style={{ color: color, fontSize: focused ? 15 : 12 }}>
        {name}
      </Text>
    </View>
  )
}

const TabsLayout = () => {
  return (
    <ModalProvider>
        <Tabs
          screenOptions={{
                tabBarShowLabel: false,
                tabBarActiveTintColor: '#88BDBC',
                tabBarInactiveTintColor: '#F6F8F5',
                tabBarStyle: {
                  backgroundColor: '#112122',
                  borderTopWidth: 1,
                  borderTopColor: '#2D3C2B',
                  height: 84,
                }
          }}
        >
            <Tabs.Screen
                name="home"
                options={{ title: 'Home',
                    headerShown: false,
                    tabBarIcon: ({ color, focused }) => (
                      <TabIcon
                        icon={icons.home}
                        color={color}
                        name="Home"
                        focused={focused}
                      />
                    )
                }}                
            />
            <Tabs.Screen
                name="Munchie"
                options={{ title: 'Munchie',
                    headerShown: false,
                    tabBarIcon: ({ color, focused }) => (
                      <TabIcon
                        icon={icons.bookmark}
                        color={color}
                        name="Munchie"
                        focused={focused}
                      />
                    )
                }}
            />
            <Tabs.Screen
                name="relaxation"
                options={{ title: 'Relaxation',
                    headerShown: false,
                    tabBarIcon: ({ color, focused }) => (
                      <TabIcon
                        icon={icons.plus}
                        color={color}
                        name="Relaxation"
                        focused={focused}
                      />
                    )
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{ title: 'Profile',
                    headerShown: false,
                    tabBarIcon: ({ color, focused }) => (
                      <TabIcon
                        icon={icons.profile}
                        color={color}
                        name="Profile"
                        focused={focused}
                      />
                    )
                }}
            />
            <Tabs.Screen
                name="test"
                options={{ title: 'test',
                    headerShown: false,
                    tabBarIcon: ({ color, focused }) => (
                      <TabIcon
                        icon={icons.profile}
                        color={color}
                        name="test"
                        focused={focused}
                      />
                    )
                }}
            />
        </Tabs>
    </ModalProvider>
  )
}

export default TabsLayout