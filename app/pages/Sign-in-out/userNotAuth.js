import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Welcome } from './Welcome';
import { SignUp } from './Signup';
import { SignIn } from './Signin';
const Stack = createStackNavigator();

export const UserNotAuth=()=> {
  return (
      <Stack.Navigator screenOptions={            {  headerShown: false,}
      }>
        <Stack.Screen name="Welcome" component={Welcome} />
        <Stack.Screen name="Sign In" component={SignIn} />
        <Stack.Screen name="Sign Up" component={SignUp} />
      </Stack.Navigator>
  );
}
