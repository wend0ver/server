import express from './express.js';
import { Server } from "colyseus";
import { BunWebSockets } from "@colyseus/bun-websockets";
import { GameRoom } from './room.js';
import Matchmaker from './matchmaker.js';

const server = new Server({ transport: new BunWebSockets() });

server.define("MapRoom", GameRoom);
server.listen(5824);

Matchmaker.init();

// add fallbacks for unimplemented routes
express.get("*", (req, res) => {
    console.log("Client requested missing route with GET:", req.url);
    res.status(501).send("Not implemented");
});
express.post("*", (req, res) => {
    console.log("Client requested missing route with POST:", req.url);
    res.status(501).send("Not implemented");
});