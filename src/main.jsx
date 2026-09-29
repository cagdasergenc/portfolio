/**
 * App entry. index.html loads this file and nothing imports it.
 *
 * Uses: App.jsx, index.css
 *
 * How it works: mounts React into <div id="root"> from index.html, wraps
 * everything in BrowserRouter so the URL decides what renders, and in
 * StrictMode so React double runs effects in dev and exposes bad cleanup.
 */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App'

createRoot(document.getElementById('root')).render(
  <StrictMode><BrowserRouter><App /></BrowserRouter></StrictMode>,
)
