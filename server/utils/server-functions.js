const generateRoomCode = (rooms) => {
  const makeKey = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };
  const newKey = makeKey();
  while (newKey == rooms[newKey]) {
    newKey = makeKey();
  }
  return newKey;
};

const distributePrompts = (prompts, users) => {
  const assignedPrompts = prompts.reduce((acc, prompt, index) => {
    const promptWithIndex = {
      index: index,
      prompt: prompt
    }
    console.log(promptWithIndex)
    console.log('users', users)
    const user = users[index % users.length]
    if(!acc[user]) acc[user] = []
    acc[user].push(promptWithIndex)
    return acc
  }, {})
  return assignedPrompts
}

export {distributePrompts,generateRoomCode}