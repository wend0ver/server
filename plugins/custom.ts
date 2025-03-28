import * as invintory from "../src/pluginApi/grantItem.js"; 
import * as tiles from "../src/pluginApi/setTerrain.js"; 

export default function(server) {
    server.onMessage("item", (client) => {
        invintory.grantItem(server, client, "terrain_dynamic_dirt", 2);
        //invintory.grantItem(server, client, "blaster_common", 2);
    });

    // ignore this for now
    server.onMessage("tile", (client) => {
        tiles.setTile(server, client);
    });
}