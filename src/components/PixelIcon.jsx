import React from 'react';

/**
 * Pixel Art SVG Icons matching Streamline Pixel Icon style
 * Rendered with crispEdges for authentic 8-bit / 16-bit retro graphics
 */
export const PixelIcon = ({ name, className = "w-6 h-6", color = "currentColor" }) => {
  const icons = {
    // Cute Pixel Bread (from screenshot)
    bread: (
      <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={{ shapeRendering: 'crispEdges' }}>
        <path d="M4 2h8v1H4V2zM3 3h10v1H3V3zM2 4h12v7H2V4zM3 11h10v1H3v-1zM4 12h8v1H4v-1z" fill={color} />
        <path d="M4 4h8v6H4V4z" fill="#FFF" />
        {/* Eyes & Smile */}
        <path d="M6 6h1v1H6V6zM9 6h1v1H9V6z" fill={color} />
        <path d="M7 8h2v1H7V8z" fill={color} />
      </svg>
    ),

    // Pixel Diamond (from screenshot)
    diamond: (
      <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={{ shapeRendering: 'crispEdges' }}>
        <path d="M5 2h6v1H5V2zM3 3h10v2H3V3zM2 5h12v1H2V5zM3 6h10v2H3V6zM4 8h8v2H4V8zM6 10h4v2H6v-2zM7 12h2v2H7v-2z" fill={color} />
        <path d="M5 4h6v1H5V4zM4 5h3v1H4V5zM9 5h3v1H9V5zM5 6h2v2H5V6z" fill="#FFF" />
      </svg>
    ),

    // Pixel Peace / Victory Hand (from screenshot)
    peace: (
      <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={{ shapeRendering: 'crispEdges' }}>
        <path d="M4 2h2v5H4V2zM7 1h2v6H7V1zM9 5h2v3H9V5zM4 7h7v1H4V7zM3 8h9v5H3V8zM4 13h7v1H4v-1z" fill={color} />
        <path d="M5 3h1v3H5V3zM8 2h1v4H8V2z" fill="#FFF" />
      </svg>
    ),

    // Pixel Dino (from screenshot)
    dino: (
      <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={{ shapeRendering: 'crispEdges' }}>
        <path d="M8 2h6v1H8V2zM7 3h7v4H7V3zM7 7h4v1H7V7zM4 8h8v2H4V8zM3 10h10v2H3v-2zM4 12h3v3H4v-3zM9 12h3v3H9v-3z" fill={color} />
        <path d="M12 4h1v1h-1V4z" fill="#FFF" />
      </svg>
    ),

    // Pixel Coin / Token
    coin: (
      <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={{ shapeRendering: 'crispEdges' }}>
        <path d="M5 2h6v1H5V2zM3 3h10v1H3V3zM2 4h12v8H2V4zM3 12h10v1H3v-1zM5 13h6v1H5v-1z" fill={color} />
        <path d="M5 4h6v7H5V4z" fill="#FFD700" />
        <path d="M7 5h2v5H7V5z" fill={color} />
      </svg>
    ),

    // Pixel Heart
    heart: (
      <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={{ shapeRendering: 'crispEdges' }}>
        <path d="M3 2h3v1H3V2zM10 2h3v1h-3V2zM2 3h5v1H2V3zM9 3h5v1H9V3zM1 4h14v4H1V4zM2 8h12v2H2V8zM4 10h8v2H4v-2zM6 12h4v2H6v-2zM7 14h2v1H7v-1z" fill={color} />
        <path d="M3 4h3v2H3V4zM10 4h3v2h-3V4z" fill="#FF4B4B" />
      </svg>
    ),

    // Pixel Wallet
    wallet: (
      <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={{ shapeRendering: 'crispEdges' }}>
        <path d="M2 3h12v2H2V3zM1 5h14v8H1V5zM2 13h12v1H2v-1z" fill={color} />
        <path d="M10 7h4v4h-4V7z" fill={color} />
        <path d="M11 8h2v2h-2V8z" fill="#FFF" />
      </svg>
    ),

    // Pixel Water Drop
    water: (
      <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={{ shapeRendering: 'crispEdges' }}>
        <path d="M7 1h2v2H7V1zM6 3h4v2H6V3zM5 5h6v2H5V5zM4 7h8v4H4V7zM5 11h6v2H5v-2zM7 13h2v1H7v-1z" fill={color} />
        <path d="M6 7h2v3H6V7z" fill="#FFF" />
      </svg>
    ),

    // Pixel Rocket / Freighter
    rocket: (
      <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={{ shapeRendering: 'crispEdges' }}>
        <path d="M7 1h2v2H7V1zM6 3h4v3H6V3zM5 6h6v4H5V6zM3 8h2v4H3V8zM11 8h2v4h-2V8zM6 10h4v2H6v-2zM7 12h2v3H7v-3z" fill={color} />
        <path d="M7 5h2v2H7V5z" fill="#FFF" />
      </svg>
    ),

    // Pixel Key / Albedo
    key: (
      <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={{ shapeRendering: 'crispEdges' }}>
        <path d="M4 2h4v1H4V2zM3 3h6v4H3V3zM4 7h4v1H4V7zM7 8h6v2H7V8zM11 10h2v2h-2v-2zM9 10h1v2H9v-2z" fill={color} />
        <path d="M5 4h2v2H5V4z" fill="#FFF" />
      </svg>
    ),

    // Pixel Lightning / xBull
    flash: (
      <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={{ shapeRendering: 'crispEdges' }}>
        <path d="M8 1h3v4H8V1zM6 4h4v3H6V4zM4 7h5v2H4V7zM5 9h3v2H5V9zM6 11h2v2H6v-2zM7 13h1v2H7v-2z" fill={color} />
      </svg>
    ),

    // Pixel Check
    check: (
      <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={{ shapeRendering: 'crispEdges' }}>
        <path d="M12 4h2v2h-2V4zM10 6h2v2h-2V6zM8 8h2v2H8V8zM6 10h2v2H6v-2zM4 8h2v2H4V8zM2 6h2v2H2V6z" fill={color} />
      </svg>
    ),

    // Pixel Alert / Warning
    alert: (
      <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={{ shapeRendering: 'crispEdges' }}>
        <path d="M7 2h2v1H7V2zM6 3h4v3H6V3zM5 6h6v4H5V6zM4 10h8v2H4v-2zM3 12h10v2H3v-2z" fill={color} />
        <path d="M7 5h2v3H7V5zM7 9h2v1H7V9z" fill="#FFF" />
      </svg>
    ),

    // Pixel Star
    star: (
      <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={{ shapeRendering: 'crispEdges' }}>
        <path d="M7 1h2v3H7V1zM4 4h8v2H4V4zM1 6h14v2H1V6zM3 8h10v2H3V8zM4 10h3v4H4v-4zM9 10h3v4H9v-4z" fill={color} />
      </svg>
    ),

    // Pixel Refresh
    refresh: (
      <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={{ shapeRendering: 'crispEdges' }}>
        <path d="M4 2h6v2H4V2zM2 4h2v5H2V4zM4 9h6v2H4V9zM10 5h2v6h-2V5zM11 2h3v3h-3V2zM2 11h3v3H2v-3z" fill={color} />
      </svg>
    )
  };

  return icons[name] || icons.bread;
};
