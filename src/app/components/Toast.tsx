import React, { useEffect, useRef } from 'react';

interface ToastProps {
    toastData: { text: string; id: number };
}

export default function Toast({ toastData }: ToastProps) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!toastData.text || !ref.current) return;
        const el = ref.current;
        el.textContent = toastData.text;
        el.classList.add('show');
        const t = setTimeout(() => el.classList.remove('show'), 1800);
        return () => clearTimeout(t);
    }, [toastData.id]);

    return <div className="toast" id="toast" ref={ref}></div>;
}
