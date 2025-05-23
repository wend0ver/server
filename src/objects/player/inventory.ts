import { GameRoom } from "../../colyseus/room";
import { InteractiveSlotsItem, Inventory as InventorySchema, SlotsItem } from "../../colyseus/schema"
import { gadgetOptions, worldOptions } from "../../consts";
import { DropItemOptions } from "../../types";
import Player from "./player";

export default class Inventory {
    player: Player;
    room: GameRoom;
    inventory: InventorySchema;

    constructor(player: Player, room: GameRoom) {
        this.player = player;
        this.room = room;
        this.inventory = new InventorySchema({
            infiniteAmmo: room.mapSettings.infiniteAmmo
        });

        player.onMsg("DROP_ITEM", ({ amount, itemId, interactiveSlotNumber }: DropItemOptions) => {
            if(interactiveSlotNumber) {
                itemId = this.inventory.interactiveSlots.get(interactiveSlotNumber.toString()).itemId;
                if(!this.removeItemSlot(amount, interactiveSlotNumber)) return;
            } else {
                if(!this.removeItemAmount(itemId, amount)) return;
            }

            room.devices.createDevice({
                id: crypto.randomUUID(),
                x: player.player.x,
                y: player.player.y + 30,
                depth: player.player.y + 30,
                layer: "DepthSortedCharactersAndDevices",
                deviceId: "droppedItem",
                options: {
                    amount,
                    itemId,
                    placedByCharacterId: player.id,
                    useCurrentClipCount: false,
                    currentClip: 0,
                    useCurrentDurability: false,
                    currentDurability: 0,
                    decay: 0
                }
            }, true);
        });

        player.onMsg("SET_ACTIVE_INTERACTIVE_ITEM", ({ slotNum }: { slotNum: number })=> {
            this.inventory.activeInteractiveSlot = slotNum;
        });

        room.onMsg("FIRE", (player, args) => {
            let currentItemId = this.inventory.interactiveSlots.get(this.inventory.activeInteractiveSlot.toFixed()).itemId

            let physicsScale = 100;

            room.broadcast("PROJECTILE_CHANGES", {
                added: [
                    {
                        id: crypto.randomUUID(),
                        startTime: Date.now(),
                        endTime: Date.now() + gadgetOptions.gadgets[currentItemId].time,
                        start: {
                            x: (args.x / physicsScale) + Math.cos(args.angle),
                            y: (args.y / physicsScale) + Math.sin(args.angle)
                        },
                        end: {
                            x: (args.x / physicsScale) + Math.cos(args.angle) * gadgetOptions.gadgets[currentItemId].distance,
                            y: (args.y / physicsScale) + Math.sin(args.angle) * gadgetOptions.gadgets[currentItemId].distance
                        },
                        radius: gadgetOptions.gadgets[currentItemId].size,
                        appearance: gadgetOptions.gadgets[currentItemId].appearance,
                        ownerId: player.id,
                        ownerTeamId: player.player.teamId,
                        damage: gadgetOptions.gadgets[currentItemId].damage * player.player.projectiles.damageMultiplier
                    }
                ],
                hit: []
            })
        });
    }

    getItemInfo(id: string) { return worldOptions.itemOptions.find((i: any) => i.id === id) }

    addItem(id: string, amount: number) {        
        let item = this.getItemInfo(id);
        if(!item) return;

        if(this.inventory.slots.has(id)) {
            this.inventory.slots.get(id).amount += amount;
        } else {
            let slot = new SlotsItem({ amount });
            this.inventory.slots.set(id, slot);
        }

        // if it's an interactive item put it in the interactive slots
        if(item.type === "resource") return;
        for(let [slotId, slot] of this.inventory.interactiveSlots) {
            if(slot.itemId) continue;

            let newSlot: InteractiveSlotsItem;
            if(item.type === "weapon") {
                let gadget = gadgetOptions.gadgets[item.id];
                newSlot = new InteractiveSlotsItem(id, gadget);
            } else {
                newSlot = new InteractiveSlotsItem(id);
            }

            this.inventory.interactiveSlots.set(slotId, newSlot);
            break;
        }
    }

    removeItemAmount(id: string, amount: number) {
        if(!this.inventory.slots.has(id)) return;
        if(this.inventory.slots.get(id).amount < amount) return;

        this.inventory.slots.get(id).amount -= amount;
        if(this.inventory.slots.get(id).amount <= 0) {
            this.inventory.slots.delete(id);
        }

        return true;
    }
    
    removeItemSlot(amount: number, slotNum: number) {
        let slot = this.inventory.interactiveSlots.get(slotNum.toString());
        if(slot.count < amount) return;

        if(this.inventory.activeInteractiveSlot === slotNum) {
            this.inventory.activeInteractiveSlot = 0;
        }

        slot.count -= amount;

        if(slot.count <= 0) {
            slot.itemId = "";
            slot.count = 0;
        }
        
        this.removeItemAmount(slot.itemId, amount);

        return true;
    }
}
