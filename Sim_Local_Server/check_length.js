//Compare Time

const arr1 = [2, 5];
const arr2 = [1, 7];

function test(line1 = [], line2 = []) {
    if (line2[0] > line1[1] || line1[0] > line2[1])
        return 0;
    else {
        return 1;
    }
}

console.log(test(arr1, arr2));

//Compare Day
const array_ref = [1, 1, 0, 0, 0];
const array_new = [1, 0, 1, 1, 1];

function test2(refData = [], newData = []) {
    for (let i = 0; i < refData.length; i++) {
        if (refData[i] == 1)
            if (newData[i] == refData[i])
                return 1;
    }
    return 0;
}

console.log(test2(array_ref, array_new));

