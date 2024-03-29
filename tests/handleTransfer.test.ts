import {
    Address,
    BigInt,
    ethereum,
    store,
} from "@graphprotocol/graph-ts";
import {
    describe,
    test,
    beforeAll,
    newMockEvent,
    assert,
    createMockedFunction,
} from "matchstick-as/assembly/index";
import { Transfer } from "../generated/FAKEGotchisNFTDiamond/IERC721";
import {
    FakeGotchiNFTToken,
    MetadataActionLog,
    FakeGotchiHolder,
    User,
} from "../generated/schema";
import {
    ADDRESS_DEAD,
    ADDRESS_ZERO,
    BIGINT_ONE,
    BIGINT_ZERO,
} from "../src/utils/constants";
import { handleTransfer } from "../src/mappings/fakeGotchisNFT";

export function createTransferEvent(
    from: string,
    to: string,
    tokenId: i32
): Transfer {
    let mockEvent = newMockEvent();
    let event = new Transfer(
        mockEvent.address,
        mockEvent.logIndex,
        mockEvent.transactionLogIndex,
        mockEvent.logType,
        mockEvent.block,
        mockEvent.transaction,
        mockEvent.parameters,
        null
    );
    event.parameters = new Array();
    let fromAddress = new ethereum.EventParam(
        "_from",
        ethereum.Value.fromAddress(Address.fromString(from))
    );
    let toAddress = new ethereum.EventParam(
        "_to",
        ethereum.Value.fromAddress(Address.fromString(to))
    );
    let tokenIdNumber = new ethereum.EventParam(
        "_tokenId",
        ethereum.Value.fromI32(tokenId)
    );

    event.parameters.push(fromAddress);
    event.parameters.push(toAddress);
    event.parameters.push(tokenIdNumber);

    return event;
}

const sender = "0xacb0ba5da1101f204356420f87e1f1047ac65c8c";
const receiver = "0x46a3a41bd932244dd08186e4c19f1a7e48cbcdf4";
const tokenId = 1;
const event = createTransferEvent(sender, receiver, tokenId);

