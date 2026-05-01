export default function Footer({ resumeUrl, onOpenResume }) {
  return (
    <footer id="contact" className="w-full px-20 md:px-10 sm:px-6 py-16">
      <div className="max-w-[1170px]">
        <h3
          style={{ fontFamily: 'Inter, sans-serif', fontSize: 18, fontWeight: 700, lineHeight: '30px', margin: '0 0 8px' }}
          className="text-white"
        >
          Thanks for stopping by, let&apos;s chat! 👋
        </h3>

        <p
          style={{ fontFamily: 'Inter, sans-serif', fontSize: 16, fontWeight: 400, letterSpacing: 3, margin: '24px 0 4px' }}
          className="text-white uppercase"
        >
          Contact Me
        </p>
        <a
          href="mailto:cagdasergencc@gmail.com"
          style={{ fontFamily: 'Inter, sans-serif', fontSize: 16, fontWeight: 700, lineHeight: '26.67px' }}
          className="text-white/80 no-underline hover:underline"
        >
          cagdasergencc@gmail.com
        </a>

        <p
          style={{ fontFamily: 'Inter, sans-serif', fontSize: 16, fontWeight: 400, letterSpacing: 3, margin: '24px 0 4px' }}
          className="text-white uppercase"
        >
          Let&apos;s Connect
        </p>
        <div
          style={{ fontFamily: 'Inter, sans-serif', fontSize: 16, fontWeight: 700, lineHeight: '26.67px' }}
          className="flex gap-3 items-center"
        >
          <a
            href="https://www.linkedin.com/in/cagdas-ergenc"
            target="_blank"
            rel="noreferrer"
            className="text-white/80 no-underline hover:underline"
          >
            LinkedIn
          </a>
          <span className="text-white/40">|</span>
          <button
            onClick={onOpenResume}
            style={{ fontFamily: 'Inter, sans-serif', fontSize: 16, fontWeight: 700, background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
            className="text-white/80 hover:underline"
          >
            Resume
          </button>
          <span className="text-white/40">|</span>
          <a href="#portfolio" className="text-white/80 no-underline hover:underline">
            Work
          </a>
        </div>

        <p
          style={{ fontFamily: 'Inter, sans-serif', fontSize: 16, fontWeight: 400, letterSpacing: 1.5, margin: '32px 0 4px' }}
          className="text-white"
        >
          @2026 CAGDAS ERGENC
        </p>
        <p
          style={{ fontFamily: 'Inter, sans-serif', fontSize: 16, fontWeight: 700 }}
          className="text-white m-0"
        >
          Made with ☕
        </p>
      </div>
    </footer>
  )
}
