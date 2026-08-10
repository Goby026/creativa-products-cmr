import { Routes, Route, Navigate } from "react-router-dom";
import { ProductProvider } from "@/context/product-context";
import { PublicSite } from "@/components/public-site";
import { AdminLogin } from "@/components/admin/admin-login";
import { AdminLayout } from "@/components/admin/admin-layout";
import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { AdminProductEditor } from "@/components/admin/admin-product-editor";
import { AdminSettings } from "@/components/admin/admin-settings";

export default function App() {
  return (
    <ProductProvider>
      <Routes>
        <Route path="/" element={<PublicSite />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="producto" element={<AdminProductEditor />} />
          <Route path="ajustes" element={<AdminSettings />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ProductProvider>
  );
}
