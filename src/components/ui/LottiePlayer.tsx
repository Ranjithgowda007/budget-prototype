'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import Lottie to avoid SSR issues
const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

interface LottiePlayerProps {
    animationUrl?: string;
    className?: string;
}

export function LottiePlayer({ animationUrl, className }: LottiePlayerProps) {
    const [animationData, setAnimationData] = useState<any>(null);

    useEffect(() => {
        if (animationUrl) {
            fetch(animationUrl)
                .then(response => {
                    if (!response.ok) throw new Error('Failed to fetch animation');
                    return response.json();
                })
                .then(data => setAnimationData(data))
                .catch(err => console.error('Error loading Lottie animation:', err));
        }
    }, [animationUrl]);

    if (!animationData) return null;

    return (
        <div className={className}>
            <Lottie animationData={animationData} loop={true} />
        </div>
    );
}
