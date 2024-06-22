import { AlertDialog, Button, Flex } from '@radix-ui/themes';

type Props = {
  isNewGameDialogOpen: boolean;
  setIsNewGameDialogOpen: (value: boolean) => void;
  reset: () => void;
}

export const Dialog = ({
  isNewGameDialogOpen,
  setIsNewGameDialogOpen,
  reset,
}: Props) => {
  return (
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
  )
};