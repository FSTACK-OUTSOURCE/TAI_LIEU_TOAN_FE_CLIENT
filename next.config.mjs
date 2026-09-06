const nextConfig = {
    async rewrites() {
        return [
            {
                source: '/uploads/:path*',
                destination: 'https://api.tailieutoan.vn/uploads/:path*',
            },
        ]
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'api.tailieutoan.vn',
            },
        ],
    },
}