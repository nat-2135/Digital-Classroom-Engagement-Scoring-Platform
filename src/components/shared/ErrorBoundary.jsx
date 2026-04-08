import React from 'react';

class ErrorBoundary extends React.Component {
    state = { hasError: false };
    
    static getDerivedStateFromError() {
        return { hasError: true };
    }
    
    render() {
        if (this.state.hasError) return (
            <div style={{
                padding:40, textAlign:'center',
                color:'#ef4444', fontFamily: 'DM Sans, sans-serif'
            }}>
                <p>Something went wrong loading this section.</p>
                <button
                    onClick={() => this.setState({hasError:false})}
                    style={{
                        marginTop:12, padding:'8px 20px',
                        background:'#059669', color:'#fff',
                        border:'none', borderRadius:8,
                        cursor:'pointer', fontFamily: 'DM Sans, sans-serif', fontWeight: 600
                    }}
                >Try Again</button>
            </div>
        );
        return this.props.children;
    }
}

export default ErrorBoundary;
