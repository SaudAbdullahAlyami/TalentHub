import * as React from 'react';
import  { useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {createAppContainer} from "react-navigation";

import Home from "../pages/home"
import Profile from "../pages/profile"
import Cart from "../pages/cart"

const screens = {
    Home: {
        screen: Home
    },
    Profile: {
        screen: Profile
    },
    Cart: {
        screen: Cart
    }
}

const Tabs = createBottomTabNavigator(screens)

export default createAppContainer(Tabs)

