import {
  SubstrateExtrinsic,
  SubstrateEvent,
  SubstrateBlock,
} from "@subql/types";
import { TransferEntity } from "../types";
import { Balance } from "@polkadot/types/interfaces";

export async function handleEventTransfer(event: SubstrateEvent): Promise<void> {
  logger.info("handleEventTransfer called!")
  
  logger.info("{new event call" + JSON.stringify(event) + "}")
  if (event.extrinsic === undefined) {
    return
  }
  if (event.block === undefined) {
    return
  }
  const from = event.event.data[0];
  const to = event.event.data[1];
  const amount = event.event.data[2];

  // Create the new transfer entity
  var id = event.block.block.header.number.toNumber() + event.idx
  var blockNumber = event.block.block.header.number.toBigInt();
  var from_ = from.toString();
  var to_ = to.toString();
  var ext = event.extrinsic.extrinsic.hash;
  var success = event.extrinsic.success;
  var Bamount = (amount as Balance).toBigInt();
  var blockTimestamp = event.block.timestamp;
  var BlockTimestamp = BigInt(toTimestamp(blockTimestamp.toUTCString()));
  logger.info(
    "\t\tid: " + id +
    "\n\t\tblockN: " + blockNumber.toString() +
    "\n\t\tFrom: " + from_ +
    "\n\t\tto:" + to_ +
    "\n\t\tAmount: " + Bamount.toString() +
    "\n\t\tExtr: " + ext)
  const transfer = new TransferEntity(
    event.block.block.header.number.toNumber() + "-" + event.idx, // id
    event.block.block.header.number.toBigInt(),
    BlockTimestamp,
    from_,
    to_,
    Bamount);

  transfer.ExtrinsicsHash = ext.toString();
  transfer.Success = success;
  await transfer.save();
}

function toTimestamp(strDate){
   var datum = Date.parse(strDate);
   return datum/1000;
}
