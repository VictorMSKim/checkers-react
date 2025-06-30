# Checkers

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

It was built for a technical challenge for Qulture Rocks internship position

It's a game of checkers

Make sure you have npm installed.

Enjoy! :D

## To run

First you should clone the repository with 

```
git clone https://github.com/VictorMSKim/qulture_challenge.git
```

Then, go to the project directory with:

```
cd qulture_challenge
```

At the root directory, run:

```
npm install
```

After it finishes, run:

```
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## To play

The game will show whose turn it is currently.

Normal pieces are limited to only moving forward.

If the pieces reach the opposing end of the board, they will turn into king pieces which can go backwards as well.

To move a piece, click on the desired piece, the possible paths will light up, then just click on the destination square that you wish to move your piece into.

If an enemy can be jumped over, that will be the only move allowed for the chosen piece.

If no moves are available anymore to a given player, the player loses the game. 

The winner will be announced on the text line right above the board when a piece is clicked.

Have fun! :)
