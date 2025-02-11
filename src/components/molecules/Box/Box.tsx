import { ReactNode } from 'react';
import './Box.scss';

interface BoxProps {
    children: ReactNode;
}

const Box = ({ children }: BoxProps) => {
    return <div className='box'>{children}</div>;
}

export default Box;