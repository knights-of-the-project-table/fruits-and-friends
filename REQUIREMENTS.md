# Software Requirements

## Vision

Fruits and Friends is a fun game between two players that takes elements of pattern matching and strategy and combines them with cute animal friends and tasty fruits!

The goal of the game is to achieve one of the following victory conditions:

- Line up your tokens in a horizontal, vertical or diagonal row.
- Arrange a 2 x 2 square of 4 tokens.
- Block your opponent so that they have no more legal moves.

Compete with your friends! This game alleviates boredom and provides users with the easy dopamine that only comes from video games. With simple to learn rules and random board states at the start of each match, Fruits and Friends is a replayable and strategic game!

## Scope

### IN

- Fruits and Friends will provide two users with an interactive game with a delightful art style.
- Fruits and Friends will keep a running tally of player win count using local storage.
- Fruits and Friends will retain game state on page close or refresh, with the ability to reset a game at any time.
- Fruits and Friends will randomize the tiles for each game, so that the games never play out quite the same.
- Fruits and Friends will provide easy to access rules in an expandable sidebar.

### OUT

- Fruits and Friends will not support two players playing in the same game on different devices
- Fruits and Friends will be developed for desktop PCs or laptops, not mobile devices.

### Minimum Viable Product

- A game between two players at the same device that has at a minimum:
  
  - Randomized tile placement for each game
  - Tile art assets developed by the team
  - Running score that persists between page loads and refresh
  - User interaction will be handled with click events on game tiles which are HTML `button` elements
  - Game state that persists between page load and refresh
  - Codebase that consistently tracks board state against any win condition

### Stretch Goals

- An option to play against a computer, i.e., a team developed AI for Player 2's moves
- Animations and audio for improved aesthetics and user engagement
- Additional options for player tokens (color/image/etc)

## Functional Requirements

1. A user can play a game against a second user
2. A user can easily see the rules in an expandable sidebar
3. A user is shown with some visual indication what tiles they are allowed to place their token on
4. A user can leave the page in the middle of a game and come back to it at the same game state
5. A user can see their running win count versus the second user
6. A user can restart the game with a button at any point.

### Data Flow

1. A user loads the page and a splash screen appears with the game title
2. After a click prompt, the game begins

    1. The game 4x4 game grid is randomly populated with 16 tiles, each containing 2 of 8 unique elements (4 friends, 4 fruits).
    2. Player 1 can place a token on any tile that is on the outer border.
        - The elements on the tile where the token was placed is tracked by the app for Player 2's next turn.
    3. Player 2 then places a token on any tile that contains an element from the previous move
    4. Player 1 can then place a token on any tile with fruits or friends that match the tile of Player 2's placement, so long as no token already exists there.
    5. This process repeats, and the game continues until either player has:
        - Lined up their moves in a horizontal, vertical or diagonal row.
        - Arranged a 2 x 2 square of 4 moves.
        - Block the opponent so that they have no more legal moves.
        - The game ends in a tie if the Player 2 can place their last token and there are no more tiles to place.
3. The players can reset the game at any time with a reset button below the board.
4. Running scores are tallied and maintained on page load/refresh
