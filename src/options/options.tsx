import React from 'react';
import { createRoot } from 'react-dom/client';

import { Card } from '@rmwc/card';
import '@rmwc/card/styles';
import { Typography } from '@rmwc/typography';
import '@rmwc/typography/styles';

import './options.css';

const App: React.FC<{}> = () => {
    return (
        <div className='root'>
            <Card className='card'>
                <div className='header'>
                    <img src='icon.png' className='icon' />
                    <div className='title'>
                        <Typography use='headline6'>YouTube Chapter Switcher</Typography>
                        <Typography use='caption' className='sub-header'>
                            Chrome extension for fast switching between chapters in your YouTube videos
                        </Typography>
                    </div>
                </div>
                <div className='content'>
                    <Typography use='body1'>This page in developing stage.</Typography>
                    <Typography use='body1'>Thank you for your attention to our extension.</Typography>
                    <Typography use='body1'>New features will be soon.</Typography>
                    <Typography use='body1'>With love your YouTube Chapter Switcher extension.</Typography>
                </div>
            </Card>
        </div>
    );
};

const container = document.createElement('div');
document.body.appendChild(container);
const root = createRoot(container);
root.render(<App />);
