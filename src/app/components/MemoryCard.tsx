import Image from "next/image";
import styles from "./card.module.css";
import { StarFilledIcon } from "@radix-ui/react-icons";

export interface MemoryCardType {
  index: number;
  key: string;
  imageUrl: string;
}

interface Props {
  card: MemoryCardType;
  disabled: boolean;
  matchedCards: MemoryCardType[];
  selectedCards: MemoryCardType[];
  handleSelection: () => void;
}

export default function MemoryCard({ card, disabled, matchedCards, selectedCards, handleSelection }: Props) {
  return (
    <div key={card.index} className={cardStyles(card, disabled, matchedCards, selectedCards)} onClick={handleSelection}>
      <div className={styles.cardInner}>
        <div className={styles.cardFront}>
          <StarFilledIcon />
        </div>
        <div className={styles.cardBack}>
          <Image priority={true} src={card.imageUrl} alt={card.key} width="360" height="360" />
        </div>
      </div>
    </div>
  )
}

const cardStyles = (card: MemoryCardType, disabled: boolean, matchedCards: MemoryCardType[], selectedCards: MemoryCardType[]) => {
  const classNames = [styles.card]
  if (disabled) classNames.push(styles.disabled)
    if (matchedCards.includes(card)) classNames.push(styles.matched)
  else if (selectedCards.includes(card)) classNames.push(styles.selected)
  return classNames.join(' ')
}
