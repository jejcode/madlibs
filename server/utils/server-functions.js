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

const pullPromptsFromText = (text) => {
  let madString = text;
  let madArray = madString.split(" ");
  let blankArray = [];
  let tempString = "";
  // iterate through the madArray of strings to find words/phrases surrounded by {}
  for (let i = 0; i < madArray.length; i++) {
    let thisString = madArray[i];
    const pIndex = thisString.indexOf("}");
    // if thisString begins with '{' capture all characters until '}'
    if (thisString.indexOf("{") > -1) {
      if (pIndex > -1) {
        // create key value pair based off what the index will be in blankArray
        blankArray.push(thisString.slice(thisString.indexOf("{") + 1, pIndex));
      } else {
        // if there are multiple words between curlies, use a temp string to hold text
        // until a closed curly shows up in another string
        tempString += thisString.slice(1);
      }
    } else if (tempString) {
      // if tempString has characters in it, add this text to the string until a closed curly is found.
      if (pIndex > -1) {
        // a closed curly is found. Complete the temp string, add temp string to blank array,
        // and reset temp string to false
        tempString += " " + thisString.slice(0, pIndex);
        blankArray.push(tempString);
        tempString = "";
      } else {
        // no curly found, so keep adding to temp string
        tempString += ` ${thisString}`;
      }
    }
  }
  console.log(blankArray)
  return blankArray
}
export {distributePrompts,generateRoomCode, pullPromptsFromText}