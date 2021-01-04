# nSpired Server
## Create goals. Meet them. Share your wins.

---

**nSpired** was created to offer a platform specifically to meeting goals independently, while connecting and sharing with others who want to achieve the same.  

Science has proven time and time again that by surrounding yourself with others who have the same goals as you, you:  
- are held accountable to a new standard  
- can motivate others with your progress  
- can gain insight from others who are further along in their progress  
- may discover new goals that you would like to meet along the way

 --- 

### Tech stack  
This server-side app was created with:    
<img align="left" alt="Visual Studio Code" width="26px" src="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/visual-studio-code/visual-studio-code.png" />
<img align="left" alt="JavaScript" src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" />
<img align="left" alt="NodeJS" src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" />
<img align="left" alt="ExpressJS" src="https://img.shields.io/badge/Express.js-404D59?style=for-the-badge" />
<img align="left" alt="Heroku" src="https://img.shields.io/badge/Heroku-430098?style=for-the-badge&logo=heroku&logoColor=white" />
<img align="left" alt="Git" width="26px" src="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/git/git.png" />
<img align="left" alt="GitHub" width="26px" src="https://raw.githubusercontent.com/github/explore/78df643247d429f6cc873026c0622819ad797942/topics/github/github.png" />  

<br/>

---

### Endpoints Tree
**App🔻**     

➖**MiddleWare Used🔻**   
➖➖*Auth-Router w JWT*  
➖➖*Check for Goal Function*
➖➖*Advice Prep Function*  
➖➖*Check for User Info*

➖**Routes🔻**    
➖**BASE URL: /api**   

➖➖*/win-wall*
➖➖➖*/win-wall/mini*    
(GET)

➖➖*/advice/:goalId* 
(GET, POST, DELETE)

➖➖*/goals*  
➖➖➖*/goals/:goalId*  
(GET, POST, DELETE, PATCH)

➖➖*/upvotes/:goalId*    
(GET, POST, DELETE)

➖➖*/auth/login*  
➖➖*/auth/delete*  
➖➖*/auth/register*   
(POST, DELETE)
  
---  
  
  
## Available Scripts  
  
In the project directory, you can run:  
  
`npm start`  
  
The page will reload if you make edits.\
You will also see any lint errors in the console.

`npm test`

Launches the test runner in the interactive watch mode.

`npm run dev`

Runs the app through a development server.

`npm run migrate`

Migrate tables in local database

`npm run migrate:test`

Migrate tables in local test database

`heroku create` to create remote server (will need heroku account - see this link for info https://devcenter.heroku.com/categories/command-line)    
`npm run deploy`  to:
  
- Run NPM audit  
- Migrate tables in production server
- Push latest commit to Heroku main branch of created app
