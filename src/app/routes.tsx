import { createBrowserRouter } from "react-router";
import { RootLayout } from "./components/layout/RootLayout";
import  LandingPage  from "./pages/LandingPage";
import { LoginPage } from "./pages/auth/LoginPage";
import { AgentLayout } from "./components/layout/AgentLayout";
import { DashboardPage } from "./pages/agent/DashboardPage";
import { AssuresListPage } from "./pages/agent/AssuresListPage";
import { AssureFormPage } from "./pages/agent/AssureFormPage";
import { AssignMedecinTraitantPage } from "./pages/agent/AssignMedecinTraitantPage";
import { AgentAssureDossierPage } from "./pages/agent/AgentAssureDossierPage";
import { MedecinsListPage } from "./pages/agent/MedecinsListPage";
import { MedecinFormPage } from "./pages/agent/MedecinFormPage";
import { AgentMedecinDossierPage } from "./pages/agent/AgentMedecinDossierPage";
import { TarifsListPage } from "./pages/agent/TarifsListPage";
import { FeuillesMaladiesListPage } from "./pages/agent/FeuillesMaladiesListPage";
import { EffectuerRemboursementPage } from "./pages/agent/EffectuerRemboursementPage";
import { ImprimerFeuilleMaladiePage } from "./pages/agent/ImprimerFeuilleMaladiePage";
import { AgentProfilePage } from "./pages/agent/AgentProfilePage";

// Médecin
import { MedecinLayout } from "./components/layout/MedecinLayout";
import { MedecinDashboardPage } from "./pages/medecin/DashboardPage";
import { ConsultationsListPage } from "./pages/medecin/ConsultationsListPage";
import { ConsultationFormPage } from "./pages/medecin/ConsultationFormPage";
import { PatientsListPage } from "./pages/medecin/PatientsListPage";
import { PatientDossierPage } from "./pages/medecin/PatientDossierPage";
import { MedecinProfilePage } from "./pages/medecin/MedecinProfilePage";

import { ProtectedRoute } from "./components/auth/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: "login", element: <LoginPage /> },
    ],
  },
  {
    path: "/agent",
    element: <ProtectedRoute allowedRoles={["AGENT"]} />,
    children: [
      {
        path: "",
        element: <AgentLayout />,
        children: [
          { path: "dashboard", element: <DashboardPage /> },
          { path: "assures", element: <AssuresListPage /> },
          { path: "assures/nouveau", element: <AssureFormPage /> },
          { path: "assures/medecin-traitant", element: <AssignMedecinTraitantPage /> },
          { path: "assures/:id", element: <AgentAssureDossierPage /> },
          { path: "medecins", element: <MedecinsListPage /> },
          { path: "medecins/nouveau", element: <MedecinFormPage /> },
          { path: "medecins/:id", element: <AgentMedecinDossierPage /> },
          { path: "feuilles-maladies", element: <FeuillesMaladiesListPage /> },
          { path: "feuilles-maladies/imprimer", element: <ImprimerFeuilleMaladiePage /> },
          { path: "remboursements/nouveau", element: <EffectuerRemboursementPage /> },
          { path: "tarifs", element: <TarifsListPage /> },
          { path: "profil", element: <AgentProfilePage /> },
        ],
      },
    ],
  },
  {
    path: "/medecin",
    element: <ProtectedRoute allowedRoles={["MEDECIN"]} />,
    children: [
      {
        path: "",
        element: <MedecinLayout />,
        children: [
          { path: "dashboard", element: <MedecinDashboardPage /> },
          { path: "consultations", element: <ConsultationsListPage /> },
          { path: "consultations/nouvelle", element: <ConsultationFormPage /> },
          { path: "patients", element: <PatientsListPage /> },
          { path: "patients/:id", element: <PatientDossierPage /> },
          { path: "profil", element: <MedecinProfilePage /> },
        ],
      },
    ],
  },
]);
