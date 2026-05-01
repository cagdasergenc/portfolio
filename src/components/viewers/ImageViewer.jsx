import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'

export default function ImageViewer({ url, onClose }) {
  return (
    <Lightbox
      open
      close={onClose}
      slides={[{ src: url }]}
    />
  )
}
