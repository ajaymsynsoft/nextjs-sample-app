/**
 * @type {import('next').NextConfig}
 */
 const nextConfig = {
    reactStrictMode: true,
    serverRuntimeConfig: {
        secret: 'SYNSOFT TEST STRING'
    },
    publicRuntimeConfig: {
        apiUrl: 'http://localhost:3001/api',  // production api,
        homeUrl: 'http://localhost:3001' 
    },
   
  }
  
  module.exports = nextConfig