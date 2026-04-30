import React, { useState, useCallback } from 'react';
import CanvasPanel from './components/CanvasPanel';
import ColorDisplay from './components/ColorDisplay';
import HistoryPanel from './components/HistoryPanel';
import Toast from './components/Toast';
import { ColorData } from './utils/color';

export default function App() {
    const [currentColor, setCurrentColor] = useState<ColorData | null>(null);
    const [history, setHistory] = useState<ColorData[]>([]);
    const [toastData, setToastData] = useState<{ text: string; id: number }>({ text: '', id: 0 });

    const handleColorDetected = useCallback((color: ColorData) => {
        setCurrentColor(color);
    }, []);

    const showToast = useCallback((msg: string) => {
        setToastData({ text: msg, id: Date.now() });
    }, []);

    const addToHistory = useCallback((color: ColorData) => {
        setHistory(prev => {
            if (prev.find(c => c.hex === color.hex)) return prev;
            return [{...color}, ...prev].slice(0, 20);
        });
        showToast('Saved ' + color.hex.toUpperCase());
    }, [showToast]);

    const clearAll = useCallback(() => {
        setCurrentColor(null);
    }, []);

    return (
        <div className="app-container">
            <header>
                <h1>Colour <span>Detector</span></h1>
                <p className="subtitle">Upload &nbsp; Click &nbsp; Extract</p>
            </header>

            <div className="container">
                <CanvasPanel
                    onColorDetected={handleColorDetected}
                    onColorClick={() => currentColor && addToHistory(currentColor)}
                    onClear={clearAll}
                />

                <ColorDisplay
                    color={currentColor}
                    onCopy={(val) => {
                        navigator.clipboard.writeText(val);
                        showToast('Copied ' + val);
                    }}
                />

                <HistoryPanel
                    history={history}
                    onSelect={(c) => setCurrentColor(c)}
                />
            </div>

            <Toast toastData={toastData} />
        </div>
    );
}
