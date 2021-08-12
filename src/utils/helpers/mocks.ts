import { Address, BigInt, ethereum } from "@graphprotocol/graph-ts";
import { BIGINT_ONE } from "../constants";

let contractAddress = Address.fromString("0x86935F11C86623deC8a25696E1C19a8659CbF95d");

export function getAavegotchiMock(status: BigInt = BigInt.fromI32(3)): ethereum.Value[]  {

    let returnArr: ethereum.Value[] = [
        ethereum.Value.fromUnsignedBigInt(BIGINT_ONE),
        ethereum.Value.fromString("yes"),
        ethereum.Value.fromAddress(contractAddress),
        ethereum.Value.fromUnsignedBigInt(BIGINT_ONE),
        ethereum.Value.fromUnsignedBigInt(status),
        ethereum.Value.fromSignedBigIntArray([BIGINT_ONE,BIGINT_ONE,BIGINT_ONE,BIGINT_ONE,BIGINT_ONE,BIGINT_ONE]),
        ethereum.Value.fromSignedBigIntArray([BIGINT_ONE,BIGINT_ONE,BIGINT_ONE,BIGINT_ONE,BIGINT_ONE,BIGINT_ONE]),
        ethereum.Value.fromUnsignedBigIntArray([BIGINT_ONE,BIGINT_ONE,BIGINT_ONE,BIGINT_ONE,BIGINT_ONE,BIGINT_ONE,BIGINT_ONE,BIGINT_ONE,BIGINT_ONE,BIGINT_ONE,BIGINT_ONE,BIGINT_ONE,BIGINT_ONE,BIGINT_ONE,BIGINT_ONE,BIGINT_ONE]),
        ethereum.Value.fromAddress(contractAddress),
        ethereum.Value.fromAddress(contractAddress),
        ethereum.Value.fromUnsignedBigInt(BIGINT_ONE),
        ethereum.Value.fromUnsignedBigInt(BIGINT_ONE),
        ethereum.Value.fromUnsignedBigInt(BIGINT_ONE),
        ethereum.Value.fromUnsignedBigInt(BIGINT_ONE),
        ethereum.Value.fromUnsignedBigInt(BIGINT_ONE),
        ethereum.Value.fromUnsignedBigInt(BIGINT_ONE),
        ethereum.Value.fromUnsignedBigInt(BIGINT_ONE),
        ethereum.Value.fromUnsignedBigInt(BIGINT_ONE),
        ethereum.Value.fromUnsignedBigInt(BIGINT_ONE),
        ethereum.Value.fromUnsignedBigInt(BIGINT_ONE),
        ethereum.Value.fromUnsignedBigInt(BIGINT_ONE),
        ethereum.Value.fromBoolean(true),
        ethereum.Value.fromUnsignedBigInt(BIGINT_ONE),
        ethereum.Value.fromUnsignedBigInt(BIGINT_ONE),
        ethereum.Value.fromString("yes"),
        ethereum.Value.fromString("yes"),
        ethereum.Value.fromString("yes"),
        ethereum.Value.fromSignedBigIntArray([BIGINT_ONE,BIGINT_ONE,BIGINT_ONE,BIGINT_ONE,BIGINT_ONE,BIGINT_ONE]),
        ethereum.Value.fromBooleanArray([true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true]),
        ethereum.Value.fromUnsignedBigIntArray([BIGINT_ONE,BIGINT_ONE,BIGINT_ONE,BIGINT_ONE,BIGINT_ONE,BIGINT_ONE]),
        ethereum.Value.fromUnsignedBigInt(BIGINT_ONE),
        ethereum.Value.fromUnsignedBigInt(BIGINT_ONE),
        ethereum.Value.fromUnsignedBigInt(BIGINT_ONE),
        ethereum.Value.fromUnsignedBigInt(BIGINT_ONE),
        ethereum.Value.fromUnsignedBigInt(BIGINT_ONE),
        ethereum.Value.fromUnsignedBigInt(BIGINT_ONE),
        ethereum.Value.fromUnsignedBigInt(BIGINT_ONE),
        ethereum.Value.fromUnsignedBigInt(BIGINT_ONE),
        ethereum.Value.fromUnsignedBigInt(BIGINT_ONE),
        ethereum.Value.fromBoolean(true),
        ethereum.Value.fromUnsignedBigInt(BIGINT_ONE),
        ethereum.Value.fromBoolean(true),
        ethereum.Value.fromUnsignedBigInt(BIGINT_ONE),
        ethereum.Value.fromSignedBigInt(BIGINT_ONE),
        ethereum.Value.fromUnsignedBigInt(BIGINT_ONE)
    ];

    let tuppleArray: ethereum.Value[] = [ethereum.Value.fromTuple(returnArr as ethereum.Tuple)]
    return tuppleArray;
}

