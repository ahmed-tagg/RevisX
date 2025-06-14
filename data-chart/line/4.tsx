"use client"

import { useEffect, useRef } from "react"

export default function Chart() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)
    canvas.style.width = `${rect.width}px`
    canvas.style.height = `${rect.height}px`

    // Data points (simulating visitor data over time)
    const data = [
      1200, 1350, 1250, 1400, 1300, 1450, 1500, 1550, 1700, 1600, 1650, 1800, 1750, 1900, 2000, 1950, 2100, 2200, 2150,
      2300, 2250, 2400, 2350, 2500, 2450, 2600, 2550, 2700, 2800, 2750,
    ]

    // Chart dimensions
    const padding = 20
    const width = rect.width - padding * 2
    const height = rect.height - padding * 2
    const dataMax = Math.max(...data) * 1.1
    const dataMin = Math.min(...data) * 0.9

    // Draw gradient background
    const gradient = ctx.createLinearGradient(0, padding, 0, height + padding)
    gradient.addColorStop(0, "rgba(147, 51, 234, 0.2)")
    gradient.addColorStop(1, "rgba(147, 51, 234, 0)")

    // Draw line
    ctx.beginPath()
    ctx.moveTo(padding, height + padding - ((data[0] - dataMin) / (dataMax - dataMin)) * height)

    for (let i = 0; i < data.length; i++) {
      const x = padding + (i / (data.length - 1)) * width
      const y = height + padding - ((data[i] - dataMin) / (dataMax - dataMin)) * height

      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        // Create a smooth curve
        const prevX = padding + ((i - 1) / (data.length - 1)) * width
        const prevY = height + padding - ((data[i - 1] - dataMin) / (dataMax - dataMin)) * height

        const cpX1 = prevX + (x - prevX) / 3
        const cpX2 = prevX + (2 * (x - prevX)) / 3

        ctx.bezierCurveTo(cpX1, prevY, cpX2, y, x, y)
      }
    }

    // Complete the path for the gradient fill
    ctx.lineTo(padding + width, height + padding)
    ctx.lineTo(padding, height + padding)
    ctx.closePath()

    // Fill with gradient
    ctx.fillStyle = gradient
    ctx.fill()

    // Draw the line again for the stroke
    ctx.beginPath()
    ctx.moveTo(padding, height + padding - ((data[0] - dataMin) / (dataMax - dataMin)) * height)

    for (let i = 0; i < data.length; i++) {
      const x = padding + (i / (data.length - 1)) * width
      const y = height + padding - ((data[i] - dataMin) / (dataMax - dataMin)) * height

      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        // Create a smooth curve
        const prevX = padding + ((i - 1) / (data.length - 1)) * width
        const prevY = height + padding - ((data[i - 1] - dataMin) / (dataMax - dataMin)) * height

        const cpX1 = prevX + (x - prevX) / 3
        const cpX2 = prevX + (2 * (x - prevX)) / 3

        ctx.bezierCurveTo(cpX1, prevY, cpX2, y, x, y)
      }
    }

    // Style and stroke the line
    ctx.strokeStyle = "rgb(147, 51, 234)"
    ctx.lineWidth = 2
    ctx.stroke()

    // Draw dots at data points
    for (let i = 0; i < data.length; i += 5) {
      const x = padding + (i / (data.length - 1)) * width
      const y = height + padding - ((data[i] - dataMin) / (dataMax - dataMin)) * height

      ctx.beginPath()
      ctx.arc(x, y, 3, 0, Math.PI * 2)
      ctx.fillStyle = "rgb(147, 51, 234)"
      ctx.fill()
      ctx.strokeStyle = "white"
      ctx.lineWidth = 1
      ctx.stroke()
    }
  }, [])

  return <canvas ref={canvasRef} className="w-full h-full" />
}
