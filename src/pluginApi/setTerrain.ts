export function setTile(server, client) {
    server.terrain.tiles.forEach((tile) => {
        console.log(tile.x, tile.y, tile.collides ? 1 : 0, tile.depth, 0, 0, tile.terrain)
    });
    server.terrain.tiles.push({
        "x": 253,
        "y": 454,
        "collides": true,
        "depth": 3,
        "terrain": "platformer_grass",
    });
    
    client.send("TERRAIN_CHANGES", server.terrain.getInitialMessage());
}