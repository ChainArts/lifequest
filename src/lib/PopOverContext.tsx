import { createContext, useContext, ReactNode, useState } from "react";
import PopOver from "../components/atoms/PopOver/PopOver";

interface PopOverContextType {
    openPopOver: (title: string, content: ReactNode) => void;
    close: () => void;
}

const PopOverContext = createContext<PopOverContextType | undefined>(undefined);

export const PopOverProvider = ({ children }: { children: ReactNode }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [title, setTitle] = useState<string>("");
    const [content, setContent] = useState<ReactNode>(null);
    const [key, setKey] = useState(0);

    const openPopOver = (newTitle: string, newContent: ReactNode) => {
        setTitle(newTitle);
        setContent(newContent);
        setKey((k) => k + 1);
        setIsOpen(true);
    };

    const close = () => setIsOpen(false);

    return (
        <PopOverContext.Provider value={{ openPopOver, close }}>
            {children}
            {isOpen && (
                <PopOver title={title} key={key}>
                    {content}
                </PopOver>
            )}
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
