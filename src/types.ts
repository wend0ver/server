import RAPIER from "@dimforge/rapier2d-compat";
import { GameRoom } from "./colyseus/room.js";
import Player from "./objects/player.js";

export interface DeviceInfo {
    id: string;
    x: number;
    y: number;
    depth: number;
    layer: string;
    deviceId: string;
    options: Record<string, any>;
}

export interface TileInfo {
    x: number;
    y: number;
    terrain: string;
    depth: number;
    collides: boolean;
    rb: RAPIER.RigidBody;
    collider: RAPIER.Collider;
}

export interface CodeGrid {
    json: any;
    triggerType: string;
    triggerValue?: string;
    createdAt: number;
    updatedAt: number;
}

export interface Wire {
    id: string;
    startDevice: string;
    endDevice: string;
    startConnection: string;
    endConnection: string;
}

type MapStyle = "platformer" | "topDown";

export interface MapInfo {
    mapStyle: MapStyle;
    codeGrids: Record<string, Record<string, CodeGrid>>;
    devices: DeviceInfo[];
    tiles: TileInfo[];
    wires: Wire[];
}

export interface CharacterOptions {
    id: string;
    name: string;
    x: number;
    y: number;
    infiniteAmmo: boolean;
}

export interface SessionOptions {
    gameOwnerId: string;
    mapStyle: string;
}

export interface StateOptions {
    gameCode: string;
    ownerId: string;
    map: MapInfo;
    mapSettings: Record<string, any>;
}

export interface PhysicsState {
    gravity: number;
    velocity: { x: number; y: number; desiredX: number; desiredY: number };
    movement: { direction: string; xVelocity: number; accelerationTicks: number };
    jump: { isJumping: boolean; jumpsLeft: number; jumpCounter: number; jumpTicks: number; xVelocityAtJumpStart: number };
    forces: any[]; // TODO
    grounded: boolean;
    groundedTicks: number;
    lastGroundedAngle: number;
}

export interface PhysicsObjects {
    rb: RAPIER.RigidBody;
    controller: RAPIER.KinematicCharacterController;
    collider: RAPIER.Collider;
}

export interface ColliderInfo {
    rb: RAPIER.RigidBody;
    collider: RAPIER.Collider;
}

export interface BoxCollider {
    x: number;
    y: number;
    width: number;
    height: number;
    angle: number;
    type: "box";
}

export interface CircleCollider {
    x: number;
    y: number;
    r: number;
    type: "circle";
}

export interface CapsuleCollider {
    x: number;
    y: number;
    angle: number;
    r: number;
    height: number;
    type: "capsule";
}

export type ColliderOptions = BoxCollider | CircleCollider | CapsuleCollider;

export interface KitAnswer {
    correct: boolean;
    _id: string;
    text: string;
    textType?: number;
}

export interface KitQuestion {
    _id: string;
    position?: number;
    isActive?: boolean;
    game?: string;
    answers: KitAnswer[];
    type: "text" | "mc";
    text: string;
}

export interface ExperienceCategory {
    _id: string;
    name: string;
    items: ExperienceInfo[];
}

export interface ExperienceInfo {
    _id: string;
    name: string;
    tagline: string;
    imageUrl: string;
    source: "map";
    pageId: string;
    mapId: string;
    isPremiumExperience: boolean;
    tag: string;
    labels: {
        c: string; // complexity
        d: string; // duration
        s: string; // style
    }
}

export interface Block {
    type: string;
    id: string;
    inputs?: Record<string, any>;
    fields?: Record<string, any>;
    next?: { block: Block };
}

export type CustomBlock = (block: Block, room: GameRoom, player: Player, run: (name: string) => any) => any;