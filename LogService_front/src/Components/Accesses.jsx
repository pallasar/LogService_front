import axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import GridElement from './GridElement';

const Accesses = () => {

  const [successAccesses, setSuccessAccesses] = useState(false);
  const [data, setData] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortPropertyName, setSortPropertyName] = useState('');
  const [isSortByDescending, setIsSortByDescending] = useState(true);
  const [addressSearchField, setAddressSearchField] = useState('');
  const [countSearchFieldData, setCountSearchFieldData] = useState(0);

  const refController = useRef(null);

  const handleClick = () => {
    setData([]);
    setSuccessAccesses(!successAccesses);
}

  const fetchData = async () => {

    if (refController.current) {
      refController.current.abort();
    }

    refController.current = new AbortController();

    const countSearchField = countSearchFieldData > 0 
      ? countSearchFieldData 
      : null;

    const requestBody = {
      pageNumber,
      pageSize,
      sortPropertyName,
      isSortByDescending,
      addressSearchField,
      countSearchField,
    };

    try {
      const url = successAccesses 
        ? process.env.REACT_APP_SUCCESSACCESSES_URL
        : process.env.REACT_APP_ALLACCESSES_URL;

      const response = await axios.post(url, requestBody, {
        signal: refController.current.signal,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setData(response.data.logs);
    } catch (error) {
      console.error('Error fetching data:', error);
      setData([]);
    }
  };

  useEffect(() => {
    return () => {
      if (refController.current) {
        refController.current.abort();
      }
    };
  }, []);

    return (
      <div>
        <h1>{successAccesses ? 'Success Accesses' : 'All Accesses'}</h1>
        <button onClick={handleClick}>Switch</button>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div>
                <input
                type="text"
                placeholder="Address"
                value={addressSearchField}
                onChange={(e) => setAddressSearchField(e.target.value)}
                />
                <input
                type="number"
                placeholder="Count"
                value={countSearchFieldData}
                onChange={(e) => setCountSearchFieldData(Number(e.target.value))}
                />
                <button 
                onClick={fetchData}>Search
                </button>
            </div>
            <div>
              <label>
                IsSortByDescending: 
                <input
                  type="checkbox"
                  checked={isSortByDescending}
                  onChange={(e) => setIsSortByDescending(e.target.checked)}
                />
              </label>
              <label>
                SortPropertyName: 
                <input
                  type="text"
                  placeholder=""
                  value={sortPropertyName}
                  onChange={(e) => setSortPropertyName(e.target.value)}
                />
              </label>
            </div>
            <div>
                <label>
                Page Size:
                <input
                    type="number"
                    value={pageSize}
                    onChange={(e) => setPageSize(Number(e.target.value))}
                />
                </label>
                <label>
                Page Number:
                <input
                    type="number"
                    value={pageNumber}
                    onChange={(e) => setPageNumber(Number(e.target.value))}
                />
                </label>
            </div>
            <ul style={{ listStyle: 'none', display: 'grid', gridTemplateColumns: '250px 250px' }}>
              {
                data.length > 0 &&
                (<>
                <li>Address Name: </li>
                <li>Accesses Count: </li>
                </>)
              }
                {Array.isArray(data) ? (
                data.map((item) => (
                    <GridElement 
                    key={item.addressName}
                    addressName={item.addressName}
                    accessesCount={item.accessesCount}
                    />
                ))
                ) : (
                <li>No data available</li>
                )}
            </ul>
        </div>
      </div>
    );
  };

  export default Accesses;