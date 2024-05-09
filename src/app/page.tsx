'use client';
import { use, useEffect, useState } from "react";
import { Flex, Text, Button, Select, AlertDialog, Progress } from '@radix-ui/themes';
import styles from "./page.module.css";
import MemoryCard, { MemoryCardType } from "./components/MemoryCard";
import Status from "./components/Status";
import MemoryGrid from "./components/MemoryGrid";

interface Settings {
  pairCount: 6 | 8 | 10 | 18; // 4x3, 4x4, 5x4, 6x6 grid sizes
  clearSelectionTimer: number;
}

const defaultSettings: Settings = { pairCount: 6, clearSelectionTimer: 2000 }

function loadSettings(): Settings {
  if (typeof localStorage !== 'undefined') {
    console.log('loading settings from localStorage')
    const savedSettingsJSON = localStorage.getItem('memory-game-settings')
    if (savedSettingsJSON) {
      console.log('loaded settings:', savedSettingsJSON)
      // TODO: add zod for runtime validation
      return JSON.parse(savedSettingsJSON)
    }
  }

  return defaultSettings
}

function saveSettings(settings: Settings) {
  if (typeof localStorage !== 'undefined') {
    console.log('saving settings to localStorage')
    localStorage.setItem('memory-game-settings', JSON.stringify(settings))
    console.log('saved settings:', loadSettings())
  }
}

export default function Home() {
  const [settings, setSettings] = useState<Settings>(defaultSettings)
  const [cards, setCards] = useState<MemoryCardType[]>([])
  const [selectedCards, setSelectedCards] = useState<MemoryCardType[]>([])
  const [matchedCards, setMatchedCards] = useState<MemoryCardType[]>([])
  const [disabled, setDisabled] = useState(false)
  const [moveCount, setMoveCount] = useState(0)
  const [isWin, setIsWin] = useState(false)
  const [isNewGameDialogOpen, setIsNewGameDialogOpen] = useState(false)

  const percentage = (matchedCards.length / 2 / settings.pairCount) * 100

  useEffect(() => {
    setSettings(loadSettings())
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    reset()
  }, [settings]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    let delayedClear: NodeJS.Timeout

    if (selectedCards.length === 2) setMoveCount(moveCount + 1)

    if (selectedCards[0] && selectedCards[1] && selectedCards[0].key === selectedCards[1].key) {
      setMatchedCards([...matchedCards, selectedCards[0], selectedCards[1]])
    } else if (selectedCards.length === 2) { // clear unmatched pair selection after N seconds
      delayedClear = setTimeout(() => setSelectedCards([]), settings.clearSelectionTimer)
    }

    return () => clearTimeout(delayedClear)
  }, [selectedCards]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (matchedCards.length === settings.pairCount * 2) {
      setIsWin(true)
      setDisabled(true)
    }
  }, [matchedCards]) // eslint-disable-line react-hooks/exhaustive-deps

  const reset = () => {
    const cards = Array.from({ length: settings.pairCount * 2 }).map((_, k) => ({
      index: k,
      key: (k % settings.pairCount + 1).toString(),
      imageUrl: `/photos/${k % settings.pairCount + 1}.jpg`,
    }))

    setIsNewGameDialogOpen(false)
    setMoveCount(0)
    setIsWin(false)
    setDisabled(false)
    setSelectedCards([])
    setMatchedCards([])
    setCards(cards.sort(() => Math.random() - 0.5))
  }

  const handleDifficultySelection = (value: string) => {
    const pairCount = parseInt(value) / 2
    if (pairCount !== 6 && pairCount !== 8 && pairCount !== 10 && pairCount !== 18) throw new Error('Invalid pair count')
    const newSettings: Settings = {...settings, pairCount}
    saveSettings(newSettings)
    setSettings(newSettings)
  }

  const handleCardSelection = (card: MemoryCardType) => {
    if (isWin) return

    if (selectedCards.length === 1 && selectedCards[0] === card) {
      setSelectedCards([]) // deselect the card
    } else if (selectedCards.length === 2) {
      setSelectedCards([card]) // deselect the previous cards
    } else {
      setSelectedCards([...selectedCards, card]) // add card to selection
    }
  }

  return (
    <main className={styles.main}>
      {/* header */}
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
          <Select.Root defaultValue="12" value={(settings.pairCount * 2).toString()} onValueChange={(value) => handleDifficultySelection(value)}>
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
      {/* game */}
      <MemoryGrid pairCount={settings.pairCount}>
        {cards.map((card, k) => (
          <MemoryCard
            key={card.index}
            card={card}
            disabled={disabled || matchedCards.includes(card)}
            matchedCards={matchedCards}
            selectedCards={selectedCards}
            handleSelection={() => handleCardSelection(card)}
          />
        ))}
      </MemoryGrid>
      {/* footer */}
      <Flex gap="4" align="center">
        <h4>Progress:</h4>
        <Flex direction="column" flexGrow="1" gap="2">
          <Progress color={isWin ? 'green' : 'blue'} value={percentage} size="3" />
          <Flex gap="4" justify="between">
            <h5>{percentage.toFixed(1)}%</h5>
            <h5>({matchedCards.length / 2} of {settings.pairCount} pairs matched)</h5>
          </Flex>
        </Flex>
      </Flex>
      <AlertDialog.Root open={isNewGameDialogOpen}>
        <AlertDialog.Content maxWidth="450px">
          <AlertDialog.Title>Start a new game?</AlertDialog.Title>
          <AlertDialog.Description size="2">
            You will lose your progress. Would you like to start a new game?
          </AlertDialog.Description>
          <Flex gap="3" mt="4" justify="end">
            <AlertDialog.Cancel>
              <Button variant="soft" color="gray" onClick={() => setIsNewGameDialogOpen(false)}>
                Cancel
              </Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action>
              <Button variant="solid" onClick={reset}>
                Start new game
              </Button>
            </AlertDialog.Action>
          </Flex>
        </AlertDialog.Content>
      </AlertDialog.Root>
    </main>
  )
}
