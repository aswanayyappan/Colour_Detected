import React from 'react';
import { ColorData } from '../utils/color';

interface HistoryPanelProps {
    history: ColorData[];
    onSelect: (c: ColorData) => void;
}

export default function HistoryPanel({ history, onSelect }: HistoryPanelProps) {
    return (
        <div className="panel history-panel">
            <div className="panel-label">
                colour history <span style={{ color: '#333', marginLeft: 8 }}>( {history.length} )</span>
            </div>
            <div className="history-swatches" id="history-swatches">
                {history.length === 0 ? (
                    <span className="history-empty">No colours picked yet — hover over an image and click to sample</span>
                ) : (
                    history.map((c, i) => (
                        <div 
                            key={i} 
                            className="history-swatch" 
                            style={{ background: c.hex }} 
                            title={`${c.name} ${c.hex.toUpperCase()}`}
                            onClick={() => onSelect(c)}
                        ></div>
                    ))
                )}
            </div>
        </div>
    );
}
