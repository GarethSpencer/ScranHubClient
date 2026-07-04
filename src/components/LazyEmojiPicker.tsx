import EmojiPicker, {
  EmojiStyle,
  Theme,
  type EmojiClickData,
} from "emoji-picker-react";

interface Props {
  onEmojiClick: (data: EmojiClickData) => void;
  isDarkMode: boolean;
}

const LazyEmojiPicker = ({ onEmojiClick, isDarkMode }: Props) => (
  <EmojiPicker
    onEmojiClick={onEmojiClick}
    emojiStyle={EmojiStyle.NATIVE}
    theme={isDarkMode ? Theme.DARK : Theme.LIGHT}
    width="100%"
    lazyLoadEmojis
  />
);

export default LazyEmojiPicker;
