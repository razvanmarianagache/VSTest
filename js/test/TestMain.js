
import 'core-js/modules/es.typed-array.uint8-array';
import 'core-js/modules/es.typed-array.uint32-array';

const boxRoots = ['moof', 'traf'];

let boxesFound = [];

const CastlabsTest = (pFile) => {

    fetch(pFile).then(response => response.arrayBuffer())
        .then(data => {
            processData(data);

            const tArray = new Uint8Array(data);
            const totalLength = tArray.byteLength;
            let currentChunkLength = 0;
            let currentChunkName = '';

                        for (let idx = 0; idx < totalLength; idx++) {
            //                 currentChunkLength = getChunkLength(tArray, idx, idx + 3);
            //                 idx += 4;
            //                 currentChunkName = getChunkName(tArray, idx, idx + 3);
            //                 if(boxRoots.includes(currentChunkName)){
            //                     console.log(' ---> RZV   yes'   );


            //                 }
            // console.log(' ---> RZV   ', idx   );
            // console.log(' ---> RZV   ', currentChunkName   );
                            console.log(' ---> RZV   ', idx, " - ", tArray[idx], " - ", String.fromCharCode(tArray[idx]));
                            if (idx >= 30) {
                                break;
                            }

                        }

            //             // const sampleArray = new Uint8Array([0, 0, 0, 10110101]);

            //             //  console.log(' ---> RZV  >> ', sampleArray);
            //             //  let output = (sampleArray[0] << 24) | (sampleArray[1] << 16) | (sampleArray[2] << 8) | sampleArray[3]
            //             //  console.log(' ---> RZV sample output --> ', output);

            //  console.log(' ---> RZV   ---'   );
            //  console.log(' ---> RZV   ---'   );
            //  console.log(' ---> RZV   ---'   );
            //             // getChunkLength(tArray, 0, 3);
            //             // getChunkName(tArray, 4, 7);

            //             // getChunkLength(tArray, 8, 11);
            //             // getChunkName(tArray, 12, 15);

            //             // getChunkName(tArray, 21, 25);
        })
}

const processData = (pData) => {
    const tArray = new Uint8Array(pData);
    const totalLength = tArray.byteLength;
    processBox(tArray, 0);

    console.log(' ---> RZV   boxesFound: ', boxesFound   );
    // for (let idx = 0; idx < totalLength; idx++) {

    //     processBox(tArray, idx);

    //     if (idx >= 50) {
    //         break;
    //     }
    // }

}

const processBox = (pArray, pStart) => {
    let currentChunkLength, currentChunkName;
    let idx = pStart;

    currentChunkLength = getChunkLength(pArray, idx, idx + 3);
    idx += 4;
    currentChunkName = getChunkName(pArray, idx, idx + 3);

    console.log(' ---> RZV  currentChunkName ', currentChunkName);
    console.log(' ---> RZV currentChunkLength  ', currentChunkLength);
    

    if (boxRoots.includes(currentChunkName)) {
        idx += 4;
        processBox(pArray, idx);
    }else{
        idx += currentChunkLength - 4;
        if(idx === pArray.byteLength){
            return;
        }
       
        processBox(pArray, idx);
    }
}

const getChunkLength = (pArray, pStart, pEnd) => {
    let chunkLength = 0;
    let iterator = 1;
    for (let idx = pStart; idx <= pEnd; idx++) {
        chunkLength = chunkLength | pArray[idx] << (32 - 8 * iterator)
        iterator++;
    }
    return chunkLength;
}

const getChunkName = (pArray, pStart, pEnd) => {
    let chunkName = '';
    for (let idx = pStart; idx <= pEnd; idx++) {
        console.log(' ---> RZV   ', pArray[idx]   );
        chunkName += String.fromCharCode(pArray[idx])
    }
    return chunkName;
}

export default CastlabsTest;


       // console.log(' ---> RZV   ', iterator, " ", 32 - 8 * iterator   );
      //  console.log(' ---> RZV   ',pArray[idx].toString(2), " - ", pArray[idx].toString(2) << 32 - 8 * iterator    );