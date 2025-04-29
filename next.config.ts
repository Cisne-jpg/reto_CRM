import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['i.ibb.co'], // Agrega este dominio
    // Opcional: para más control usa remotePatterns (Next.js 13+)
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.ibb.co',
        port: '',
        pathname: '/**', // Permite todas las rutas bajo este dominio
      },
    ],
  },
};


export default nextConfig;
