/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        formats: ["image/avif", "image/webp"],
        dangerouslyAllowSVG: true,
        remotePatterns: [
            {hostname: "lh3.googleusercontent.com"},
        ]
    },
};

export default nextConfig;
