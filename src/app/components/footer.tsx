import { Flex, Progress } from "@radix-ui/themes";

type Props = {
  isWin: boolean;
  matchedPairsCount: number;
  totalPairCount: number;
}

export const Footer = ({
  isWin,
  matchedPairsCount,
  totalPairCount,
}: Props) => {
  const percentage = (matchedPairsCount / totalPairCount) * 100

  return (
    <Flex gap="4" align="center">
      <h4>Progress:</h4>
      <Flex direction="column" flexGrow="1" gap="2">
        <Progress color={isWin ? 'green' : 'blue'} value={percentage} size="3" />
        <Flex gap="4" justify="between">
          <h5>{percentage.toFixed(1)}%</h5>
          <h5>({matchedPairsCount} of {totalPairCount} pairs matched)</h5>
        </Flex>
      </Flex>
    </Flex>
  );
};