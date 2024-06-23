'use client';
import { use, useEffect, useState } from "react";
import { Flex, Text, Button, Select, AlertDialog, Progress } from '@radix-ui/themes';
import styles from "./page.module.css";
import MemoryCard, { MemoryCardType } from "./components/MemoryCard";
import Status from "./components/Status";
import MemoryGrid from "./components/MemoryGrid";
import { Header } from "./components/header";
import { Footer } from "./components/footer";
import { Dialog } from "./components/dialog";
import {
  Settings,
  Theme,
  defaultSettings,
  loadSettings,
  saveSettings,
} from "./components/settings";
import { Random } from "unsplash-js/dist/methods/photos/types";

export default function Home() {
  const [settings, setSettings] = useState<Settings>(defaultSettings)
  const [cards, setCards] = useState<MemoryCardType[]>([])
  const [selectedCards, setSelectedCards] = useState<MemoryCardType[]>([])
  const [matchedCards, setMatchedCards] = useState<MemoryCardType[]>([])
  const [disabled, setDisabled] = useState(false)
  const [moveCount, setMoveCount] = useState(0)
  const [isWin, setIsWin] = useState(false)
  const [isNewGameDialogOpen, setIsNewGameDialogOpen] = useState(false)

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

  const reset = async () => {
    let photoUrls: string[] = [];
    const params = new URLSearchParams({
      count: settings.pairCount.toString(),
      query: settings.theme,
      orientation: settings.orientation,
      featured: "true",
    })
    const unsplashProxyUrl = new URL(`/api/unsplash/photos/random?${params.toString()}`, window.location.origin)
    const response = await fetch(
      unsplashProxyUrl,
      {
        method: "GET",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
      },
    )

    if (response.ok) {
      const data = await response.json()
      if (data.error) {
        console.error(data.error)
        return
      }

      photoUrls = data.data.response.map((photo: Random) => photo.urls.regular)
    } else {
      // TODO: implement toast notification with error message
      console.error(response.statusText)
    }

    const cards = Array.from({ length: settings.pairCount * 2 }).map((_, k) => ({
      index: k,
      key: (k % settings.pairCount + 1).toString(),
      imageUrl: photoUrls[k % settings.pairCount] ||
        `/photos/${k % settings.pairCount + 1}.jpg`,
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

  const handleThemeSelection = (theme: Theme) => {
    const newSettings: Settings = {...settings, theme}
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
      <Header
        isWin={isWin}
        moveCount={moveCount}
        reset={reset}
        cardCount={settings.pairCount * 2}
        theme={settings.theme}
        setIsNewGameDialogOpen={setIsNewGameDialogOpen}
        handleDifficultySelection={handleDifficultySelection}
        handleThemeSelection={handleThemeSelection}
      />

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

      <Footer
        isWin={isWin}
        matchedPairsCount={matchedCards.length / 2}
        totalPairCount={settings.pairCount}
      />

      <Dialog
        isNewGameDialogOpen={isNewGameDialogOpen}
        setIsNewGameDialogOpen={setIsNewGameDialogOpen}
        reset={reset}
      />
    </main>
  )
}
