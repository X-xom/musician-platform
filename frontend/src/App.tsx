import { Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "./components/AppLayout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { ClientAdvertisementsPage } from "./pages/ClientAdvertisementsPage";
import { ClientProfilePage } from "./pages/ClientProfilePage";
import { CreateAnnouncementPage } from "./pages/CreateAnnouncementPage";
import { ClientAdvertisementResponsesPage } from "./pages/ClientAdvertisementResponsesPage";
import { ClientResponsesPage } from "./pages/ClientResponsesPage";
import { EditAnnouncementPage } from "./pages/EditAnnouncementPage";
import { LoginPage } from "./pages/LoginPage";
import { MusicianAdvertisementDetailsPage } from "./pages/MusicianAdvertisementDetailsPage";
import { MusicianAdvertisementsPage } from "./pages/MusicianAdvertisementsPage";
import { MusicianProfilePage } from "./pages/MusicianProfilePage";
import { MusicianResponsesPage } from "./pages/MusicianResponsesPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute role="CLIENT" />}>
        <Route element={<AppLayout variant="client" />}>
          <Route
            path="/client/advertisements"
            element={<ClientAdvertisementsPage />}
          />
          <Route
            path="/client/advertisements/create"
            element={<CreateAnnouncementPage />}
          />
          <Route
            path="/client/advertisements/:id/edit"
            element={<EditAnnouncementPage />}
          />
          <Route path="/client/profile" element={<ClientProfilePage />} />
          <Route path="/client/responses" element={<ClientResponsesPage />} />
          <Route
            path="/client/advertisements/:id/responses"
            element={<ClientAdvertisementResponsesPage />}
          />
        </Route>
      </Route>

      <Route element={<ProtectedRoute role="MUSICIAN" />}>
        <Route element={<AppLayout variant="musician" />}>
          <Route
            path="/musician/advertisements"
            element={<MusicianAdvertisementsPage />}
          />
          <Route path="/musician/profile" element={<MusicianProfilePage />} />
          <Route
            path="/musician/advertisements/:id"
            element={<MusicianAdvertisementDetailsPage />}
          />
          <Route
            path="/musician/responses"
            element={<MusicianResponsesPage />}
          />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
