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

const FluentEmoji = ({ emoji, size, className }: { emoji: string; size: number; className: string }) => {
    const emojiName = getEmojiNameByCharacter(emoji);
    if (!emojiName) return null;
    return (
        <img
            src={`https://emojicdn.elk.sh/${emojiName}`}
            alt={emojiName}
            style={{ width: size, height: size }}
            className={className}
        />
    );
}

export default FluentEmoji;
