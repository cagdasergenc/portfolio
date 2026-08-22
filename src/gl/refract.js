import { VERT, FRAG } from './shader.glsl'

function compile(gl, type, src) {
  const s = gl.createShader(type)
  gl.shaderSource(s, src)
  gl.compileShader(s)
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(s)
    gl.deleteShader(s)
    throw new Error(`shader compile failed: ${log}`)
  }
  return s
}

/**
 * Returns null when WebGL2 is unavailable, so the caller renders the flat
 * fallback instead of an empty canvas.
 */
export function createRefractor(canvas, imageUrl) {
  let gl
  try {
    gl = canvas.getContext('webgl2', { antialias: true, alpha: false })
  } catch {
    return null
  }
  if (!gl) return null

  let program
  try {
    program = gl.createProgram()
    gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, VERT))
    gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, FRAG))
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error(gl.getProgramInfoLog(program))
    }
  } catch (err) {
    console.warn('[refract]', err.message)
    return null
  }

  const buf = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buf)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
  const loc = gl.getAttribLocation(program, 'aPos')
  gl.enableVertexAttribArray(loc)
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)

  const u = (n) => gl.getUniformLocation(program, n)
  const U = {
    cover: u('uCover'), res: u('uRes'), push: u('uPush'),
    force: u('uForce'), capsule: u('uCapsule'), radius: u('uRadius'),
    voidColor: u('uVoid'), scrimTop: u('uScrimTop'), scrimBot: u('uScrimBot'),
  }

  const tex = gl.createTexture()
  gl.bindTexture(gl.TEXTURE_2D, tex)
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
    new Uint8Array([16, 16, 20, 255]))
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)

  let destroyed = false
  let loaded = false
  const img = new Image()
  img.crossOrigin = 'anonymous'
  img.onload = () => {
    if (destroyed) return
    gl.bindTexture(gl.TEXTURE_2D, tex)
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img)
    loaded = true
  }
  img.src = imageUrl

  let push = [0.5, 0.5], force = 0
  // Defaults match the old hardcoded card-shaped capsule and today's
  // Stage.jsx CSS gradients exactly, so nothing changes visually until a
  // caller starts feeding it real measured values.
  let capsule = [0.5, 0.82, 0.42, 0.085]
  let scrimTop = [0.52, 0.86, 0.60]
  let scrimBot = [0.56, 0.96, 0.88]
  let voidRgb = [0.039, 0.039, 0.047] // #0A0A0C — overwritten by setVoidColor before first real render

  return {
    isReady() { return loaded },
    setPush(x, y, f) { push = [x, y]; force = f },
    setCapsule(cx, cy, hw, hh) { capsule = [cx, cy, hw, hh] },
    setScrims({ topHeight, topStart, topMid, botHeight, botStart, botMid }) {
      scrimTop = [topHeight, topStart, topMid]
      scrimBot = [botHeight, botStart, botMid]
    },
    setVoidColor(r, g, b) { voidRgb = [r, g, b] },
    resize(w, h) {
      const dpr = Math.min(2, window.devicePixelRatio || 1)
      canvas.width = Math.max(1, Math.round(w * dpr))
      canvas.height = Math.max(1, Math.round(h * dpr))
      gl.viewport(0, 0, canvas.width, canvas.height)
    },
    render() {
      if (destroyed) return
      gl.useProgram(program)
      gl.activeTexture(gl.TEXTURE0)
      gl.bindTexture(gl.TEXTURE_2D, tex)
      gl.uniform1i(U.cover, 0)
      gl.uniform2f(U.res, canvas.width, canvas.height)
      gl.uniform2f(U.push, push[0], push[1])
      gl.uniform1f(U.force, force)
      gl.uniform4f(U.capsule, capsule[0], capsule[1], capsule[2], capsule[3])
      gl.uniform3f(U.voidColor, voidRgb[0], voidRgb[1], voidRgb[2])
      gl.uniform4f(U.scrimTop, scrimTop[0], scrimTop[1], scrimTop[2], 0)
      gl.uniform4f(U.scrimBot, scrimBot[0], scrimBot[1], scrimBot[2], 0)
      gl.uniform1f(U.radius, 0.08)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
    },
    destroy() {
      destroyed = true
      gl.deleteTexture(tex)
      gl.deleteBuffer(buf)
      gl.deleteProgram(program)
      gl.getExtension('WEBGL_lose_context')?.loseContext()
    },
  }
}
