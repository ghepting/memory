import { Flex, Button, Select, Text } from "@radix-ui/themes"
import Status from "./Status"
import { Theme } from "./settings";

type Props = {
    isWin: boolean;
    moveCount: number;
    reset: () => void;
    cardCount: number;
    theme: string;
    setIsNewGameDialogOpen: (value: boolean) => void;
    handleDifficultySelection: (value: string) => void;
    handleThemeSelection: (value: Theme) => void;
}

const themes: Theme[] = [
  "cities",
  "nature",
  "travel",
  "architecture",
  "textures",
  "animals",
  "people",
  "food",
  "candy",
  "sports",
  "art",
]

export const Header = ({
    isWin,
    moveCount,
    reset,
    cardCount,
    theme,
    setIsNewGameDialogOpen,
    handleDifficultySelection,
    handleThemeSelection,
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
        <Flex gap="4">
          <Flex direction="column">
            <Text size="2">Difficulty</Text>
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
          <Flex direction="column">
            <Text size="2">Theme</Text>
            <Select.Root defaultValue="cities" value={theme} onValueChange={(value: Theme) => handleThemeSelection(value)}>
              <Select.Trigger variant="surface" color="blue" />
              <Select.Content  position="popper">
                {themes.map((theme) => (
                  <Select.Item key={theme} value={theme}>{theme}</Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </Flex>
        </Flex>
      </Flex>
  )
}
