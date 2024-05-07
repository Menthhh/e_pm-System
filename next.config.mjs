/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        appDir: true,
        serverComponentsExternalPackages: ["mongoose"],
    },
    webpack: (config, { isServer }) => {
        if (!isServer) {
            config.externals.push('mongoose');
        }
        return config;
    },
};

export default nextConfig;
