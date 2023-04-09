import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from '/src/components/app';

// Styles
import '/src/styles/main.scss';

const domNode = document.getElementById('root');
const root = createRoot(domNode);
root.render(
    <BrowserRouter>
        <App/>
    </BrowserRouter>
);

document.body.addEventListener('dragover', preventDefaults, false);
document.body.addEventListener('drop', preventDefaults, false);

function preventDefaults (e) {
    e.preventDefault()
    e.stopPropagation()
};