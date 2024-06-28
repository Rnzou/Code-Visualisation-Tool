import { type } from "os";
import { startGDB } from "./debug.mjs"; 

async function processData() {
  const { debugInfo, threadsInfo } = await startGDB();

    let summaryInfo              = [];
    let debugInfoNumbers         = [];
    let debugInfoArrays          = [];
    let debugInfoPointerArrays   = [];
    let threadsInfoA             = [];
    let debugInfoNumbersOriginal = [];

    const length = debugInfo.length;
    const seenNumbers = new Map();
    const seenArrays = new Map();

    debugInfo.forEach(frameData => {
        let debugInfoNumbersTemp           = [];
        let debugInfoArraysTemp            = [];
        let debugInfoPointerArraysTemp     = [];
        let debugInfoNumbersOriginalTemp   = [];
        frameData.forEach(varData => {
            let typeofdata = varData.type;

            if(typeofdata === 'int'   ||
            typeofdata === 'struct node *'
            ) {
                debugInfoNumbersOriginalTemp.push({...varData});
            };

            if(typeofdata === 'int'             || 
            typeofdata === 'short'           ||
            typeofdata === 'long'            ||
            typeofdata === 'long long'       ||
            typeofdata === 'char'            ||
            typeofdata === 'signed char'     ||
            typeofdata === 'unsigned char'   ||
            typeofdata === 'float'           ||
            typeofdata === 'double'          ||
            typeofdata === 'long double'     ||
            typeofdata === 'int *'           || 
            typeofdata === 'short *'         ||
            typeofdata === 'long *'          ||
            typeofdata === 'long long *'     ||
            typeofdata === 'char *'          ||
            typeofdata === 'signed char *'   ||
            typeofdata === 'unsigned char *' ||
            typeofdata === 'float *'         ||
            typeofdata === 'double *'        ||
            typeofdata === 'long double *'   
            ) {
                if (!seenNumbers.has(varData.name)) {
                    seenNumbers.set(varData.name, {lastValue: varData.value });
                    varData.value = '?'; 
                } else {
                    let info = seenNumbers.get(varData.name);
                    if (info.lastValue === varData.value) {
                        varData.value = '?';
                    };
                    
                };
                debugInfoNumbersTemp.push(varData);
            };
    
            if(typeofdata.includes('int [')           ||
            typeofdata.includes('short [')         ||
            typeofdata.includes('long [')          ||
            typeofdata.includes('long long [')     ||
            typeofdata.includes('char [')          ||
            typeofdata.includes('signed char [')   ||
            typeofdata.includes('unsigned char [') ||
            typeofdata.includes('float [')         ||
            typeofdata.includes('double [')        ||
            typeofdata.includes('long double [')   
            ) {
                varData.value = varData.value.replace(/{|}/g, '').trim();
                let parts = varData.value.split(',');
                varData.value = parts.map(Number);

                if (!seenArrays.has(varData.name)) {
                    seenArrays.set(varData.name, {lastValue: varData.value});
                    varData.value = varData.value.map(() => '?');  
                } else {
                    let info = seenArrays.get(varData.name);
                    if (arraysEqual(info.lastValue, varData.value)) {
                        varData.value = varData.value.map(() => '?'); 
                    };
                };
                debugInfoArraysTemp.push(varData);
            }

            if(typeofdata.includes('int *[')           ||
            typeofdata.includes('short *[')         ||
            typeofdata.includes('long *[')          ||
            typeofdata.includes('long long *[')     ||
            typeofdata.includes('char *[')          ||
            typeofdata.includes('signed char *[')   ||
            typeofdata.includes('unsigned char *[') ||
            typeofdata.includes('float *[')         ||
            typeofdata.includes('double *[')        ||
            typeofdata.includes('long double *[')   
            ) {
                varData.value = varData.value.replace(/^\{|\}$/g, '');
                varData.value = varData.value.split(', ');
                
                function replaceIfContains(arr, searchString = "Cannot access memory") {
                    const contains = arr.some(element => element.includes(searchString));
                
                    if (contains) {
                        return arr.map(() => '?');
                    }

                    return arr;
                }

                varData.value = replaceIfContains(varData.value);

                debugInfoPointerArraysTemp.push(varData);
            }
            
        });

        debugInfoNumbers.push(debugInfoNumbersTemp);
        debugInfoArrays.push(debugInfoArraysTemp);
        debugInfoPointerArrays.push(debugInfoPointerArraysTemp);
        debugInfoNumbersOriginal.push(debugInfoNumbersOriginalTemp);

    });

    function arraysEqual(arr1, arr2) {
        if (arr1.length !== arr2.length) {return false;}
        for (let i = 0; i < arr1.length; i++) {
            if (arr1[i] !== arr2[i]) {return false;}
        }
        return true;
    }

    threadsInfo.forEach(frameData => {
        threadsInfoA.push({line : frameData[0].line, func : frameData[0].func});
    });

    for(let i = 0; i < length; i++) {
        summaryInfo.push([debugInfoArrays[i], debugInfoPointerArrays[i] ,debugInfoNumbers[i], threadsInfoA[i], debugInfoNumbersOriginal[i]]);
    }

    summaryInfo = summaryInfo.filter(element => element[3].func !== "printf");

  return { summaryInfo };

}

processData();

export { processData };




