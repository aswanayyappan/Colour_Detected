import React, { useEffect, useState } from 'react';

interface ToastProps {
    toastData: { text: string; id: number };
}

export default function Toast({ toastData }: ToastProps) {
    const [show, setShow] = useState(false);
    const [currentMsg, setCurrentMsg] = useState('');

    useEffect(() => {
        if (toastData.text) {
            setCurrentMsg(toastData.text);
            setShow(true);
            const timer = setTimeout(() => setShow(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [toastData]);

    return (
        <div className={`toast ${show ? 'show' : ''}`}>
            {currentMsg}
        </div>
    );
}
