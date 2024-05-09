import styles from "./grid.module.css";

interface Props {
  pairCount: number;
  children: React.ReactNode;
}

export default function MemoryGrid({ pairCount, children }: Props) {
  let className: string

  switch(pairCount) {
    case 18:
      className = styles.gridXL
      break;
    case 10:
      className = styles.gridL
      break;
    default:
      className = styles.gridS
  }

  return (
    <div className={className}>
      {children}
    </div>
  )
}