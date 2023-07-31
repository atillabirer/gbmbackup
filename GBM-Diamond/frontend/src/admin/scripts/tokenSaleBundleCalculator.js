/*
“get_bundles(min_coeff, min_exp, max_coeff, max_exp)” returns the range of bundle sizes.
E.g. “get_bundles(2, -1, 5, 1)” returns “[0.2, 0.5, 1, 2, 5, 10, 20, 50]”.

Basically a bank note distribution between the number of 0 and the face (1, 2, 5)

 */

function get_bundlesMath(_minCoeff, _minExp, _maxCoeff, _maxExp) {
    let faces = [1, 2, 5];

    if (faces.indexOf(_minCoeff) == -1) {
        throw ("Wrong _minCoeff");
    }

    if (faces.indexOf(_maxCoeff) == -1) {
        throw ("Wrong _maxCoeff");
    }

    let range = _maxExp - _minExp;
    let multiplier = 10 ** (_minExp);

    let distrib = [];

    if (range > 0) {
        for (let i = faces.indexOf(_minCoeff); i < 3; i++) {         //Adding the lower values of faces
            distrib.push(faces[i] * multiplier);
        }
        multiplier = multiplier * 10;

        let i = 1;   
        while (i < range) {  //adding the mid values of faces
            distrib.push(faces[0] * multiplier);
            distrib.push(faces[1] * multiplier);
            distrib.push(faces[2] * multiplier);
            i++;
            multiplier = multiplier * 10;
        }

        //Adding the higher values of faces
        for (let i = 0; i <= faces.indexOf(_maxCoeff); i++) {
            distrib.push(faces[i] * multiplier);
        }
    } else {
        for (let i = faces.indexOf(_minCoeff); i <= faces.indexOf(_maxCoeff); i++) {
            distrib.push(faces[i] * multiplier);
        }
    }
    return distrib;

}

// _totalTokens : float
// _distrib : array of banknote values (1, 2, 5, 10...)
// _whale_factor : a float between 0 and 1. If it's close to 1 : most of the value is in as high banknote as possible. If close to 0, in as small banknots as possible
// Return : ( [{value:"banknoteValue", amount:"amountOfThisBanknotTosell"},...], number of undistributed tokens);
function getSalesDistributionMath(_totalTokens, _distrib, _whale_factor){

    if(_whale_factor < 0 || _whale_factor > 1){
        throw ("Wrong _whale_factor. Must be betwen 0.0 and 1.0");
    }

    let reminder_tokens = _totalTokens;
    let saleBundling = [];
    //console.log(_distrib);
    for(let i = _distrib.length-1; i >= 0; i--){
        let localAmount = Math.floor( //Must be an integer
                _whale_factor * ( //Control how top-heavy the distribution is
                        reminder_tokens / _distrib[i]
                    )
            );
        saleBundling.push({"value":_distrib[i], "amount":localAmount});
        reminder_tokens -= localAmount * _distrib[i];
    }

    /*
        //Adding the leftover to the cascade of banknotes
    if(reminder_tokens != 0){
        let localAmount = Math.floor( reminder_tokens / _distrib[0]) ;
        saleBundling[saleBundling.length -1] = {"value":_distrib[0], "amount":(localAmount + saleBundling[saleBundling.length -1].amount)};
        reminder_tokens -= localAmount;
    }*/

    //Adding the leftover to as high banknote as possible, by increasing the whale factor for every tier we go trough again
    let filler = 0;
    while(reminder_tokens >= _distrib[0]){
        filler++;
        let localWhale = _whale_factor;
        for(let i = _distrib.length-1; i >= 0; i--){
            localWhale += (filler * _whale_factor/_distrib.length);
            if(localWhale > 1){
                localWhale = 1;
            }
            let localAmount = Math.floor((localWhale * reminder_tokens / _distrib[i]));
            saleBundling[saleBundling.length - i - 1] = ({"value":_distrib[i], "amount":(localAmount + saleBundling[saleBundling.length - i - 1].amount)});
            reminder_tokens -= localAmount * _distrib[i];
    
        }
    }
    
    return( {saleBundling, reminder_tokens});
}


// Pretty sure there's a more elegant way to do this
// Convert 500 to (5, 2)  or 0.2 to (2, -1)
function toCoeffAndExp(_input){
    _input = Math.log10(_input);
    let _exp = Math.floor(_input);
    let _coef;

    switch(Math.floor(_input * 10)%10){
        case 0:
            _coef = 1;
            break;
        case 3:
            _coef = 2;
            break;
        case 6: 
            _coef = 5;
            break;
        default:
            _coef = 1;
    }

    return ({_coef, _exp});
}

//   return(saleBundling, reminder_tokens);
function generateDistributionFromNotesAndTokenAmount(_totalTokens, _smallestNote, _biggestNote, _whaleFactor){
    let min = toCoeffAndExp(_smallestNote);
    let max = toCoeffAndExp(_biggestNote);
    let _distrib = get_bundlesMath(min._coef, min._exp, max._coef, max._exp);
    return getSalesDistributionMath(_totalTokens, _distrib, _whaleFactor);
}
