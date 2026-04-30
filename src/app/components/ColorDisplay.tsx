import React, { useState } from 'react';
import { ColorData } from '../utils/color';

interface ColorDisplayProps {
    color: ColorData | null;
    onCopy: (val: string) => void;
}

export default function ColorDisplay({ color, onCopy }: ColorDisplayProps) {
    const [copiedField, setCopiedField] = useState<string | null>(null);

    const handleCopy = (type: string, val: string) => {
        onCopy(val);
        setCopiedField(type);
        setTimeout(() => setCopiedField(null), 1500);
    };

    const r = color?.r || 0;
    const g = color?.g || 0;
    const b = color?.b || 0;
    const h = color?.h || 0;
    const s = color?.s || 0;
    const l = color?.l || 0;
    const hex = color?.hex || '#1a1a1a';
    const name = color?.name || '';
    
    const isLight = l > 55;
    const nameColor = color ? (isLight ? '#000' : '#fff') : 'transparent';

    const dispHex = color ? hex.toUpperCase() : '';
    const dispRgb = color ? `rgb(${r}, ${g}, ${b})` : '';
    const dispHsl = color ? `hsl(${h}, ${s}%, ${l}%)` : '';

    return (
        <div className="panel">
            <div className="panel-label">detected colour</div>
            
            <div className="color-swatch-large" id="swatch" style={{ background: hex }}>
                <div className="swatch-overlay">
                    <div className="color-name-display" id="color-name" style={{ color: nameColor }}>
                        {name}
                    </div>
                </div>
            </div>
            
            <div className="values-grid">
                <div className="value-row">
                    <span className="value-label">R</span>
                    <div className="value-bar-wrap">
                        <div className="value-bar" id="bar-r" style={{ width: `${(r/255)*100}%`, background: '#ff5555' }}></div>
                    </div>
                    <span className="value-num" id="val-r">{color ? r : ''}</span>
                </div>
                
                <div className="value-row">
                    <span className="value-label">G</span>
                    <div className="value-bar-wrap">
                        <div className="value-bar" id="bar-g" style={{ width: `${(g/255)*100}%`, background: '#55ff55' }}></div>
                    </div>
                    <span className="value-num" id="val-g">{color ? g : ''}</span>
                </div>
                
                <div className="value-row">
                    <span className="value-label">B</span>
                    <div className="value-bar-wrap">
                        <div className="value-bar" id="bar-b" style={{ width: `${(b/255)*100}%`, background: '#5599ff' }}></div>
                    </div>
                    <span className="value-num" id="val-b">{color ? b : ''}</span>
                </div>
                
                <div className="value-row">
                    <span className="value-label">H</span>
                    <div className="value-bar-wrap">
                        <div className="value-bar" id="bar-h" style={{ width: `${(h/360)*100}%`, background: 'linear-gradient(to right,red,orange,lime,cyan,blue,magenta,red)' }}></div>
                    </div>
                    <span className="value-num" id="val-h">{color ? `${h}°` : ''}</span>
                </div>
            </div>
            
            <div className="copy-fields">
                <div 
                    className={`copy-field ${copiedField === 'hex' ? 'copied' : ''}`}
                    onClick={() => color && handleCopy('hex', dispHex)}
                >
                    <span className="copy-field-label">HEX</span>
                    <span className="copy-field-value">{dispHex}</span>
                    <span className="copy-icon"></span>
                </div>
                
                <div 
                    className={`copy-field ${copiedField === 'rgb' ? 'copied' : ''}`}
                    onClick={() => color && handleCopy('rgb', dispRgb)}
                >
                    <span className="copy-field-label">RGB</span>
                    <span className="copy-field-value">{dispRgb}</span>
                    <span className="copy-icon"></span>
                </div>
                
                <div 
                    className={`copy-field ${copiedField === 'hsl' ? 'copied' : ''}`}
                    onClick={() => color && handleCopy('hsl', dispHsl)}
                >
                    <span className="copy-field-label">HSL</span>
                    <span className="copy-field-value">{dispHsl}</span>
                    <span className="copy-icon"></span>
                </div>
            </div>
        </div>
    );
}
