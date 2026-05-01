export default function Hero() {
  return (
    <section className="relative w-full h-screen" id="about">
      {/* Centered text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
        <p
          style={{
            fontFamily: 'Epilogue, sans-serif',
            fontSize: 17,
            fontWeight: 400,
            lineHeight: '27px',
            textShadow: '0px 0px 25px rgba(32, 21, 131, 1)',
          }}
          className="text-white mb-2"
        >
          PRODUCT/UX DESIGNER
        </p>
        <h1
          style={{
            fontFamily: 'Epilogue, sans-serif',
            fontSize: 'clamp(36px, 6vw, 56px)',
            fontWeight: 600,
            lineHeight: '1.15',
            textShadow: '0px 10px 50px rgba(32, 21, 131, 1)',
            margin: 0,
          }}
          className="text-white mb-4"
        >
          Çağdaş Ergenç
        </h1>
        <p
          style={{
            fontFamily: 'Epilogue, sans-serif',
            fontSize: 17,
            fontWeight: 400,
            lineHeight: '27px',
          }}
          className="text-white"
        >
          UX Designer &amp; Rapid Prototyper
          <br />
          Previously @ Admirise &amp; DFDS
        </p>
      </div>
    </section>
  )
}

