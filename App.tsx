import React from "react";
import { RootSiblingParent } from 'react-native-root-siblings';
import Layout from "@/layout";


const App = () => {
  return (
    <RootSiblingParent>
      <Layout />
    </RootSiblingParent>
  );
};

export default App;