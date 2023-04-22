import React, { useState, useEffect, useCallback } from 'react';
import { useSocket } from '../providers/Socket';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
    const navigate = useNavigate()
    const socket = useSocket();
    const [email, setEmail] = useState();
    const [roomId, setRoomId] = useState();

    const handleRoomJoined = useCallback(({ roomId }) => {
        navigate(`/room/${roomId}`)
    }, [navigate])

    useEffect(() => {
        socket.on('joined-room', handleRoomJoined)
        return () => {
            socket.off('joined-room', handleRoomJoined)
        }
    }, [handleRoomJoined, socket])

    const handleJoinRoom = (e) => {
        e.preventDefault()
        socket.emit('join-room', { emailId: email, roomId })
    }

    return (
        <div className='p-5'>
            <div className="container">
                <div className="row row-cols-1 row-cols-lg-3 g-2 g-lg-3">
                    <div className="col">
                        <div className="p-3"></div>
                    </div>
                    <div className="col">
                        <div className="p-3 border" style={{ borderRadius: "20px" }}>
                            <form>
                                <div className="mb-3">
                                    <input type="email" className="form-control rounded-pill" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder='Enter Email here' value={email} onChange={(e) => setEmail(e.target.value)} />
                                </div>
                                <div className="mb-3">
                                    <input type="text" className="form-control rounded-pill" id="exampleInputText1" placeholder='Enter Room Code' value={roomId} onChange={(e) => setRoomId(e.target.value)} />
                                </div>
                                <button type="submit" onClick={handleJoinRoom} className="btn btn-primary">Enter Room</button>
                            </form>
                        </div>
                    </div>
                    <div className="col">
                        <div className="p-3"></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HomePage