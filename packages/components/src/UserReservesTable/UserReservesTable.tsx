import React from "react";
import {
  HStack,
  Heading,
  Image,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
} from "@chakra-ui/react";
import { type GetUserReservesResponse, formatBalance } from "@aave/react-sdk";
import { useSupply, useWithdraw } from "@aave/react-sdk";
import { useWalletClient } from "wagmi";
import { CryptoIconMap, genericCryptoIcon } from "../CryptoIcons";
import { SupplyButton } from "./SupplyButton";
import { WithdrawButton } from "./WithdrawButton";

type Props = {
  userReserves: GetUserReservesResponse["formattedReserves"];
  tableCaption?: React.ReactNode;
};

export const UserReservesTable: React.FC<Props> = ({
  userReserves,
  tableCaption,
}) => {
  const { data: signer } = useWalletClient();
  return (
    <TableContainer>
      <Table variant="simple">
        <TableCaption>{tableCaption}</TableCaption>
        <Thead>
          <Tr>
            <Th>Actions</Th>
            <Th>Token</Th>
            <Th>Balance</Th>
            <Th>Variable Borrows</Th>
            <Th>Total Borrows</Th>
          </Tr>
        </Thead>
        <Tbody>
          {userReserves.userReservesData
            .filter(
              (userReserve) =>
                Number(userReserve.underlyingBalance) > 0 ||
                Number(userReserve.totalBorrows) > 0,
            )
            .map((userReserve) => (
              <Tr key={userReserve.reserve.id}>
                <Td>
                  <HStack spacing={1}>
                    <SupplyButton
                      signer={signer}
                      maxAmount="1"
                      reserveAddress={userReserve.reserve.underlyingAsset}
                    />
                    <WithdrawButton
                      signer={signer}
                      maxAmount="1"
                      reserveAddress={userReserve.reserve.underlyingAsset}
                    />
                  </HStack>
                </Td>
                <Td>
                  <HStack spacing={2}>
                    <Image
                      src={
                        CryptoIconMap[
                          userReserve.reserve.symbol.toUpperCase()
                        ] ?? genericCryptoIcon
                      }
                      alt={userReserve.reserve.symbol}
                      boxSize="30px"
                    />
                    <Heading size="sm">{userReserve.reserve.name}</Heading>
                  </HStack>
                </Td>
                <Td>
                  <VStack spacing={0} justify="flex-start" align="flex-start">
                    <HStack spacing={1}>
                      <Heading size="sm">
                        {formatBalance(userReserve.underlyingBalance)}
                      </Heading>
                      <Text size="sm" as="sub">
                        {userReserve.reserve.symbol}
                      </Text>
                    </HStack>
                    <HStack spacing={1}>
                      <Heading size="sm">
                        {formatBalance(userReserve.underlyingBalanceUSD, "USD")}
                      </Heading>
                      <Text size="sm" as="sub">
                        USD
                      </Text>
                    </HStack>
                  </VStack>
                </Td>
                <Td>
                  <VStack spacing={0} justify="flex-start" align="flex-start">
                    <HStack spacing={1}>
                      <Heading size="sm">{userReserve.variableBorrows}</Heading>
                      <Text size="sm" as="sub">
                        {userReserve.reserve.symbol}
                      </Text>
                    </HStack>
                    <HStack spacing={1}>
                      <Heading size="sm">
                        {formatBalance(userReserve.variableBorrowsUSD, "USD")}
                      </Heading>
                      <Text size="sm" as="sub">
                        USD
                      </Text>
                    </HStack>
                  </VStack>
                </Td>
                <Td>
                  <VStack spacing={0} justify="flex-start" align="flex-start">
                    <HStack spacing={1}>
                      <Heading size="sm">{userReserve.totalBorrows}</Heading>
                      <Text size="sm" as="sub">
                        {userReserve.reserve.symbol}
                      </Text>
                    </HStack>
                    <HStack spacing={1}>
                      <Heading size="sm">
                        {formatBalance(userReserve.totalBorrowsUSD, "USD")}
                      </Heading>
                      <Text size="sm" as="sub">
                        USD
                      </Text>
                    </HStack>
                  </VStack>
                </Td>
              </Tr>
            ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};
