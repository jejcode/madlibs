const generateRoomCode = () => {
  const makeKey = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };
  const newKey = makeKey();
  while (newKey == rooms[newKey]) {
    newKey = makeKey();
  }
  return newKey;
};

export {generateRoomCode}