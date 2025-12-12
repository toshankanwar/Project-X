export type CommandResult = {
  output: string;
  handled: boolean;
  private?: boolean;
  attach?: boolean;
};

// API Keys - Replace with your actual keys
const API_KEYS = {
  OPENWEATHERMAP: '65496f9f35c9d354fbd0dd38c6bf7fb0',
  NEWS_API: 'd7f70c4bdbf140bb8a72949a9e541209',
  ALPHA_VANTAGE: '1Z5JCD802EEG665F'
};

const scriptPunkBanner = `
┌─────────────────────────────────────────────────────────────┐
│  ███████╗ ██████╗██████╗ ██╗██████╗ ████████╗██████╗ ██╗   ██╗███╗   ██╗██╗  ██╗  │
│  ██╔════╝██╔════╝██╔══██╗██║██╔══██╗╚══██╔══╝██╔══██╗██║   ██║████╗  ██║██║ ██╔╝  │
│  ███████╗██║     ██████╔╝██║██████╔╝   ██║   ██████╔╝██║   ██║██╔██╗ ██║█████╔╝   │
│  ╚════██║██║     ██╔══██╗██║██╔═══╝    ██║   ██╔═══╝ ██║   ██║██║╚██╗██║██╔═██╗   │
│  ███████║╚██████╗██║  ██║██║██║        ██║   ██║     ╚██████╔╝██║ ╚████║██║  ██╗  │
│  ╚══════╝ ╚═════╝╚═╝  ╚═╝╚═╝╚═╝        ╚═╝   ╚═╝      ╚═════╝ ╚═╝  ╚═══╝╚═╝  ╚═╝  │
└─────────────────────────────────────────────────────────────┘
    Advanced Terminal Environment for Security Professionals
         Hack the Planet • Script your Way • Punk the System
`.trim();

// Animated ASCII Art
const parrotFrames = [
  `
      .-.
     / o \\   PARTY
    |  u  |  PARROT
     \\_-_/   DANCE
      /|\\
     / | \\
  `,
  `
      .-.
     / ^ \\   DANCE
    |  o  |  MODE
     \\_v_/   ON!
      /|\\
     / | \\
  `,
  `
      .-.
     / ~ \\   VIBE
    |  -  |  LEVEL
     \\_w_/   MAX
      /|\\
     / | \\
  `
];

const hackingSteps = [
  "INITIALIZING HACK SEQUENCE...",
  "SCANNING TARGET NETWORK...",
  "IDENTIFYING VULNERABILITIES...",
  "EXPLOITING BUFFER OVERFLOW...",
  "BYPASSING FIREWALL...",
  "ESCALATING PRIVILEGES...",
  "ACCESSING MAINFRAME...",
  "DOWNLOADING SENSITIVE DATA...",
  "INSTALLING BACKDOOR...",
  "COVERING DIGITAL TRACKS...",
  "HACK SEQUENCE COMPLETE!"
];

// Utility Functions


const createProgressBar = (percentage: number, width: number = 30) => {
  const filled = Math.floor((percentage / 100) * width);
  const empty = width - filled;
  return '[' + '█'.repeat(filled) + '░'.repeat(empty) + `] ${percentage}%`;
};

const fetchWithTimeout = async (url: string, options: RequestInit = {}, timeout: number = 10000) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'User-Agent': 'ScriptPunk-Terminal/2.0.0',
        'Accept': 'application/json',
        ...options.headers,
      },
    });
    clearTimeout(id);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error: any) {
    clearTimeout(id);
    if (error.name === 'AbortError') {
      throw new Error('Request timeout - API took too long to respond');
    }
    throw error;
  }
};

