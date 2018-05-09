## Social Media Data Based Personality Analyzer
### What This App Can Do
This app gives a quantitative description of a twitter user's personality based on his/er recent tweets.

### Motivation
We still vividly remember the heartbroken news in February 15, that is, a 19-year-old teenager killed 17 of his schoolmates and teachers and injured dozens at Marjory Stoneman Douglas High School in Parkland, Florida.  

The incident did not happen without any sign. Nikolas Cruz, the shooter, had explicitly expressed his violent inclination on social media at one time or another. Furthermore, instead of being shocked, many of his schoolmates said they were not surprised for what Nikolas did. One of them even told local radio station WFOR “Everyone predicted it”.    

Although so many peers of the shooter have detected his abnormal behavior, none of them warned the
local police department of the shooter’s possible violence. One reason could be that they just felt that way, but they didn’t have a substantial evidence to corroborate their feelings until the tragedy finally happened.  

**What if** they have an analysis tool that can corrobarate or disprove their suspicion?

Our personality analyzer app is our answer to this "what if" question. The app uses the power of IBM Watson to implement an quantitative analysis on a target's social media activities. Its analysis reports can serve as a primitive evidence when a user reports a suspicious target to police.

### Web APP Description
In this project, we only focus on twitter as social media data source for analysis. When a user opens the web app, the user logs in his/her personal account, in which his/her own profile shows up as well as historical searching results. When the user wants to launch a new search about a target, he/she navigates to the analysis interface, types in the target's twitter account name and other information, and hit run. The web app starts to collect the target's tweets using twitter scraper, cleans the resulted tweets, and feed the data to IBM Watson API for personality. The Watson API returns an analysis report on the target's personality in JSON format. The web app sends the result back to the user and save it to the Mongodb database at the same time.
