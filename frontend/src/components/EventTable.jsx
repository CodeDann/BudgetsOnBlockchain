import React, { useEffect, useState } from 'react';
import { BeatLoader } from 'react-spinners';
import baseUrl from '../config';
import TableComponent from './jsonTable.jsx';

function EventTable({ contractAddress, eventType }) {
  const [events, setEvents] = useState([]);
  // event source state 0 = not connected, 1 = connected, 2 = error
  const [eventSourceState , setSourceState] = useState(0);
  const [eventSource, setEventSource] = useState(null);

  if (eventSource) {
    eventSource.onmessage = (event) => {
      console.log(event.data);
      if( event.data == "error" ){
        setSourceState(2);
      } else if ( event.data == "connected" ){
        setSourceState(1);
      } else {
        const newEvent = JSON.parse(event.data);
        setEvents((prevEvents) => [...prevEvents, newEvent]);
      }
    };
  }

  useEffect(() => {
    let newEventSource;
    if (contractAddress) {
      newEventSource = new EventSource(`${baseUrl}/listenForEvents?type=${eventType}&contractAddress=${contractAddress}`);
      setEventSource(newEventSource);
    }
  
    // Cleanup function
    return () => {
      if (newEventSource) {
        newEventSource.close();
      }
    };
  }, [contractAddress]);



  // });
  switch ( eventSourceState ) {
    case 0:
      return (
        <>
          <h4> Please enter contract address to connect </h4>
        </>
      )
    case 1:
      return (
        <>
          <div className="expense-table">
            <TableComponent data={events} />
          </div>
          <BeatLoader color="#055344" loading={true} size={15} />
        </>
      )
    case 2:
      return (
        <>
          <h4> Error Connecting to server </h4>
          <BeatLoader color="#FF5733" loading={true} size={15} />
        </>
      )
  }
}

export default EventTable;






