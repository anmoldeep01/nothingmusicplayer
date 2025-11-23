import React from 'react';

const GlassCard = ({ children, className = '', style = {} }) => {
    const cardStyle = {
        background: 'var(--card-bg)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--border-radius)',
        ...style
    };

    return (
        <div className={className} style={cardStyle}>
            {children}
        </div>
    );
};

export default GlassCard;
