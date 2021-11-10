CastaLabs test

Please use 
npm install
npm start


entry point is main.js ---> js/text/TestMain.js

Fully working on Chrome & Edge

IE will require more polyfills to be added

Possible issue in IE with TextDecoder

Having a very large data set in the MDAT box will cause an out of memory exception due
to using the DOM parser as the DOM tree will end up consuming a lot of memory while converting the data to XML. A possible solution would be not to convert the data to xml but to read it directly ( possibly in parts), use it and discard it