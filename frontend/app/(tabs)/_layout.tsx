import { ContactIcon, FavourIcon, HomeIcon, MenuIcon, OrderIcon } from "@/constants/icons";
import { images } from "@/constants/images";
import { Tabs } from "expo-router";
import React from "react";
import { ImageBackground, View } from "react-native";
import { SvgProps } from "react-native-svg";

interface TabIconProps {
    focused: boolean;
    Icon: React.FC<SvgProps>;
}

const TabIcon = ({ focused, Icon }: TabIconProps) => {
    if (!focused) {
        return (
            <View className="size-full items-center justify-center mt-4 rounded-full">
                <Icon width={24} height={24} />
            </View>
        );
    }
    return (
        <>
            <ImageBackground
                source={images.highlight}
                className="flex flex-row items-center justify-center flex-1 w-full min-w-[90px] min-h-16 mt-4 rounded-full overflow-hidden"
            >
                <Icon width={28} height={28} />
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

                    tabBarIcon: ({ focused }) => <TabIcon focused={focused} Icon={HomeIcon} />,
                }}
            />
            <Tabs.Screen
                name="menu"
                options={{
                    headerShown: false,
                    title: "Menu",
                    tabBarIcon: ({ focused }) => <TabIcon focused={focused} Icon={MenuIcon} />,
                }}
            />
            <Tabs.Screen
                name="favourite"
                options={{
                    headerShown: false,
                    title: "Favourites",
                    tabBarIcon: ({ focused }) => <TabIcon focused={focused} Icon={FavourIcon} />,
                }}
            />
            <Tabs.Screen
                name="orders"
                options={{
                    headerShown: false,
                    title: "Orders",
                    tabBarIcon: ({ focused }) => <TabIcon focused={focused} Icon={OrderIcon} />,
                }}
            />
            <Tabs.Screen
                name="contact"
                options={{
                    headerShown: false,
                    title: "Contact",
                    tabBarIcon: ({ focused }) => <TabIcon focused={focused} Icon={ContactIcon} />,
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
