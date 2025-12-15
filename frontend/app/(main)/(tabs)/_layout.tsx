import { ContactIcon, FavourIcon, HomeIcon, MenuIcon, OrderIcon } from "@/assets/icons/index";
import { Tabs } from "expo-router";
import React from "react";
import { View } from "react-native";
import { SvgProps } from "react-native-svg";

interface TabIconProps {
    focused: boolean;
    Icon: React.FC<SvgProps>;
}

const TabIcon = ({ focused, Icon }: TabIconProps) => {
    return (
        <View className="flex-1 items-center justify-center relative">
            {focused && (
                <View
                    className="absolute min-w-[80px] h-[55px] rounded-full -top-2"
                    style={{
                        backgroundColor: "#E95322",
                    }}
                />
            )}
            <View className="size-full items-center justify-center mt-4 rounded-full">
                <Icon width={26} height={26} />
            </View>
        </View>
    );
};

const TabsLayout = () => {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: false,
                tabBarItemStyle: {
                    width: "100%",
                    height: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                },
                tabBarStyle: {
                    height: 52,
                    borderRadius: 50,
                    borderTopWidth: 0,
                    backgroundColor: "#8B3E26",
                    position: "absolute",
                    marginHorizontal: 16,
                    marginBottom: 32,
                    overflow: "hidden",
                },
            }}
        >
            <Tabs.Screen
                name="Home"
                options={{
                    headerShown: false,
                    title: "Home",
                    tabBarIcon: ({ focused }) => <TabIcon focused={focused} Icon={HomeIcon} />,
                }}
            />
            <Tabs.Screen
                name="Menu"
                options={{
                    headerShown: false,
                    title: "Menu",
                    tabBarIcon: ({ focused }) => <TabIcon focused={focused} Icon={MenuIcon} />,
                }}
            />
            <Tabs.Screen
                name="Favourite"
                options={{
                    headerShown: false,
                    title: "Favourites",
                    tabBarIcon: ({ focused }) => <TabIcon focused={focused} Icon={FavourIcon} />,
                }}
            />
            <Tabs.Screen
                name="Orders"
                options={{
                    headerShown: false,
                    title: "Orders",
                    tabBarIcon: ({ focused }) => <TabIcon focused={focused} Icon={OrderIcon} />,
                }}
            />
            <Tabs.Screen
                name="Contact"
                options={{
                    headerShown: false,
                    title: "Contact",
                    tabBarIcon: ({ focused }) => <TabIcon focused={focused} Icon={ContactIcon} />,
                }}
            />
            <Tabs.Screen name="Search" options={{ href: null, tabBarStyle: { display: "none" } }} />
            <Tabs.Screen name="Filter" options={{ href: null, tabBarStyle: { display: "none" } }} />
            <Tabs.Screen name="Recommend" options={{ href: null, tabBarStyle: { display: "none" } }} />
            <Tabs.Screen name="BestSeller" options={{ href: null }} />
            <Tabs.Screen name="HelpFAQs" options={{ href: null }} />
            <Tabs.Screen name="Profile" options={{ href: null, tabBarStyle: { display: "none" } }} />
        </Tabs>
    );
};

export default TabsLayout;
