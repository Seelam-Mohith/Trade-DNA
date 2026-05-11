import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout.jsx'
import Home from './pages/Home.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Analysis from './pages/Analysis.jsx'
import Rankings from './pages/Rankings.jsx'
import About from './pages/About.jsx'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/analysis" element={<Analysis />} />
        <Route path="/rankings" element={<Rankings />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<Home />} />
      </Route>
    </Routes>
  )
}
