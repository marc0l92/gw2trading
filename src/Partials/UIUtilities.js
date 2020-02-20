import React from 'react';

export function printAmount(coppers) {
    if (typeof coppers !== "number") {
        return (<span>{coppers}</span>);
    }
    let golds = Math.floor(coppers / 10000);
    coppers %= 10000;
    let silvers = Math.floor(coppers / 100);
    coppers %= 100;
    let goldsUi = golds ? <span>{golds} <img alt="Gold coin" src="images/Gold_coin.png" width="15" height="15" /></span> : '';
    let silverUi = silvers ? <span>{silvers} <img alt="Silver coin" src="images/Silver_coin.png" width="15" height="15" /></span> : '';
    let copperUi = <span>{coppers} <img alt="Copper coin" src="images/Copper_coin.png" width="15" height="15" /></span>;
    return (<span>{goldsUi} {silverUi} {copperUi}</span>);
}

// export function printFlags(flags) {
//     return (<span></span>);
// }