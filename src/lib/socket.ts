import { io, Socket } from "socket.io-client"

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3001"

export interface NFTUpdatedEvent {
  nftId: string
  editionId?: string
  price?: string
  availableQuantity?: number
  version: number
  timestamp: string
}

export interface OrderUpdatedEvent {
  orderId: string
  status: "pending" | "confirmed" | "rejected" | "failed"
  transactionHash?: string
  version: number
  timestamp: string
}

export type ServerToClientEvents = {
  "nft.updated": (data: NFTUpdatedEvent) => void
  "order.updated": (data: OrderUpdatedEvent) => void
}

export type ClientToServerEvents = {
  "subscribe:nft": (nftId: string) => void
  "unsubscribe:nft": (nftId: string) => void
  "subscribe:order": (orderId: string) => void
  "unsubscribe:order": (orderId: string) => void
}

let socket: Socket<ServerToClientEvents, ClientToServerEvents> | null = null

export function getSocket(): Socket<ServerToClientEvents, ClientToServerEvents> | null {
  return socket
}

export function connectSocket(token: string): Socket<ServerToClientEvents, ClientToServerEvents> {
  if (socket?.connected) {
    return socket
  }

  socket = io(SOCKET_URL, {
    auth: { token },
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    timeout: 20000,
    autoConnect: true,
  })

  socket.on("connect", () => {
    console.log("[Socket] Connected:", socket?.id)
  })

  socket.on("disconnect", (reason: string) => {
    console.log("[Socket] Disconnected:", reason)
  })

  socket.on("connect_error", (error: Error) => {
    console.error("[Socket] Connection error:", error.message)
  })

  socket.io.on("reconnect", (attemptNumber: number) => {
    console.log("[Socket] Reconnected after", attemptNumber, "attempts")
  })

  socket.io.on("reconnect_attempt", (attemptNumber: number) => {
    console.log("[Socket] Reconnection attempt:", attemptNumber)
  })

  return socket
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}

export function subscribeToNFT(nftId: string) {
  socket?.emit("subscribe:nft", nftId)
}

export function unsubscribeFromNFT(nftId: string) {
  socket?.emit("unsubscribe:nft", nftId)
}

export function subscribeToOrder(orderId: string) {
  socket?.emit("subscribe:order", orderId)
}

export function unsubscribeFromOrder(orderId: string) {
  socket?.emit("unsubscribe:order", orderId)
}