import { createContext, useContext, ReactNode, useState } from "react";
import PopOver from "../components/atoms/PopOver/PopOver";

interface PopOverContextType {
    openPopOver: (content: ReactNode) => void;
    close: () => void;
}

const PopOverContext = createContext<PopOverContextType | undefined>(undefined);

export const PopOverProvider = ({ children }: { children: ReactNode }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [content, setContent] = useState<ReactNode>(null);
    const [key, setKey] = useState(0);

    const openPopOver = (node: ReactNode) => {
        setContent(node);
        setKey((k) => k + 1);
        setIsOpen(true);
    };

    const close = () => setIsOpen(false);

    return (
        <PopOverContext.Provider value={{ openPopOver, close }}>
            {children}
            {isOpen && <PopOver key={key}>{content}</PopOver>}
        </PopOverContext.Provider>
    );
};

export const usePopOver = (): PopOverContextType => {
    const context = useContext(PopOverContext);
    if (!context) {
        throw new Error("usePopOver must be used within a PopOverProvider");
    }
    return context;
};
