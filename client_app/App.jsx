import React, { useEffect } from "react";
import Route from "./src/route/Route";
import { UserProvider } from "./src/api/userContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";



export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <UserProvider>
        <Route />
      </UserProvider>
    </GestureHandlerRootView>
  );
}
