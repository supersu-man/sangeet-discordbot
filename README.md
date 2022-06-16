# Sangeet - Discord Bot

Streams music from Youtube Music.

## Instructions

#### Run on your machine
- Clone the repository 
- Open the project in an IDE (VS Code)
- Create a file called `.env` in project
- Add `token='your_token_here'` line to `.env` file
- Use `npm i` to install all the dependencies
- Use `npm run start` to run the bot


#### Host on Heroku (using actions)
- Fork the repository and clone the fork
- Open the project in an IDE (VS Code)
- Create a file called `.env` in project
- Add `token='your__discord_bot_token_here'` to `.env` file
- Create an app in Heroku
- Add `token` var to your Heroku app with your Discord bot token
- Add `HEROKU_API_KEY`, `HEROKU_APP_NAME` and `HEROKU_EMAIL` in GitHub secrets
- Make a commit and push, GitHub takes care of the rest.

## Commands
- @p song_name
- @pause
- @resume
- @stop
- @leave