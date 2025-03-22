import emojilib from "@lobehub/emojilib";
import emojiRegex from "emoji-regex";

const getEmoji = (emoji: string): string | undefined => {
    const regex = emojiRegex();
    const pureEmoji = emoji.match(regex)?.[0];
    return pureEmoji;
};

const getEmojiNameByCharacter = (emoji: string): string | undefined => {
    const pureEmoji = getEmoji(emoji);
    if (!pureEmoji) return;
    const EmojiLab: any = emojilib;
    return EmojiLab?.[pureEmoji];
};

const emojiToUnicode = (emoji: string) => {
    return [...emoji].map((char) => char?.codePointAt(0)?.toString(16)).join('-');
}

const FluentEmoji = ({ emoji, size, className }: { emoji: string; size: number; className: string }) => {
    const emojiName = getEmojiNameByCharacter(emoji);
    const emojiUnicode = emojiToUnicode(emoji);
    if (!emojiName) return null;

    return (
        <img
            src={`https://registry.npmmirror.com/@lobehub/fluent-emoji-3d/latest/files/assets/${emojiUnicode}.webp`}
            alt={emojiName}
            style={{ width: size, height: size }}
            className={className}
        />
    );
}

export default FluentEmoji;