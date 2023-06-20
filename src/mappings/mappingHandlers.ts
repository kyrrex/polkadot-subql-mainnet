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
  logger.info(
    "\t\tid: " + id +
    "\n\t\t blockN: " + blockNumber.toString() +
    "\n\t\tFrom: " + from_ +
    "\n\t\tto:" + to_ +
    "\n\t\tAmount: " + Bamount.toString() +
    "\n\t\tExtr: " + ext)
  const transfer = new TransferEntity(event.block.block.header.number.toNumber() + "-" + event.idx);
  transfer.Amount = Bamount;
  transfer.BlockNumber = blockNumber;
  transfer.From = from_;
  transfer.To = to_;
  transfer.ExtrinsicsHash = ext.toString();
  transfer.Success = success;
  transfer.BlockTimestamp = BigInt(toTimestamp(blockTimestamp.toUTCString()));
  await transfer.save();
}

function toTimestamp(strDate){
   var datum = Date.parse(strDate);
   return datum/1000;
}
