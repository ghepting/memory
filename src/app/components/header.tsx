import { Flex, Button, Select } from "@radix-ui/themes"
import Status from "./Status"

type Props = {
    isWin: boolean;
    moveCount: number;
    reset: () => void;
    cardCount: number;
    setIsNewGameDialogOpen: (value: boolean) => void;
    handleDifficultySelection: (value: string) => void;
}

export const Header = ({
    isWin,
    moveCount,
    reset,
    cardCount,
    setIsNewGameDialogOpen,
    handleDifficultySelection,
}: Props) => {
  return (
    <Flex gap="4" justify="between" align="center">
        <h2>Memory Game</h2>
        <Flex gap="4" align="center">
          <Status isWin={isWin} moveCount={moveCount} />
          {isWin ? (
            <Button onClick={reset}>
              Play again?
            </Button>
          ) : (
            <Button disabled={!moveCount} onClick={() => setIsNewGameDialogOpen(true)}>
              New game
            </Button>
          )}
        </Flex>
        <Flex align="center" gap="2">
          <>Difficulty</>
          <Select.Root defaultValue="12" value={cardCount.toString()} onValueChange={(value) => handleDifficultySelection(value)}>
            <Select.Trigger variant="surface" color="blue" />
            <Select.Content  position="popper">
              <Select.Item value="12">Easy (4x3)</Select.Item>
              <Select.Item value="16">Casual (4x4)</Select.Item>
              <Select.Item value="20">Challenging (5x4)</Select.Item>
              <Select.Item value="36">Hard (6x6)</Select.Item>
            </Select.Content>
          </Select.Root>
        </Flex>
      </Flex>
  )
}