/*
“get_bundles(min_coeff, min_exp, max_coeff, max_exp)” returns the range of bundle sizes.
E.g. “get_bundles(2, -1, 5, 1)” returns “[0.2, 0.5, 1, 2, 5, 10, 20, 50]”.

Basically a bank note distribution between the number of 0 and the face (1, 2, 5)

 */

function get_bundles(_minCoeff, _minExp, _maxCoeff, _maxExp) {
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
        //Adding the lower values of faces
        for (let i = faces.indexOf(_minCoeff); i < 3; i++) {
            distrib.push(faces[i] * multiplier);
        }

        multiplier = multiplier * 10;

        //adding the mid values of faces
        let i = 1;
        while (i < range) {
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
