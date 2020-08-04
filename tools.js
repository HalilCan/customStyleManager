const __debugMode = 0;


/// CSS PARSING (INTO VALID OBJECTS) ///

function isValidSelectorChar(code) {
  return  ((code > 47 && code < 58) || // numeric (0-9)
          (code > 64 && code < 91) || // upper alpha (A-Z)
          (code > 96 && code < 123) || // lower alpha (a-z)
          (code == 46) || (code == 35)); // . 46, # 35 
}

function isOpeningBrace(charcode) {
  // { 123  
  return (charcode == 123);
}

function isClosingBrace(charcode) {
  // } 125   
  return (charcode == 125);
}

function cssTextToRules(styleContent) {
  if (__debugMode) {
    console.log(`cssTextToRules(${styleContent})`);
  }

  let tempObj = {};

  let inPara = 0; //just accept everything in "paragraph"
  let inSelector = 0;

  let tempKey = "";
  let tempValue = "";
  let ch;

  for (let i = 0 ; i < styleContent.length; i ++) {
    ch = styleContent.charCodeAt(i);

    if(inPara == 0 && inSelector == 0) {
      if (isValidSelectorChar(ch)) {
        inPara = 0;
        inSelector = 1;
        tempKey += String.fromCharCode(ch);
        continue;
      }
    } else if (inPara == 0 && inSelector == 1) {
      if (isValidSelectorChar(ch)) {
        tempKey += String.fromCharCode(ch);
      } else if (isOpeningBrace(ch)) {
        inPara = 1;
        inSelector = 0;
        continue;
      } else {
        inPara = 1;
        inSelector = 0;        
        //TODO: What would this scenario look like?
      }
      continue;
    } else if (inPara == 1 && inSelector == 0) {
      if (isOpeningBrace(ch) || isClosingBrace(ch)) {
        if (isClosingBrace(ch)) {
          inPara = 0;
          inSelector = 0;
          tempObj[tempKey] = tempValue;

          tempKey = "";
          tempValue = "";
          continue;
        } else {
          continue;
        }
      }
      tempValue += String.fromCharCode(ch);
      continue;
    }
  }

  if (__debugMode) {
    console.log(`cssTextToRules result:`);
    console.log(tempObj);
    console.log(JSON.stringify(tempObj));
    console.log(`---------------------`);
  }
  return tempObj;
};


////////////////////////////////////////