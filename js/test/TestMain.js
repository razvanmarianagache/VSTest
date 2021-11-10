
/**
 * This will work in Edge, Chrome & Firefox
 */


import 'core-js/modules/es.typed-array.uint8-array';

const boxRoots = ['moof', 'traf'];

const displayableContent = {
    name: 'mdat',
    index: '',
    len: ''
}

/** Call this once to start the entire loading & parsing process
 * 
 * @param {*} pFile - url to the actual file that needs to be loaded
 */
const CastlabsTest = (pFile) => {
    fetch(pFile)
        .then(response => response.arrayBuffer())
        .then(data => {
            processData(data);
        })
}

const processData = (pData) => {
    var startTime = performance.now();

    const tArray = new Uint8Array(pData);
  
    processBox(tArray);

    var endTime = performance.now();

    renderImages(tArray, displayableContent);

    console.log(' ---> ');
    console.log(` ---> Parsing process time: ' ${endTime - startTime}ms   `);
    console.log(' ---> ... might be faster if we drop console log');
}

/**
 * Will parse the entire byte array from one 'box' to the other 
 * Jumps over the content of boxes
 * Considers that a box only has other boxes and no content by checking the chunk name with boxRoots
 * @param {*} pArray 
 * @param {*} pStart 
 * @returns 
 */
const processBox = (pArray, pStart = 0) => {
    let currentChunkLength, currentChunkName;
    let idx = pStart;

    currentChunkLength = getChunkLength(pArray, idx, idx + 3);
    idx += 4;
    currentChunkName = getChunkName(pArray, idx, idx + 3);

    console.log(`Found box of type ${currentChunkName} and size ${currentChunkLength}  --- box present from bytes: ${pStart} - ${pStart + currentChunkLength}`);

    if(currentChunkName === displayableContent.name){ 
        displayableContent.index = pStart;
        displayableContent.len = currentChunkLength;
    }

    if (boxRoots.includes(currentChunkName)) {
        idx += 4;
        processBox(pArray, idx);
    } else {
        idx += currentChunkLength - 4;
        if (idx >= pArray.byteLength) {        // === not safe enough
            return;
        }
        processBox(pArray, idx);
    }
}

/**
 * Will only read 4 bytes from pStart to pEnd
 * Will summ them up together and return the value
 * @param {*} pArray 
 * @param {*} pStart 
 * @param {*} pEnd 
 * @returns only the chunk length as number
 */
const getChunkLength = (pArray, pStart, pEnd) => {
    let chunkLength = 0;
    let iterator = 1;
    for (let idx = pStart; idx <= pEnd; idx++) {
        chunkLength = chunkLength | pArray[idx] << (32 - 8 * iterator)
        iterator++;
    }
    return chunkLength;
}

/**
 * Will only read 4 bytes from pStart to pEnd
 * Will summ them up together to a string and return the value
 * @param {*} pArray 
 * @param {*} pStart 
 * @param {*} pEnd 
 * @returns only the chunk name as string
 */
const getChunkName = (pArray, pStart, pEnd) => {
    let chunkName = '';
    for (let idx = pStart; idx <= pEnd; idx++) {
        chunkName += String.fromCharCode(pArray[idx])
    }
    return chunkName;
}

/**
 * Used only to parse the data and render the images.
 * uses pMdatData to start reading from the byte stream
 * This will first create a new array from the original byte stream that will hold ONLY the actual content data
 * Then it will convert it to xml and iterate to get to the images base64 data
 */
const renderImages = (pArray, pMdatData) => {
    const {index, len} = pMdatData;

    const mdatContentStart = index + 8;
    const newArray = pArray.subarray(mdatContentStart, mdatContentStart + len)
    console.log(`Content of mdat box is: ${Buffer.from(newArray).toString()}`   );

    const decoder = new TextDecoder('utf8');
    const mdatXML = new window.DOMParser().parseFromString(decoder.decode(newArray), "text/xml")
    
    const listHolderEl = document.getElementById('list-holder');
    
    for(let node of mdatXML.firstChild.childNodes){
        if(node.nodeName === 'head'){
            for(let headNode of node.childNodes){
                if(headNode.nodeName === 'metadata'){
                    for(let metaNode of headNode.childNodes){
                        if(metaNode.nodeName === 'smpte:image'){
                            let newLiElement = document.createElement('li');
                            let newImage = document.createElement('img');
                            newImage.src = "data:image/png;base64," + metaNode.firstChild.nodeValue;
                            newLiElement.appendChild(newImage);
                            listHolderEl.appendChild(newLiElement);
                        }
                    }
                    return;
                }
            }
            return;
        }
    }
}

export default CastlabsTest;