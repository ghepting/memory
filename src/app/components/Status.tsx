interface Props {
  isWin: boolean;
  moveCount: number;
}

export default function Status({ isWin, moveCount }: Props) {
  return (
    <>
      {isWin ? (
        <h4>You won in {moveCount} moves!</h4>
      ) : (
        <h4>
          {moveCount > 0 ? (
            <>Moves taken: {moveCount}</>
          ) : (
            <>Select two cards</>
          )}
        </h4>
      )}
    </>
  )
}