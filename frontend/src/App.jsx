/** @format */

/** @format */

import { Toaster } from "react-hot-toast";
import Layout from "./components/Layout/Layout";
import { useEffect } from "react";
import { useUserStore } from "./stores/useUserStore";

function App() {
  const { user, checkAuth, checkingAuth } = useUserStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!user) return;
  });
  if (checkingAuth) return <div>Loading...</div>;
  return (
    <>
      <Layout />
      <Toaster />
    </>
  );
}

export default App;