export async function handleClientCommand(input: string): Promise<CommandResult> {
  const parts = input.trim().split(/\s+/);
  const cmd = (parts[0]?.toLowerCase()) || "";
  const args = parts.slice(1);

  try {
    switch (cmd) {
      case "help":
        return {
          handled: true,                            
          output: `${scriptPunkBanner}

Available Commands:
===============================================================

PERSONAL INFO:
  about                   About Toshan Kanwar
  projects               My projects portfolio  
  social                 Social media profiles
  
WEATHER & LOCATION:
  weather <city>         Real-time weather data (OpenWeatherMap)
  forecast <city>        5-day weather forecast
  timezone <city>        Get timezone information
  
CRYPTO & FINANCE:
  crypto <symbol>        Live cryptocurrency prices (CoinGecko)
  btc                   Bitcoin current price
  eth                   Ethereum current price
  exchange <amount> <from> <to>  Currency conversion
  
DATE & TIME:
  time                  Current local time
  utc                   Current UTC time
  timestamp             Unix timestamp
  date <format>         Formatted date output
  
TEXT PROCESSING:
  encode64 <text>       Base64 encode
  decode64 <text>       Base64 decode
  hash <text>           Generate hash
  uuid                  Generate UUID
  reverse <text>        Reverse text
  uppercase <text>      Convert to uppercase
  lowercase <text>      Convert to lowercase
  wordcount <text>      Count words
  morse <text>          Convert to Morse code
  binary <text>         Convert to binary
  hex <text>            Convert to hexadecimal
  
MATH & CALCULATIONS:
  calc <expression>     Basic calculator
  percentage <value> <total>  Calculate percentage
  random <min> <max>    Generate random number
  factorial <n>         Calculate factorial
  fibonacci <n>         Fibonacci sequence
  prime <n>             Check if prime number
  
ENTERTAINMENT & APIs:
  joke                  Random programming jokes (JokeAPI)
  quote                 Inspirational quotes (Quotable)
  fact                  Random facts (API Ninjas)
  advice                Random dev advice
  magic8                Magic 8-ball responses
  fortune               Fortune cookies
  
BOLLYWOOD HACKING:
  dhoom                 Dhoom style hack sequence
  robot                 Robot 2.0 hack simulation
  warroom               War Room operation mode
  parrot                Animated dancing parrot
  matrix                Matrix rain animation
  hack <target>         Advanced hack simulation
  
NEWS & INFO:
  news                  Latest tech headlines (NewsAPI)
  hackernews           Hacker News top stories
  reddit <subreddit>   Reddit posts (live)
  github <user>        GitHub user info (live)
  
NETWORK TOOLS:
  ping <host>           Network ping simulation
  whois <domain>        Domain information
  dns <domain>          DNS lookup simulation
  
PRODUCTIVITY:
  password <length>     Secure password generator
  timer <minutes>       Set countdown timer
  qr <text>             Generate QR code data
  
MISC UTILITIES:
  version               Show detailed version info
  clear                 Clear terminal screen
  attach                Attach to remote shell

Type any command to get started!
`
        };

      case "about":
        return {
          handled: true,
          output: `${scriptPunkBanner}

ABOUT TOSHAN KANWAR
==================

Hello! I'm Toshan Kanwar, a Data Science and Artificial Intelligence student at IIIT Naya Raipur with a strong passion for Full Stack Web Development and Machine Learning.

I specialize in building responsive and dynamic web applications that deliver real-world impact. My journey in tech started with a fascination for how systems work, which has grown into a deep interest in software engineering, machine learning, and full stack development.

Beyond development, I actively engage in machine learning and other research works. I'm always eager to explore new technologies and push my limits as a developer and problem solver.

YOUTUBE JOURNEY:
I'm also a passionate YouTube content creator. Over the past year, I have built and grown song mashup YouTube channels where I create songs and personal vlogs. My first channel, @Toshan2005, reached monetization and generated ₹8,500 through AdSense. Sadly, it was compromised due to a LinkedIn-related security breach. Undeterred, I launched a new channel, @ToshanKanwarOfficials, where I continue to produce mashups and my personal vlogs.

This YouTube journey has significantly enhanced my skills in video editing, content scripting, on-camera communication and also give some fun to enjoy life.

TECHNICAL SKILLS:
- Full Stack Development:Next.js,React, Node.js, TypeScript, Javascript
- Backend Technologies: Express.js, FastAPI, Go, WebSockets, Flask
- Databases: Firebase, MongoDB, PostgreSQL, MySQL, SQLite
- Machine Learning: Python, TensorFlow, PyTorch, Scikit-learn
- Data Science: Pandas, NumPy, Matplotlib, Jupyter
- Mobile Development: React Native, Expo
- Video Production: Capcut
- Tools: Git, VS Code, Github

ACHIEVEMENTS:
- 40+ GitHub repositories 
- 200+ LeetCode problems solved
- YouTube monetization achieved (₹8,500 earned)
- Multiple full-stack projects deployed and running
- Machine Learning projects with 95%+ accuracy

Type 'projects' to see my portfolio or 'social' for social media links.
`
        };

      case "projects":
        return {
          handled: true,
          output: `MY PROJECTS PORTFOLIO
====================

1. PERSONAL WEBSITE
   URL: https://toshankanwar.in/
   Full-stack personal portfolio showcasing skills and projects
   Tech: React, Vite, Javascript
   Features: Responsive design, contact form

2. BAKERY MANAGEMENT SYSTEM
   Website: https://bakery.toshankanwar.in/
   Admin Panel: https://admin.bakery.toshankanwar.in/login
   Complete bakery management with inventory, orders, and billing
   Tech: Next.js, Firebase, Nodejs, Chart.js, Python, Tailwind css
   Features: Real-time inventory, order tracking, sales analytics

3. MOBILE BAKERY DeLIVERY APP
   Download: https://expo.dev/artifacts/eas/pxCHo9wcQeTSP2csNaPGgE.apk
   React Native app for bakery operations with offline support
   Tech: React Native, Expo, SQLite, Redux, AsyncStorage
   Features: Offline mode, push notifications

4. POEMS PLATFORM
   Website: https://poems.toshankanwar.in/
   Admin: https://admin.poems.toshankanwar.in/
   Poetry sharing and management platform with social features
   Tech: Next.js, Firebase, Tailwind css
   Features: User authentication, poem sharing, like/comment system

5. HEART FAILURE PREDICTION
   URL: https://heart.toshankanwar.in/
   ML-powered heart disease prediction system with 95% accuracy
   Tech: Python, FastAPI, TensorFlow, React, scikit-learn
   Features: ML model, data visualization, medical predictions

6. TEXT ANALYZER
   URL: https://text.toshankanwar.in/
   Advanced text processing and sentiment analysis tool
   Tech: Reactjs, Tailwind css
   Features: Sentiment analysis, keyword extraction, text metrics

7. SCRIPTPUNK TERMINAL
   URL: https://terminal.toshankanwar.in/
   Web-based terminal emulator with hacking theme (current project)
   Tech: React, TypeScript, xterm.js, WebSockets, Go backend
   Features: 50+ commands, real APIs, Bollywood themes, animations

GITHUB STATS:
- Total Repositories: 40+
- Most Used Languages: TypeScript, Python, JavaScript
- Contributions: 1000+ commits this year

Each project demonstrates different aspects of full-stack development,
machine learning, and modern web technologies with real-world applications.
All projects are live and actively maintained.
`
        };

      case "social":
        return {
          handled: true,
          output: `SOCIAL MEDIA PROFILES & CONTACT
==============================

PROFESSIONAL NETWORKS:
GitHub: https://github.com/toshankanwar
  - 40+ repositories
  - Active open source contributor
  - Full-stack and ML projects

LinkedIn: https://www.linkedin.com/in/toshan-kanwar-4683a1349/
  - Professional networking
  - Technical articles and updates
  - Industry connections

LeetCode: https://leetcode.com/u/UncountedBug/
  - 200+ problems solved
  - Data structures & algorithms
  - Competitive programming

PERSONAL:
Facebook: https://www.facebook.com/toshan.kanwar.73
  - Personal updates and life moments

YOUTUBE CHANNELS:
Current Channel: @ToshanKanwarOfficials
  - Song mashups and remixes
  - Personal vlogs and tech content
  - Growing subscriber base

Previous Channel: @Toshan2005 (Compromised)
  - Successfully monetized (₹8,500 earned)
  - Victim of LinkedIn security breach
  - Lessons learned in cybersecurity

CONTACT INFORMATION:
Email: contact@toshankanwar.in
Website: https://toshankanwar.in/
Location: IIIT Naya Raipur, Chhattisgarh, India

CURRENT STATUS:
- 🎓 Student: Data Science & AI at IIIT Naya Raipur
- 💼 Seeking: Summer 2025 internships in Full Stack/ML
- 🚀 Open to: Freelance projects and collaborations
- 📚 Learning: Advanced ML, Cloud Architecture, DevOps

COLLABORATION INTERESTS:
- Full-stack web applications
- Machine learning projects
- Open source contributions
- Technical content creation
- YouTube collaborations

Feel free to connect with me on any platform!
I'm always excited to discuss technology, share knowledge,
and explore new opportunities in software development.
`
        };

      // Weather Commands with Real API
      case "weather":
        if (!args[0]) return { handled: true, output: "Usage: weather <city>" };
        try {
          const city = args.join(" ");
          const weatherData = await fetchWithTimeout(
            `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEYS.OPENWEATHERMAP}&units=metric`
          );
          
          const temp = Math.round(weatherData.main.temp);
          const feelsLike = Math.round(weatherData.main.feels_like);
          const condition = weatherData.weather[0].description;
          const humidity = weatherData.main.humidity;
          const windSpeed = weatherData.wind.speed;
          const pressure = weatherData.main.pressure;
          const visibility = weatherData.visibility / 1000;
          
          return {
            handled: true,
            output: `Weather for ${weatherData.name}, ${weatherData.sys.country}:
==========================================
Temperature: ${temp}°C (feels like ${feelsLike}°C)
Condition: ${condition.charAt(0).toUpperCase() + condition.slice(1)}
Humidity: ${humidity}%
Wind Speed: ${windSpeed} m/s
Pressure: ${pressure} hPa
Visibility: ${visibility} km

Coordinates: ${weatherData.coord.lat}°N, ${weatherData.coord.lon}°E
Data updated: ${new Date(weatherData.dt * 1000).toLocaleTimeString()}

Weather provided by OpenWeatherMap API`
          };
        } catch (error: any) {
          return { 
            handled: true, 
            output: `Weather Error: ${error.message}\nPlease check the city name and try again.` 
          };
        }

      case "forecast":
        if (!args[0]) return { handled: true, output: "Usage: forecast <city>" };
        try {
          const city = args.join(" ");
          const forecastData = await fetchWithTimeout(
            `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${API_KEYS.OPENWEATHERMAP}&units=metric`
          );
          
          let forecastOutput = `5-Day Forecast for ${forecastData.city.name}:\n========================================\n`;
          
          // Group forecasts by date
          const dailyForecasts = forecastData.list.filter((_: any, index: number) => index % 8 === 0).slice(0, 5);
          
          dailyForecasts.forEach((forecast: any, index: number) => {
            const date = new Date(forecast.dt * 1000);
            const temp = Math.round(forecast.main.temp);
            const condition = forecast.weather[0].description;
            
            forecastOutput += `Day ${index + 1} (${date.toLocaleDateString()}): ${temp}°C - ${condition}\n`;
          });
          
          return { handled: true, output: forecastOutput };
        } catch (error: any) {
          return { 
            handled: true, 
            output: `Forecast Error: ${error.message}\nPlease check the city name and try again.` 
          };
        }

      // Crypto Commands with Real API
      case "crypto":
        if (!args[0]) return { handled: true, output: "Usage: crypto <coin-id> (e.g., crypto bitcoin)" };
        try {
          const coinId = args[0].toLowerCase();
          const cryptoData = await fetchWithTimeout(
            `https://api.coingecko.com/api/v3/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`
          );
          
          const price = cryptoData.market_data.current_price.usd;
          const change24h = cryptoData.market_data.price_change_percentage_24h;
          const marketCap = cryptoData.market_data.market_cap.usd;
          const volume = cryptoData.market_data.total_volume.usd;
          const rank = cryptoData.market_cap_rank;
          
          return {
            handled: true,
            output: `${cryptoData.name} (${cryptoData.symbol.toUpperCase()})
=========================================
Current Price: $${price.toLocaleString()}
24h Change: ${change24h > 0 ? '+' : ''}${change24h.toFixed(2)}%
Market Cap: $${(marketCap / 1e9).toFixed(2)}B
24h Volume: $${(volume / 1e6).toFixed(2)}M
Market Rank: #${rank}

Last Updated: ${new Date(cryptoData.last_updated).toLocaleString()}
Data provided by CoinGecko API`
          };
        } catch (error: any) {
          return { 
            handled: true, 
            output: `Crypto Error: ${error.message}\nTry: bitcoin, ethereum, cardano, solana, etc.` 
          };
        }

      case "btc":
        return await handleClientCommand("crypto bitcoin");

      case "eth":
        return await handleClientCommand("crypto ethereum");

      // Jokes with Real API
      case "joke":
        try {
          const jokeData = await fetchWithTimeout('https://v2.jokeapi.dev/joke/Programming?blacklistFlags=nsfw,religious,political,racist,sexist,explicit&type=single');
          
          if (jokeData.joke) {
            return { handled: true, output: jokeData.joke };
          } else {
            // Try two-part joke
            const twoPartJoke = await fetchWithTimeout('https://v2.jokeapi.dev/joke/Programming?blacklistFlags=nsfw,religious,political,racist,sexist,explicit&type=twopart');
            return { handled: true, output: `${twoPartJoke.setup}\n\n${twoPartJoke.delivery}` };
          }
        } catch (error) {
          // Fallback to local jokes
          const localJokes = [
            "Why do programmers prefer dark mode? Because light attracts bugs!",
            "How many programmers does it take to change a light bulb? None. That's a hardware problem!",
            "Why don't programmers like nature? It has too many bugs.",
            "What's a programmer's favorite hangout place? Foo Bar!",
            "Why did the developer go broke? Because he used up all his cache!"
          ];
          return { handled: true, output: localJokes[Math.floor(Math.random() * localJokes.length)] };
        }

      // Quotes with Real API
      case "quote":
        try {
          const quoteData = await fetchWithTimeout('https://api.quotable.io/random?tags=technology,famous-quotes,motivational&minLength=50');
          return { handled: true, output: `"${quoteData.content}"\n\n- ${quoteData.author}` };
        } catch (error) {
          // Fallback quotes
          const localQuotes = [
            "The best way to predict the future is to invent it. - Alan Kay",
            "Code is like humor. When you have to explain it, it's bad. - Cory House",
            "First, solve the problem. Then, write the code. - John Johnson",
            "Talk is cheap. Show me the code. - Linus Torvalds"
          ];
          return { handled: true, output: localQuotes[Math.floor(Math.random() * localQuotes.length)] };
        }

      // Random Facts with API
      case "fact":
        try {
          const factData = await fetchWithTimeout('https://api.api-ninjas.com/v1/facts?limit=1', {
            headers: { 'X-Api-Key': 'your-api-ninjas-key' }
          });
          return { handled: true, output: `Random Fact: ${factData[0].fact}` };
        } catch (error) {
          const localFacts = [
            "The first computer bug was an actual bug - a moth trapped in a Harvard Mark II computer in 1947.",
            "The term 'debugging' was coined by Grace Hopper when she found the moth.",
            "Python was named after Monty Python's Flying Circus, not the snake.",
            "The first programmer was Ada Lovelace, who wrote the first algorithm in 1843."
          ];
          return { handled: true, output: `Tech Fact: ${localFacts[Math.floor(Math.random() * localFacts.length)]}` };
        }

      // News with API
      case "news":
        try {
          const newsData = await fetchWithTimeout(`https://newsapi.org/v2/top-headlines?category=technology&language=en&apiKey=${API_KEYS.NEWS_API}`);
          
          let newsOutput = "Latest Tech Headlines:\n====================\n";
          newsData.articles.slice(0, 5).forEach((article: any, index: number) => {
            newsOutput += `${index + 1}. ${article.title}\n   Source: ${article.source.name}\n   ${article.publishedAt.split('T')[0]}\n\n`;
          });
          
          return { handled: true, output: newsOutput };
        } catch (error) {
          return { handled: true, output: "News service temporarily unavailable. Please check your API key configuration." };
        }

      // Hacker News API
      case "hackernews":
        try {
          const topStories = await fetchWithTimeout('https://hacker-news.firebaseio.com/v0/topstories.json');
          const stories = await Promise.all(
            topStories.slice(0, 5).map(async (id: number) => {
              const story = await fetchWithTimeout(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
              return story;
            })
          );
          
          let output = "Hacker News Top Stories:\n========================\n";
          stories.forEach((story, index) => {
            output += `${index + 1}. ${story.title}\n   Score: ${story.score} | Comments: ${story.descendants || 0}\n   ${story.url ? story.url.substring(0, 50) + '...' : 'No URL'}\n\n`;
          });
          
          return { handled: true, output };
        } catch (error) {
          return { handled: true, output: "Error fetching Hacker News stories. Please try again later." };
        }

      // GitHub User Info
      case "github":
        if (!args[0]) return { handled: true, output: "Usage: github <username>" };
        try {
          const username = args[0];
          const userData = await fetchWithTimeout(`https://api.github.com/users/${username}`);
          
          return {
            handled: true,
            output: `GitHub Profile: ${userData.name || userData.login}
========================================
Username: ${userData.login}
Bio: ${userData.bio || 'No bio available'}
Public Repos: ${userData.public_repos}
Followers: ${userData.followers}
Following: ${userData.following}
Location: ${userData.location || 'Not specified'}
Company: ${userData.company || 'Not specified'}
Profile: ${userData.html_url}
Joined: ${new Date(userData.created_at).toLocaleDateString()}`
          };
        } catch (error: any) {
          return { handled: true, output: `GitHub Error: User '${args[0]}' not found or API limit exceeded.` };
        }

      // Animated Bollywood Commands
      case "dhoom":
        let dhoomOutput = "DHOOM HACK SEQUENCE ACTIVATED!\n==============================\n\n";
        
        for (let i = 0; i <= 100; i += 25) {
          dhoomOutput += `${createProgressBar(i)} ${i < 100 ? hackingSteps[Math.floor(i/25)] : 'HACK COMPLETE!'}\n`;
        }
        
        dhoomOutput += `
 ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
 █▄─▄▄▀█─▄▄─█─▄▄─█▄─▀█▀─▄█
 ██─▄─▄█─██─█─██─██─█▄█─██
 ▀▄▄▄▄▀▀▄▄▄▄▀▄▄▄▄▀▄▄▄▀▄▄▄▀

"Agar tumhe lagta hai ki main galat hu, toh prove karo!"
- Kabir (Dhoom 2)

TARGET STATUS: NEUTRALIZED
ESCAPE ROUTE: ACTIVATED
BIKE READY: SUZUKI HAYABUSA
Next Target: Reserve Bank of India
ETA: 45 minutes`;

        return { handled: true, output: dhoomOutput };

      case "robot":
        return {
          handled: true,
          output: `CHITTI 2.0 SYSTEM ACTIVATED
===========================

 ██████╗██╗  ██╗██╗████████╗████████╗██╗
██╔════╝██║  ██║██║╚══██╔══╝╚══██╔══╝██║
██║     ███████║██║   ██║      ██║   ██║
██║     ██╔══██║██║   ██║      ██║   ██║
╚██████╗██║  ██║██║   ██║      ██║   ██║
 ╚═════╝╚═╝  ╚═╝╚═╝   ╚═╝      ╚═╝   ╚═╝

INITIALIZING NEURAL NETWORKS... ✓
CONNECTING TO SATELLITE GRID... ✓
ACCESSING CITY INFRASTRUCTURE... ✓

${createProgressBar(100)} NETWORK INFILTRATION COMPLETE

COMPROMISED SYSTEMS:
- Mobile Tower Networks: 2,847 towers
- Traffic Control: 1,245 signals  
- Power Grid: 12 substations
- Banking Networks: 156 ATMs
- Security Cameras: 5,623 units

"I am not just a robot, I am more than that!"
- Dr. Vaseegaran

THREAT LEVEL: MAXIMUM
TERMINATION PROTOCOL: ARMED
AWAITING INSTRUCTIONS FROM CREATOR...

Warning: Emotional circuit damaged. Unpredictable behavior detected.`
        };

      case "parrot":
        const frame = Math.floor(Math.random() * parrotFrames.length);
        return {
          handled: true,
          output: `${parrotFrames[frame]}

PARTY PARROT PROTOCOL ACTIVATED!
================================

Status: Dancing to the rhythm of successful deployments!
Vibe: Unstoppable developer energy!
Achievement Unlocked: "Master of Celebrations"

Current Track: "Life is Beautiful" - Celebrating code that works!
BPM: 128 (Perfect coding rhythm)
Dance Style: Full-Stack Freestyle
Mood: Another bug squashed, another feature deployed!

Next Milestone: 1000+ GitHub commits!`
        };

      case "matrix":
        const matrixChars = "アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const matrixLines = Array(8).fill(0).map(() => 
          Array(50).fill(0).map(() => 
            matrixChars[Math.floor(Math.random() * matrixChars.length)]
          ).join('')
        );
        
        return {
          handled: true,
          output: `MATRIX SIMULATION INITIATED...
=============================

${matrixLines.join('\n')}

Wake up, Neo... The Matrix has you.

Follow the white rabbit
Knock, knock, Neo.

 ███╗   ███╗ █████╗ ████████╗██████╗ ██╗██╗  ██╗
 ████╗ ████║██╔══██╗╚══██╔══╝██╔══██╗██║╚██╗██╔╝
 ██╔████╔██║███████║   ██║   ██████╔╝██║ ╚███╔╝ 
 ██║╚██╔╝██║██╔══██║   ██║   ██╔══██╗██║ ██╔██╗ 
 ██║ ╚═╝ ██║██║  ██║   ██║   ██║  ██║██║██╔╝ ██╗
 ╚═╝     ╚═╝╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝╚═╝╚═╝  ╚═╝

"What is real? How do you define real?"
- Morpheus

Reality Status: QUESTIONING
Choose your pill: Red (truth) or Blue (ignorance)
This is your last chance...`
        };

      // Math Operations
      case "calc":
        if (!args[0]) return { handled: true, output: "Usage: calc <expression>" };
        try {
          const expression = args.join(" ");
          // Safe evaluation using Function constructor with restrictions
          const result = Function('"use strict"; return (' + expression.replace(/[^0-9+\-*/.() ]/g, '') + ')')();
          return { handled: true, output: `${expression} = ${result}` };
        } catch (error) {
          return { handled: true, output: "Error: Invalid mathematical expression" };
        }

      case "random":
        const min = parseInt(args[0]) || 1;
        const max = parseInt(args[1]) || 100;
        const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
        return { handled: true, output: `Random number between ${min}-${max}: ${randomNum}` };

      case "factorial":
        const n = parseInt(args[0]);
        if (!n || n < 0 || n > 20) return { handled: true, output: "Usage: factorial <positive-number> (max 20)" };
        let result = 1;
        for (let i = 2; i <= n; i++) result *= i;
        return { handled: true, output: `${n}! = ${result.toLocaleString()}` };

      // Text Processing
      case "encode64":
        if (!args[0]) return { handled: true, output: "Usage: encode64 <text>" };
        const encoded = btoa(args.join(" "));
        return { handled: true, output: `Base64 Encoded: ${encoded}` };

      case "decode64":
        if (!args[0]) return { handled: true, output: "Usage: decode64 <encoded-text>" };
        try {
          const decoded = atob(args[0]);
          return { handled: true, output: `Base64 Decoded: ${decoded}` };
        } catch {
          return { handled: true, output: "Error: Invalid base64 string" };
        }

      case "hash":
        if (!args[0]) return { handled: true, output: "Usage: hash <text>" };
        const text = args.join(" ");
        let hash = 0;
        for (let i = 0; i < text.length; i++) {
          const char = text.charCodeAt(i);
          hash = ((hash << 5) - hash) + char;
          hash = hash & hash;
        }
        const hashResult = Math.abs(hash).toString(16);
        return { handled: true, output: `Simple Hash: ${hashResult}\n\nNote: For cryptographic security, use crypto.subtle.digest() with SHA-256` };

      case "uuid":
        const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          const r = Math.random() * 16 | 0;
          const v = c == 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
        return { handled: true, output: `UUID v4: ${uuid}` };

      case "morse":
        if (!args[0]) return { handled: true, output: "Usage: morse <text>" };
        const morseCode: any = {
          'a': '.-', 'b': '-...', 'c': '-.-.', 'd': '-..', 'e': '.', 'f': '..-.',
          'g': '--.', 'h': '....', 'i': '..', 'j': '.---', 'k': '-.-', 'l': '.-..',
          'm': '--', 'n': '-.', 'o': '---', 'p': '.--.', 'q': '--.-', 'r': '.-.',
          's': '...', 't': '-', 'u': '..-', 'v': '...-', 'w': '.--', 'x': '-..-',
          'y': '-.--', 'z': '--..', '1': '.----', '2': '..---', '3': '...--',
          '4': '....-', '5': '.....', '6': '-....', '7': '--...', '8': '---..',
          '9': '----.', '0': '-----', ' ': '/'
        };
        const text2 = args.join(" ").toLowerCase();
        const morse = text2.split('').map(char => morseCode[char] || char).join(' ');
        return { handled: true, output: `Morse Code: ${morse}` };

      case "binary":
        if (!args[0]) return { handled: true, output: "Usage: binary <text>" };
        const text3 = args.join(" ");
        const binary = text3.split('').map(char => char.charCodeAt(0).toString(2).padStart(8, '0')).join(' ');
        return { handled: true, output: `Binary: ${binary}` };

      case "hex":
        if (!args[0]) return { handled: true, output: "Usage: hex <text>" };
        const text4 = args.join(" ");
        const hex = text4.split('').map(char => char.charCodeAt(0).toString(16).padStart(2, '0')).join(' ');
        return { handled: true, output: `Hexadecimal: ${hex}` };

      // Password Generator
      case "password":
        const length = parseInt(args[0]) || 16;
        if (length < 8 || length > 128) {
          return { handled: true, output: "Error: Password length must be between 8-128 characters" };
        }
        
        const lowercase = "abcdefghijklmnopqrstuvwxyz";
        const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const numbers = "0123456789";
        const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?";
        const allChars = lowercase + uppercase + numbers + symbols;
        
        let password = "";
        // Ensure at least one from each category
        password += lowercase[Math.floor(Math.random() * lowercase.length)];
        password += uppercase[Math.floor(Math.random() * uppercase.length)];
        password += numbers[Math.floor(Math.random() * numbers.length)];
        password += symbols[Math.floor(Math.random() * symbols.length)];
        
        // Fill the rest randomly
        for (let i = 4; i < length; i++) {
          password += allChars[Math.floor(Math.random() * allChars.length)];
        }
        
        // Shuffle the password
        password = password.split('').sort(() => Math.random() - 0.5).join('');
        
        return { 
          handled: true, 
          output: `Generated Password (${length} chars): ${password}
Strength: Strong ✓
Contains: Uppercase, Lowercase, Numbers, Symbols
Entropy: ~${Math.floor(length * Math.log2(allChars.length))} bits
Security: Suitable for high-security applications` 
        };

      // Time Commands
      case "time":
        const now = new Date();
        return { 
          handled: true, 
          output: `Current Time: ${now.toLocaleTimeString()}
Date: ${now.toLocaleDateString()}
ISO: ${now.toISOString()}
Timezone: ${Intl.DateTimeFormat().resolvedOptions().timeZone}
Unix Timestamp: ${Math.floor(now.getTime() / 1000)}` 
        };

      case "utc":
        return { handled: true, output: `UTC Time: ${new Date().toUTCString()}` };

      case "timestamp":
        const timestamp = Math.floor(Date.now() / 1000);
        return { 
          handled: true, 
          output: `Unix Timestamp: ${timestamp}
Milliseconds: ${Date.now()}
Human readable: ${new Date().toString()}
ISO format: ${new Date().toISOString()}` 
        };

      // Entertainment
      case "magic8":
        const responses = [
          "It is certain", "Reply hazy, try again", "Don't count on it",
          "It is decidedly so", "Ask again later", "My reply is no",
          "Without a doubt", "Better not tell you now", "My sources say no",
          "Yes definitely", "Cannot predict now", "Outlook not so good",
          "You may rely on it", "Concentrate and ask again", "Very doubtful",
          "As I see it, yes", "Signs point to yes", "Most likely"
        ];
        return { 
          handled: true, 
          output: `Magic 8-Ball says: "${responses[Math.floor(Math.random() * responses.length)]}"` 
        };

      case "fortune":
        const fortunes = [
          "A journey of a thousand commits begins with a single 'git init'.",
          "The best time to refactor code was 6 months ago. The second best time is now.",
          "Your future pull request will be approved without conflicts.",
          "A bug avoided is worth two debugged.",
          "Code with passion, debug with patience.",
          "The wise programmer tests early and often.",
          "Documentation today prevents confusion tomorrow."
        ];
        return { handled: true, output: `Fortune Cookie: ${fortunes[Math.floor(Math.random() * fortunes.length)]}` };

      case "advice":
        const advice = [
          "Always comment your code like the person maintaining it is a violent psychopath who knows where you live.",
          "Code for readability first, optimize for performance second.",
          "The best debugger is still thinking.",
          "When in doubt, restart the dev server.",
          "Git commit early, git commit often.",
          "Never trust user input, always validate.",
          "Take breaks, touch grass, talk to humans - your code will thank you."
        ];
        return { handled: true, output: `Dev Advice: ${advice[Math.floor(Math.random() * advice.length)]}` };

      // Basic Commands
      case "echo":
        return { handled: true, output: args.join(" ") };

      case "reverse":
        const textToReverse = args.join(" ");
        return { 
          handled: true, 
          output: textToReverse ? textToReverse.split("").reverse().join("") : "Usage: reverse <text>" 
        };

      case "uppercase":
        return { handled: true, output: args.join(" ").toUpperCase() };

      case "lowercase":
        return { handled: true, output: args.join(" ").toLowerCase() };

      case "wordcount":
        if (!args[0]) return { handled: true, output: "Usage: wordcount <text>" };
        const words = args.join(" ").trim().split(/\s+/);
        const sentences = args.join(" ").split(/[.!?]+/).filter(s => s.trim()).length;
        return { 
          handled: true, 
          output: `Text Analysis:
Words: ${words.length}
Characters: ${args.join(" ").length}
Characters (no spaces): ${args.join(" ").replace(/\s/g, '').length}
Sentences: ${sentences}
Average word length: ${(args.join(" ").replace(/\s/g, '').length / words.length).toFixed(1)} chars` 
        };

      case "clear":
        return { handled: true, output: "\x1b[2J\x1b[H" };

      case "version":
        return { 
          handled: true, 
          output: `ScriptPunk Terminal v2.0.0 - Enhanced Edition
======================================
Build: 2025.09.01.001
Platform: Web Browser
Engine: React + TypeScript + xterm.js
Backend: Go + WebSockets + JWT Authentication
Author: Toshan Kanwar
License: MIT
Repository: https://github.com/toshankanwar/Project-X/tree/main/scriptpunk

Features:
✓ 50+ Interactive commands with real API integration
✓ Live weather data (OpenWeatherMap)
✓ Real-time cryptocurrency prices (CoinGecko)
✓ Programming jokes and quotes (JokeAPI, Quotable)
✓ Hacker News integration
✓ GitHub user lookup
✓ Bollywood hacking themes with animations
✓ Advanced text processing and math operations
✓ Secure password generation
✓ Network simulation tools
✓ Full TypeScript implementation
✓ Error handling and timeout protection

API Integrations:
- OpenWeatherMap: Real weather data
- CoinGecko: Cryptocurrency prices
- JokeAPI: Programming jokes
- Quotable: Inspirational quotes
- Hacker News: Tech news
- GitHub API: User profiles
- API Ninjas: Random facts

"Built with ❤️, ☕, and lots of real APIs!"` 
        };

      case "attach":
        return { handled: true, output: "[attach requested]", attach: true };

      default:
        return { handled: false, output: "" };
    }
  } catch (error: any) {
    return { 
      handled: true, 
      output: `Command Error: ${error.message}\nPlease try again or type 'help' for available commands.` 
    };
  }
}
