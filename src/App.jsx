import AppRouter from "./router/AppRouter";
import Toast from "./components/Toast";
import "./App.css";

export default function App() {
  return (
    <>
      <AppRouter />
      <Toast />
    </>
  );
}
