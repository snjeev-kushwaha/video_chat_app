import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';

const HomePage = () => {
  const navigate = useNavigate();
  const [value, setValue] = useState();

  const handeJoinRoom = useCallback(() => {
    navigate(`/room/${value}`)
  }, [navigate, value])

  return (
    <div className='p-5' style={{ textAlign: "center" }}>

      <div className="container px-4">
        <div className="row gx-5">
          <div className="col">
            <div className="p-2"></div>
          </div>
          <div className="col">
            <div className="p-8"><Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Control type='text' value={value} onChange={(e) => setValue(e.target.value)} placeholder='Enter Room Code' />
            </Form.Group>
              <Button type='primary' size='md' onClick={handeJoinRoom}>Join</Button></div>
          </div>
          <div className="col">
            <div className="p-2"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage