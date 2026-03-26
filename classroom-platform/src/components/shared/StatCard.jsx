import React from 'react';

const StatCard = ({ label, value, color, suffix='' }) => (
    <div style={{
        background:'#fff', borderRadius:12,
        border:'1px solid #e5e7eb',
        padding:20,
        borderLeft:`4px solid ${color}`
    }}>
        <p style={{
            fontSize:12, color:'#6b7280',
            marginBottom:8, textTransform:'uppercase',
            letterSpacing:'0.05em',
            fontFamily: 'DM Sans, sans-serif',
            fontWeight: 600
        }}>{label}</p>
        <p style={{
            fontSize:28, fontWeight:700,
            color, lineHeight:1,
            fontFamily: 'DM Sans, sans-serif'
        }}>{value}{suffix}</p>
    </div>
);

export default StatCard;