describe("handleTransfer", () => {
    beforeAll(() => {
        const log = new MetadataActionLog("1");
        log.emitter = sender;
        log.timestamp = BIGINT_ZERO;
        log.editions = 1;

        const tokenEntityId = event.transaction
            .to!.toHex()
            .concat("/")
            .concat(BIGINT_ONE.toHex());
        const token = new FakeGotchiNFTToken(tokenEntityId);
        token.metadata = "1";
        token.contract = ADDRESS_DEAD;
        token.identifier = BIGINT_ONE;
        token.owner = ADDRESS_DEAD.toHexString();
        token.approval = ADDRESS_ZERO.toHexString();
        token.editions = 0;

        const senderAccount = new User(sender);
        senderAccount.totalFakeGotchisOwnedArray = "{}";
        senderAccount.totalUniqueFakeGotchisOwnedArray = "{}";
        senderAccount.totalUniqueFakeGotchisOwned = 0;
        senderAccount.currentUniqueFakeGotchisOwned = 0;
        senderAccount.currentUniqueFakeGotchisOwnedArray = "{}";
        senderAccount.fakeGotchis = "{}";
        senderAccount.amountFakeGotchis = 0;
        senderAccount.gotchisLentOut = new Array<BigInt>();
        senderAccount.gotchisBorrowed = new Array<BigInt>();

        const holder = new FakeGotchiHolder(
            "0x46a3a41bd932244dd08186e4c19f1a7e48cbcdf4-1"
        );
        holder.amount = 0;
        holder.holder = receiver;
        holder.fakeGotchiStats = "1";

        store.set("MetadataActionLog", "1", log);
        store.set("FakeGotchiNFTToken", tokenEntityId, token);
        store.set("User", sender, senderAccount);
        // store.set("FakeGotchiStatistic", "1", fakeGotchiStats);
        store.set(
            "FakeGotchiHolder",
            "0x46a3a41bd932244dd08186e4c19f1a7e48cbcdf4-1",
            holder
        );

        createMockedFunction(
            event.transaction.to!,
            "name",
            "name():(string)"
        ).returns([ethereum.Value.fromString("Ghost")]);

        createMockedFunction(
            event.transaction.to!,
            "symbol",
            "symbol():(string)"
        ).returns([ethereum.Value.fromString("GHST")]);

        createMockedFunction(
            event.transaction.to!,
            "tokenURI",
            "tokenURI(uint256):(string)"
        )
            .withArgs([ethereum.Value.fromUnsignedBigInt(BIGINT_ONE)])
            .returns([ethereum.Value.fromString("https://app.aavegotchi.com")]);

        createMockedFunction(
            event.transaction.to!,
            "tokenURI",
            "tokenURI(uint256):(string)"
        )
            .withArgs([
                ethereum.Value.fromUnsignedBigInt(BIGINT_ONE.plus(BIGINT_ONE)),
            ])
            .returns([ethereum.Value.fromString("https://app.aavegotchi.com")]);
    });

    test("it should update total, nft and holder stats if tx is mint", () => {
        const event = createTransferEvent(
            ADDRESS_ZERO.toHexString(),
            receiver,
            tokenId
        );
        handleTransfer(event);

        // total stats
        assert.fieldEquals(
            "Statistic",
            "0",
            "totalEditionsCirculating",
            "1"
        );
        assert.fieldEquals("Statistic", "0", "totalEditionsMinted", "1");
        assert.fieldEquals("Statistic", "0", "totalNFTs", "1");
        assert.fieldEquals("Statistic", "0", "burnedNFTs", "0");
        assert.fieldEquals("Statistic", "0", "totalFakeGotchiOwners", "1");

        // nft stats
        assert.fieldEquals("FakeGotchiStatistic", "1", "burned", "0");
        assert.fieldEquals("FakeGotchiStatistic", "1", "amountHolder", "1");
        assert.fieldEquals("FakeGotchiStatistic", "1", "totalSupply", "1");
        assert.fieldEquals("FakeGotchiStatistic", "1", "metadata", "1");
        assert.fieldEquals("FakeGotchiStatistic", "1", "tokenIds", "[1]");

        // NFT Holder Stats
        let idSender = receiver + "-1";
        assert.fieldEquals("FakeGotchiHolder", idSender, "holder", receiver);
        assert.fieldEquals("FakeGotchiHolder", idSender, "amount", "1");
        assert.fieldEquals("FakeGotchiHolder", idSender, "fakeGotchiStats", "1");

        // account stats
        assert.fieldEquals("User", receiver, "totalUniqueFakeGotchisOwned", "1");
        assert.fieldEquals(
            "User",
            receiver,
            "currentUniqueFakeGotchisOwned",
            "1"
        );
    });

    test("it should update total, nft and holder stats if tx is transfer", () => {
        const event = createTransferEvent(receiver, sender, tokenId);
        handleTransfer(event);

        // Total Stats
        assert.fieldEquals(
            "Statistic",
            "0",
            "totalEditionsCirculating",
            "1"
        );
        assert.fieldEquals("Statistic", "0", "totalEditionsMinted", "1");
        assert.fieldEquals("Statistic", "0", "totalNFTs", "1");
        assert.fieldEquals("Statistic", "0", "burnedNFTs", "0");
        assert.fieldEquals("Statistic", "0", "totalFakeGotchiOwners", "1");

        // NFT Stats
        assert.fieldEquals("FakeGotchiStatistic", "1", "burned", "0");
        assert.fieldEquals("FakeGotchiStatistic", "1", "amountHolder", "1");
        assert.fieldEquals("FakeGotchiStatistic", "1", "totalSupply", "1");
        assert.fieldEquals("FakeGotchiStatistic", "1", "metadata", "1");
        assert.fieldEquals("FakeGotchiStatistic", "1", "tokenIds", "[1]");

        // NFT Holder Stats
        let idSender = receiver + "-1";
        assert.fieldEquals("FakeGotchiHolder", idSender, "holder", receiver);
        assert.fieldEquals("FakeGotchiHolder", idSender, "amount", "0");
        assert.fieldEquals("FakeGotchiHolder", idSender, "fakeGotchiStats", "1");

        let idReceiver = sender + "-1";
        assert.fieldEquals("FakeGotchiHolder", idReceiver, "holder", sender);
        assert.fieldEquals("FakeGotchiHolder", idReceiver, "amount", "1");
        assert.fieldEquals("FakeGotchiHolder", idReceiver, "fakeGotchiStats", "1");

        // User
        assert.fieldEquals("User", receiver, "totalUniqueFakeGotchisOwned", "1");
        assert.fieldEquals(
            "User",
            receiver,
            "currentUniqueFakeGotchisOwned",
            "0"
        );

        assert.fieldEquals("User", sender, "totalUniqueFakeGotchisOwned", "1");
        assert.fieldEquals("User", sender, "currentUniqueFakeGotchisOwned", "1");
    });

    test("it should update total, nft and holder stats if tx is burn", () => {
        const event = createTransferEvent(
            sender,
            ADDRESS_ZERO.toHexString(),
            tokenId
        );
        handleTransfer(event);

        // Total Stats
        assert.fieldEquals(
            "Statistic",
            "0",
            "totalEditionsCirculating",
            "0"
        );
        assert.fieldEquals("Statistic", "0", "totalEditionsMinted", "1");
        assert.fieldEquals("Statistic", "0", "totalNFTs", "0");
        assert.fieldEquals("Statistic", "0", "burnedNFTs", "1");
        assert.fieldEquals("Statistic", "0", "totalFakeGotchiOwners", "0");

        // NFT Stats
        assert.fieldEquals("FakeGotchiStatistic", "1", "burned", "1");
        assert.fieldEquals("FakeGotchiStatistic", "1", "amountHolder", "0");
        assert.fieldEquals("FakeGotchiStatistic", "1", "totalSupply", "0");
        assert.fieldEquals("FakeGotchiStatistic", "1", "metadata", "1");
        assert.fieldEquals("FakeGotchiStatistic", "1", "tokenIds", "[]");

        // NFT Holder Stats
        let idSender = sender + "-1";
        assert.fieldEquals("FakeGotchiHolder", idSender, "holder", sender);
        assert.fieldEquals("FakeGotchiHolder", idSender, "amount", "0");
        assert.fieldEquals("FakeGotchiHolder", idSender, "fakeGotchiStats", "1");

        // User
        assert.fieldEquals("User", sender, "totalUniqueFakeGotchisOwned", "1");
        assert.fieldEquals("User", sender, "currentUniqueFakeGotchisOwned", "0");
    });
});
