# InsideDesk Programming Project solution

## Project
To start using this tool, please, use '-l' command: `node commands.js  -l`. It will load data from websites and save them locally for the futher faster search. Data will be saved in JSON files. Any time you want to update the files, just use this command again.
### Available commands in CLI:

![commands](./public/help.jpg) 




### Filter by a name:
![blue cross](./public/blu%20cross.gif) Too big, right? :)




### Filtering by names:
(default operand for search 'AND')
![blue cross new york](./public/blue%20cross%20new%20york.gif)




### Filtering by several names, with 'OR' logic:
![virginia new york](./public/virginia%20new%20york%20OR.gif)




### Filtering by id:
![id](./public/id.gif)




### Filtering by id and names:
(There is 'or' logic between id's, if we use several. There is 'and' logic between id and names. Logig for names is regulated by '-o' argument)


![id and names](./public/id%20and%20names.gif)




## Dependencies:
"commander": "^8.3.0",
"puppeteer": "^11.0.0"