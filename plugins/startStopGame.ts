export default function(server) {
    console.log("Start/Stop game plugin loaded!");

    server.onMessage("START_GAME", (client) => {
        if(client.userData?.id !== server.game.intentId) return;
        if(server.state.session.phase !== "preGame") return;

        server.state.session.phase = "game";
        server.state.session.gameSession.phase = "game";
        server.showLoading(1200, () => {
            for(let p of server.players.values()) p.moveToSpawnpoint();
        });
    });

    server.onMessage("END_GAME", (client) => {
        if(client.userData?.id !== server.game.intentId) return;
        if(server.state.session.phase !== "game") return;

        server.state.session.gameSession.phase = "results";
    });

    server.onMessage("RESTORE_MAP_EARLIER", (client) => {
        if(client.userData?.id !== server.game.intentId) return;
        if(server.state.session.phase !== "game" || server.state.session.gameSession.phase !== "results") return;

        server.state.session.phase = "preGame";
        server.showLoading(1200, () => {
            server.broadcast("RESET");
            server.devices.restore();
            for(let p of server.players.values()) p.moveToSpawnpoint();
        });
    });
}