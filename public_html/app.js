/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var N, S0, B0, a, b, /*p, q,*/ r, K, pStar;

function init() {
    N = 2.0;
    S0 = 100.0;
    B0 = 10.0;
    a = -0.3;
    b = 0.4;
    //p = 0.0;
    //q = 0.0;
    r = 0.1;
    K = S0 + B0;
    pStar = (r-a)/(b-a);
}

function calcNextS(prevS, state) {
    if (!state) {
        return (1+a)*prevS;
    }
    else if (state) {
        return (1+b)*prevS;
    }
}

function calcB(n) {
    return Math.pow((1+r), n)*B0;
}

function calcC(x, n) {
    return Math.pow(1+r, -N)*calcF(x, n);
}

function calcF(x, n) {
    var F = 0.0;
    for (var i = 0; i <= n; i++) {
        F = F + bin(n, i)*Math.pow(pStar, i)*Math.pow(1-pStar, n-i)*Math.max(x*Math.pow(1+a, n)*Math.pow((1+b)/(1+a), i)-K, 0);
    }
    return F;
}

function calcGamma(x, n) {
    return Math.pow(1+r, -N+n)*(calcF(x*(1+b), N-n) - calcF(x*(1+a), N-n)) / (x*(b-a));
}

function calcBeta(x, n) {
    return calcF(x, N-n+1)/calcB(N) - Math.pow(1+r, -N+n)*(calcF(x*(1+b), N-n) - calcF(x*(1+a), N-n)) / (calcB(n-1)*(b-a));
}

function bin(n, k) {
    if ((typeof n !== 'number') || (typeof k !== 'number'))   
        return false;   
    var coeff = 1;  
    for (var x = n-k+1; x <= n; x++) coeff *= x;  
    for (x = 1; x <= k; x++) coeff /= x;  
    return coeff;  
}

$(function() {
    init();
    var n = 1;
    var C = calcC(S0, N);
    console.log(C);
    var gamma1 = calcGamma(S0, n);
    console.log(gamma1);
    var beta1 = calcBeta(S0, n);
    console.log(beta1);
    
    n = 2;
    var B1 = calcB(n-1);
    console.log(B1);
    var S1 = calcNextS(S0, true);
    console.log(S1);
    var gamma2 = calcGamma(S1, n);
    console.log(gamma2);
    var beta2 = calcBeta(S1, n);
    console.log(beta2);
    
    n = 3;
    var B2 = calcB(n-1);
    console.log(B2);
    var S2 = calcNextS(S1, true);
    console.log(S2);
});