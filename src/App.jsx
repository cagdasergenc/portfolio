import { useState, Component } from 'react'
import './App.css'
import { ShaderGradientCanvas, ShaderGradient } from '@shadergradient/react'
import resumePdf from './assets/resume.pdf?url'
import logoPocketPed from './assets/logos/pocket_pediatrics_logo.png'
import logoDnbDtf from './assets/logos/dabdtf_logo.png'
import logoYesChef from './assets/logos/yes_chef_logo.png'
import logoMesfeno from './assets/logos/mesfeno_logo.png'
import logoShirtPrint from './assets/logos/shirt_printing_logo.png'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import ProjectGrid from './components/ProjectGrid'
import Footer from './components/Footer'
import PDFViewer from './components/viewers/PDFViewer'
import ImageViewer from './components/viewers/ImageViewer'

const caseStudies = [
  {
    title: 'Pocket Pediatrics',
    subtitle: 'UX Research, Healthcare, IED Barcelona',
    image: logoPocketPed,
    fileUrl: '/files/pocket_pediatrics.pdf',
    fileType: 'pdf',
    fill: true,
  },
  {
    title: 'D&B DTF',
    subtitle: 'UX Case Study',
    image: logoDnbDtf,
    fileUrl: '/files/DAB_DTF_UX_Case_Study.pdf',
    fileType: 'pdf',
  },
]

const ecommerce = [
  {
    title: 'D&B DTF',
    subtitle: 'UI, Web Design',
    image: logoDnbDtf,
    href: 'https://dabdtf.com',
  },
  {
    title: 'MesfenoWear',
    subtitle: 'UI, Web Design',
    image: logoMesfeno,
    href: 'https://mesfenowear.com',
    cardBg: '#EFEFEA',
  },
  {
    title: 'ShirtPrintCenter',
    subtitle: 'UI, Web Design',
    image: logoShirtPrint,
    href: 'https://shirtprintingcenter.com',
  },
]

const productFiles = import.meta.glob('./assets/products/*', { eager: true })
const renderings = Object.values(productFiles).map((mod) => ({
  image: mod.default,
  fileUrl: mod.default,
  fileType: 'jpg',
}))

class ErrorBoundary extends Component {
  state = { error: null }
  static getDerivedStateFromError(e) { return { error: e } }
  render() {
    if (this.state.error) return (
      <div style={{ color: 'red', background: '#111', padding: 32, fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
        <b>Render error:</b>{'\n'}{this.state.error.message}{'\n'}{this.state.error.stack}
      </div>
    )
    return this.props.children
  }
}

export default function App() {
  const [viewer, setViewer] = useState(null)

  const openViewer = (url, type) => setViewer({ url, type })
  const closeViewer = () => setViewer(null)

  return (
    <ErrorBoundary>
      {/* Fixed full-page gradient background */}
      <div style={{ position: 'fixed', inset: 0, zIndex: -1 }}>
        <ShaderGradientCanvas style={{ width: '100%', height: '100%' }}>
          <ShaderGradient
            animate="on"
            brightness={0.5}
            cAzimuthAngle={270}
            cDistance={0.5}
            cPolarAngle={180}
            cameraZoom={14.88}
            color1="#73bfc4"
            color2="#ff810a"
            color3="#8da0ce"
            destination="onCanvas"
            embedMode="off"
            envPreset="city"
            fov={40}
            frameRate={10}
            grain="on"
            lightType="env"
            pixelDensity={1.2}
            positionX={-0.1}
            positionY={0}
            positionZ={0}
            reflection={0.5}
            rotationX={0}
            rotationY={130}
            rotationZ={70}
            shader="defaults"
            type="sphere"
            uAmplitude={3.5}
            uDensity={3.1}
            uFrequency={5.5}
            uSpeed={0.3}
            uStrength={0}
            uTime={0}
            wireframe={false}
          />
        </ShaderGradientCanvas>
      </div>
      <Navbar />
      <Hero />
      <ProjectGrid title="Case Studies" items={caseStudies} onOpen={openViewer} />
      <ProjectGrid title="E-commerce & Web Design" items={ecommerce} onOpen={openViewer} />
      <ProjectGrid title="Product Renderings" items={renderings} imageOnly dense onOpen={openViewer} />
      <Footer resumeUrl={resumePdf} onOpenResume={() => openViewer(resumePdf, 'pdf')} />

      {viewer?.type === 'pdf' && (
        <PDFViewer url={viewer.url} onClose={closeViewer} />
      )}
      {viewer?.type === 'jpg' && (
        <ImageViewer url={viewer.url} onClose={closeViewer} />
      )}
    </ErrorBoundary>
  )
}
