import { InteractiveSlotsItem } from "../colyseus/schema.js";
import fs from 'fs';

let hotBarItems = [];
let weapons = [];

let itemOptions = JSON.parse(fs.readFileSync("./data/worldOptions.json").toString()).itemOptions;
itemOptions.forEach(item => {
    if (item.type !== "resource") {
        hotBarItems.push(item.id);
    }
});

itemOptions.forEach(item => {
    if (item.type == "weapon") {
        weapons.push(item.id);
    }
});

function grantHotbar(server, client, item, num) {
    let player = server.players.get(client);
    
    if (weapons.includes(item)) {
        for (let i = 0; i < num; i++) {

            let slot = 1;
            let foundSlot = false;
    
            player.player.inventory.interactiveSlots.forEach(element => {
                if (element.itemId !== "") {
                    if (!foundSlot) {
                        slot++;
                    }
                } else {
                    foundSlot = true;
                }
            });
    
            const itemToSet = new InteractiveSlotsItem();
            itemToSet.itemId = item;
            itemToSet.waiting = false;
            itemToSet.waitingStartTime = 0;
            itemToSet.waitingEndTime = 0;
            itemToSet.currentClip = 100;
            itemToSet.clipSize = 100;
            itemToSet.durability = 0;
            itemToSet.count = 1;
    
            player.player.inventory.interactiveSlots.set(slot, itemToSet);
        }
    } else {
        let slot = 1;
        let foundSlot = false;

        let preCount = 0;

        player.player.inventory.interactiveSlots.forEach(element => {
            if (element.itemId !== "" && element.itemId !== item) {
                if (!foundSlot) {
                    slot++;
                }
            } else {
                foundSlot = true;
                preCount = element.count;
            }
        });

        const itemToSet = new InteractiveSlotsItem();
        itemToSet.itemId = item;
        itemToSet.waiting = false;
        itemToSet.waitingStartTime = 0;
        itemToSet.waitingEndTime = 0;
        itemToSet.currentClip = 100;
        itemToSet.clipSize = 100;
        itemToSet.durability = 0;
        itemToSet.count = num + preCount;

        player.player.inventory.interactiveSlots.set(slot, itemToSet);
    }
}

export function grantItem(server, client, item, num) {
    if (hotBarItems.includes(item)) {
        grantHotbar(server, client, item, num);
        return;
    }    
    let player = server.players.get(client);
    player.inventory.addItem(item, num);
}