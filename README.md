## Social Media Data Based Personality Analyzer

### Motivation
We still vividly remember the heartbroken news in February 15, that is, a 19-year-old teenager killed 17 of his schoolmates and teachers and injured dozens at Marjory Stoneman Douglas High School in
Parkland, Florida. The incident did not happen without any sign. Nikolas Cruz, the shooter, had explicitly expressed his violent inclination on social media at one time or another. Furthermore, instead of being shocked, many of his schoolmates said they were not surprised for what Nikolas did. One of them even told local radio station WFOR “Everyone predicted it”.  
Although so many peers of the shooter have detected his abnormal behavior, none of them warned the
local police department of the shooter’s possible violence. One reason could be that they just felt that way, but they didn’t have a substantial evidence to corroborate their feelings until the tragedy finally happened.  
What if they have an analysis tool that can check if what they feel about a peer is correct and gives a
quantitative analysis that can be used as a supporting evidence? Actually they could have such a
powerful tool by taking advantage of social media. Many researches have verified that a user’s social
media activities can be used as source data to analyze the user’s personality and predict the person’s attitude toward violence. This idea motivates us to build a social media personality analysis web app. The web app is able to help its users do a primitive analysis on a target person using the person's social
media data.

### Web APP Description
In this project, we only focus on twitter as social media data source for analysis. When a user opens the web app, the user logs in his/her personal account, in which his/her own profile shows up as well as historical searching results. When the user wants to launch a new search about a target, he/she navigates to the analysis interface, types in the target's twitter account name and other information, and hit run. The web app starts to collect the target's tweets using twitter scraper, cleans the resulted tweets, and feed the data to IBM Watson API for personality. The Watson API returns an analysis report on the target's personality in JSON format. The web app sends the result back to the user and save it to the Mongodb database at the same time.
