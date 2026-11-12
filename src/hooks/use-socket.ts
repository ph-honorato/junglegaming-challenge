import { useEffect, useRef, useCallback, useState } from "react"
import { connectSocket, disconnectSocket, getSocket, type NFTUpdatedEvent, type OrderUpdatedEvent } from "@/lib/socket"

export function useSocket(token?: string) {
  const socketRef = useRef<ReturnType<typeof getSocket> | null>(null)
  const subscriptionsRef = useRef<Set<string>>(new Set())
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    if (token) {
      const socket = connectSocket(token)
      socketRef.current = socket

      socket.on("connect", () => setIsConnected(true))
      socket.on("disconnect", () => setIsConnected(false))

      socket.io.on("reconnect", () => {
        subscriptionsRef.current.forEach((sub) => {
          if (sub.startsWith("nft:")) {
            socket.emit("subscribe:nft", sub.replace("nft:", ""))
          } else if (sub.startsWith("order:")) {
            socket.emit("subscribe:order", sub.replace("order:", ""))
          }
        })
      })
    } else {
      if (socketRef.current) {
        disconnectSocket()
        socketRef.current = null
        setIsConnected(false)
      }
    }

    return () => {
      // Don't disconnect here - let the token state handle it
    }
  }, [token])

  const subscribeNFT = useCallback((nftId: string) => {
    const socket = getSocket()
    if (socket?.connected) {
      socket.emit("subscribe:nft", nftId)
      subscriptionsRef.current.add(`nft:${nftId}`)
    }
  }, [])

  const unsubscribeNFT = useCallback((nftId: string) => {
    const socket = getSocket()
    if (socket?.connected) {
      socket.emit("unsubscribe:nft", nftId)
      subscriptionsRef.current.delete(`nft:${nftId}`)
    }
  }, [])

  const subscribeOrder = useCallback((orderId: string) => {
    const socket = getSocket()
    if (socket?.connected) {
      socket.emit("subscribe:order", orderId)
      subscriptionsRef.current.add(`order:${orderId}`)
    }
  }, [])

  const unsubscribeOrder = useCallback((orderId: string) => {
    const socket = getSocket()
    if (socket?.connected) {
      socket.emit("unsubscribe:order", orderId)
      subscriptionsRef.current.delete(`order:${orderId}`)
    }
  }, [])

  const onNFTUpdated = useCallback((callback: (data: NFTUpdatedEvent) => void) => {
    const socket = getSocket()
    if (socket) {
      socket.on("nft.updated", callback)
      return () => socket.off("nft.updated", callback)
    }
    return () => {}
  }, [])

  const onOrderUpdated = useCallback((callback: (data: OrderUpdatedEvent) => void) => {
    const socket = getSocket()
    if (socket) {
      socket.on("order.updated", callback)
      return () => socket.off("order.updated", callback)
    }
    return () => {}
  }, [])

  return {
    socket: socketRef.current,
    isConnected,
    subscribeNFT,
    unsubscribeNFT,
    subscribeOrder,
    unsubscribeOrder,
    onNFTUpdated,
    onOrderUpdated,
  }
}