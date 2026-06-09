import { Navigate, Route, Routes } from "react-router-dom"

import { SiteLayout } from "@/components/site-layout"
import { CareerPage } from "@/pages/CareerPage"
import { CompanyPage } from "@/pages/CompanyPage"
import { DataPlatformPage } from "@/pages/DataPlatformPage"
import { ChatPlatformPage } from "@/pages/ChatPlatformPage"
import { AiTranslatorPage } from "@/pages/AiTranslatorPage"
import { DocumentGeneratorPage } from "@/pages/DocumentGeneratorPage"
import { EmailAgentPage } from "@/pages/EmailAgentPage"
import { RagPlatformPage } from "@/pages/RagPlatformPage"
import { HomePage } from "@/pages/HomePage"
import { PlaceholderPage } from "@/pages/PlaceholderPage"
import { ResearchPage } from "./pages/ResearchPage"

export default function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route index element={<HomePage />} />
        <Route path="company/about" element={<CompanyPage />} />
        <Route path="company/career" element={<CareerPage />} />
        <Route
          path="company"
          element={<Navigate to="/company/about" replace />}
        />
        <Route
          path="products/data-platform"
          element={<DataPlatformPage />}
        />
        <Route
          path="products/document-platform"
          element={<Navigate to="/products/data-platform" replace />}
        />
        <Route path="products/rag-platform" element={<RagPlatformPage />} />
        <Route path="products/chat-platform" element={<ChatPlatformPage />} />
        <Route path="products/email-agent" element={<EmailAgentPage />} />
        <Route path="products/ai-translator" element={<AiTranslatorPage />} />
        <Route
          path="products/docu-generator"
          element={<DocumentGeneratorPage />}
        />
        <Route
          path="products/chatbot"
          element={<Navigate to="/products/chat-platform" replace />}
        />
        <Route path="products/:slug" element={<PlaceholderPage />} />
        <Route path="solutions/:slug" element={<PlaceholderPage />} />
        <Route path="research" element={<ResearchPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
