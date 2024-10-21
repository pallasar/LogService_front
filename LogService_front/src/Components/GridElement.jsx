const GridElement = ({ addressName, accessesCount }) => {

  return (
    <>
      <li style={{ textAlign: 'left'  }}>
        {`${addressName}`}
      </li>
      <li>
        {`${accessesCount}`}
      </li>
    </>
  );
};

export default GridElement;