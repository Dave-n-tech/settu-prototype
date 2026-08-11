import { Route, Routes } from "react-router";
import SettuPrototype from "./pages/SettuPrototype";
import SettuBuyerPrototype from "./pages/SettuBuyerPrototype";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<SettuPrototype />} />
        <Route path="/buyer" element={<SettuBuyerPrototype />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
