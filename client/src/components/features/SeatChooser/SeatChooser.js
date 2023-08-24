import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Progress, Alert } from 'reactstrap';
import { getSeats, loadSeats, getRequests, loadSeatsRequest } from '../../../redux/seatsRedux';
import './SeatChooser.scss';
import io from 'socket.io-client';

const getSocketConnectionUrl = () => {
  if (process.env.NODE_ENV === 'production') {
    // Use default address for production environment
    return window.location.origin;
  } else {
    // Use localhost:8000 for development environment
    return 'http://localhost:8000';
  }
};

const SeatChooser = ({ chosenDay, chosenSeat, updateSeat }) => {
  const dispatch = useDispatch();
  const seats = useSelector(getSeats);
  const requests = useSelector(getRequests);

  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Establishing the socket connection
    const socketConnectionUrl = getSocketConnectionUrl();
    const newSocket = io(socketConnectionUrl);

    setSocket(newSocket);

    // Socket.IO event listener for 'connection'
    newSocket.on('connect', () => {
      console.log('New socket connected:', newSocket.id); // Log the socket ID

      // Event listener for updated seats data
      newSocket.on('seatsUpdated', handleSeatsUpdated);
    });

    // Callback for handling updated seats data
    const handleSeatsUpdated = (updatedSeats) => {
      console.log('Updated seats:', updatedSeats);
      dispatch(loadSeats(updatedSeats));
    };
   
    // Clean up the socket connection when the component unmounts
    return () => {
      newSocket.disconnect();
      newSocket.off('seatsUpdated', handleSeatsUpdated);
    };
  }, [dispatch, chosenDay]);

  // Function to check if a seat is already taken
  const isTaken = (seatId) => {
    return (seats.some(item => (item.seat === seatId && item.day === chosenDay)));
  }

  // Function to render seat buttons based on their availability
  const prepareSeat = (seatId) => {
    if(seatId === chosenSeat) return <Button key={seatId} className="seats__seat" color="primary">{seatId}</Button>;
    else if(isTaken(seatId)) return <Button key={seatId} className="seats__seat" disabled color="secondary">{seatId}</Button>;
    else return <Button key={seatId} color="primary" className="seats__seat" outline onClick={(e) => updateSeat(e, seatId)}>{seatId}</Button>;
  }

  // Counting taken and free seats
  const takenSeats = seats.filter(seat => seat.day === chosenDay).length;
  const freeSeats = 50 - takenSeats;

  return (
    <div>
      <h3>Pick a seat</h3>
      <small id="pickHelp" className="form-text text-muted ml-2"><Button color="secondary" /> – seat is already taken</small>
      <small id="pickHelpTwo" className="form-text text-muted ml-2 mb-4"><Button outline color="primary" /> – it's empty</small>
      { (requests['LOAD_SEATS'] && requests['LOAD_SEATS'].success) && <div className="seats">{[...Array(50)].map((x, i) => prepareSeat(i+1) )}</div>}
      { (requests['LOAD_SEATS'] && requests['LOAD_SEATS'].pending) && <Progress animated color="primary" value={50} /> }
      { (requests['LOAD_SEATS'] && requests['LOAD_SEATS'].error) && <Alert color="warning">Couldn't load seats...</Alert> }
      <p>Free seats: {freeSeats}/50</p>
    </div>
  )
}

export default SeatChooser;