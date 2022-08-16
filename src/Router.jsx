import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./components/HomePage";
import AddContent from "./components/AddContent";
const Router = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route index path="/" element={<HomePage />} />
          <Route path="/text" element={<HomePage />} />
          <Route path="/addcontent" element={<AddContent />} />
          <Route path="*" element={<h1>LASTY</h1>} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default Router;
