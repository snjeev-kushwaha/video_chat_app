import React, { useCallback, useEffect, useState } from 'react';
import { useSocket } from '../providers/Socket';
import { usePeer } from '../providers/Peer'
import ReactPlayer from 'react-player'

const RoomPage = () => {
    const socket = useSocket()
    const { peer, createAnswere, createOffer, setRemoteAns, sendStream, remoteStream } = usePeer();
    const [myStream, setMyStream] = useState(null)
    const [remoteEmailId, setRemoteEmailId] = useState()

    const handleNewUserJoined = useCallback(async (data) => {
        const { emailId } = data
        console.log('New user joined room', emailId)
        const offer = await createOffer();
        socket.emit('call-user', { emailId, offer })
        setRemoteEmailId(emailId)
    }, [createOffer, socket])

    const handleIncommingCall = useCallback(async (data) => {
        const { from, offer } = data
        console.log('incomming-call', from, offer)
        const ans = await createAnswere(offer)
        socket.emit('call-accepted', { emailId: from, ans })
        setRemoteEmailId(from)
    }, [createAnswere, socket])

    const handleCallAccepted = useCallback(async (data) => {
        const { ans } = data;
        console.log("call got accepted", ans)
        await setRemoteAns(ans)
    }, [setRemoteAns])

    const getUserMediaStream = useCallback(async (data) => {
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true
        })
        setMyStream(stream)
    }, [])

    const handleNegosiation = useCallback(async () => {
        const localOffer = peer.localDescription;
        socket.emit('call-user', { emailId: remoteEmailId, offer: localOffer })
    }, [peer.localDescription, remoteEmailId, socket])

    useEffect(() => {
        socket.on('user-joined', handleNewUserJoined)
        socket.on('incomming-call', handleIncommingCall)
        socket.on('call-accepted', handleCallAccepted)

        return () => {
            console.log("off")
            socket.off('user-joined', handleNewUserJoined)
            socket.off('incomming-call', handleIncommingCall)
            socket.off('call-accepted', handleCallAccepted)
        }
    }, [handleNewUserJoined, handleIncommingCall, handleCallAccepted, socket])

    useEffect(() => {
        peer.addEventListener('negotiationneeded', handleNegosiation)
        return () => {
            peer.removeEventListener('negotiationneeded', handleNegosiation)
        }
    }, [])

    useEffect(() => {
        getUserMediaStream();
    }, [getUserMediaStream])

    return (
        <div className='room-page-container'>
            <h1>Room page</h1>
            <h4>You are connected to {remoteEmailId}</h4>
            <button onClick={(e) => sendStream(myStream)}>Send My Video</button>
            <ReactPlayer url={myStream} playing muted />
            <ReactPlayer url={remoteStream} playing />
        </div>
    )
}

export default RoomPage