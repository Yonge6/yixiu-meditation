import { KeyboardProvider, MobileRuntime } from "./mobile";
import { MobileDeviceProvider } from "./mobile/Device";
import Prototype from "./Prototype";

export default function App() {
  const showPhonePreview = new URLSearchParams(window.location.search).get("preview") === "phone";

  if (showPhonePreview) {
    return (
      <MobileRuntime>
        <Prototype />
      </MobileRuntime>
    );
  }

  return (
    <MobileDeviceProvider>
      <KeyboardProvider>
        <main className="h5-stage" aria-label="一休冥想">
          <Prototype />
        </main>
      </KeyboardProvider>
    </MobileDeviceProvider>
  );
}
