import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { Tabs } from "expo-router";
import React from "react";
import { Image, ImageBackground, View } from "react-native";

interface TabIconProps {
    focused: boolean;
    icon: any;
}

const TabIcon = ({ focused, icon }: TabIconProps) => {
    if (!focused) {
        return (
            <View className="size-full items-center justify-center mt-4 rounded-full">
                <Image source={icon} tintColor="#fff" className="size-7" resizeMode="contain" />
            </View>
        );
    }
    return (
        <>
            <ImageBackground
                source={images.highlight}
                className="flex flex-row items-center justify-center flex-1 w-full min-w-[90px] min-h-16 mt-4 rounded-full overflow-hidden"
            >
                <Image source={icon} tintColor="#fff" className="size-7" resizeMode="contain" />
            </ImageBackground>
        </>
    );
};

const TabsLayout = () => {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: false,
                tabBarItemStyle: {
                    justifyContent: "center",
                    alignItems: "center",
                },
                tabBarStyle: {
                    height: 52,
                    borderRadius: 50,
                    borderTopWidth: 0,
                    backgroundColor: "#914025",
                    position: "absolute",
                    marginHorizontal: 20,
                    marginBottom: 36,
                    paddingHorizontal: 12,
                    overflow: "hidden",
                },
            }}
        >
            <Tabs.Screen
                name="home"
                options={{
                    headerShown: false,
                    title: "Home",

                    tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon={icons.home} />,
                }}
            />
            <Tabs.Screen
                name="menu"
                options={{
                    headerShown: false,
                    title: "Menu",
                    tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon={icons.menu} />,
                }}
            />
            <Tabs.Screen
                name="favourite"
                options={{
                    headerShown: false,
                    title: "Favourites",
                    tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon={icons.favourite} />,
                }}
            />
            <Tabs.Screen
                name="orders"
                options={{
                    headerShown: false,
                    title: "Orders",
                    tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon={icons.orders} />,
                }}
            />
            <Tabs.Screen
                name="contact"
                options={{
                    headerShown: false,
                    title: "Contact",
                    tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon={icons.contact} />,
                }}
            />
            <Tabs.Screen name="search" options={{ href: null, tabBarStyle: { display: "none" } }} />
            <Tabs.Screen name="filter" options={{ href: null, tabBarStyle: { display: "none" } }} />
            <Tabs.Screen name="recommend" options={{ href: null }} />
            <Tabs.Screen name="bestSeller" options={{ href: null }} />
        </Tabs>
    );
};

export default TabsLayout;
