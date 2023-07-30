# Madlibs
collaboration project between Michael Voth and Joel Jacobson

Goal: To create a MERN app where users join a room and complete a MadLibs together.

Features:
* Players can chat with each other during the game.

* Players can add their own MadLibs for others to play.

* Players can make their contributions to the MadLib independent of the pace/submissions
  of other players. For example, if there are four players and 12 blanks, each player will
  contribute 3 words. The game will pause until all players have submitted their words.

* Players can save the completed MadLib if they really like it.

* Players can rank a MadLib so others can find it based on ranking

CRUD Functionality:
Create - users can create a Madlib by copying and pasting text into a form
Read - users will access stored MadLibs
Update - MadLib documents will get updated with rankings and user completions
Delete - users can delete the MadLib creations they don't like

Bonus:
Implement Socket IO for both chat and game functionality
Responsive styling with Bootstrap
Full deployment
