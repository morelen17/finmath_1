/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var N, S0, B0, a, b, r, K, pStar, states;

function init() {
    /*N = 2.0;
    S0 = 100.0;
    B0 = 10.0;
    a = -0.3;
    b = 0.4;
    r = 0.1;*/
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

function calcProfit(gamma, beta, s, b) {
    return gamma * s + beta * b;
}

function bin(n, k) {
    if ((typeof n !== 'number') || (typeof k !== 'number'))   
        return false;   
    var coeff = 1;  
    for (var x = n-k+1; x <= n; x++) coeff *= x;  
    for (x = 1; x <= k; x++) coeff /= x;  
    return coeff;  
}

function calculation() {
    init();
    var n = 1;
    var C = calcC(S0, N);
    console.log(C);
    
    var gamma1 = calcGamma(S0, n);
    console.log(gamma1);
    var beta1 = calcBeta(S0, n);
    console.log(beta1);
    
    var Bj = B0, Sj = S0, gamma, beta;
    for (n = 2; n <= N; n++) {
        Bj = calcB(n-1);
        console.log('B'+n+' '+Bj);
        Sj = calcNextS(Sj, (states.substr(n-2,1) === '+' ? true : false));
        console.log('S'+n+' '+Sj);
        gamma = calcGamma(Sj, n);
        console.log('gamma'+n+' '+gamma);
        beta = calcBeta(Sj, n);
        console.log('beta'+n+' '+beta);
    }
    
    var Bn = calcB(n-1);
    console.log('B'+n+' '+Bn);
    var Sn = calcNextS(Sj, (states.substr(-1,1) === '+' ? true : false));
    console.log('S'+n+' '+Sn);
    
    var profit = calcProfit(gamma, beta, Sn, Bn);
    console.log('profit '+profit);
}

$(function() {
    /*init();
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
    
    var profit = calcProfit(gamma2, beta2, S2, B2);
    console.log(profit);*/
    
    
    $('.form-horizontal').submit(function() {
        if ($(this).validate()) {
            console.log('qwe');
            N = +$('#val-N').val();
            console.log(N);
            S0 = +$('#val-S0').val();
            console.log(S0);
            B0 = +$('#val-B0').val();
            console.log(B0);
            a = +$('#val-a').val();
            console.log(a);
            b = +$('#val-b').val();
            console.log(b);
            r = +$('#val-r').val();
            console.log(r);
            states = $('#val-states').val();
            console.log(states);
            console.log('');
            calculation();
        }
        else {
            console.log('zxc');
        }
        return false;
    });
    /*$(".form-horizontal").validate({
        submitHandler: function(form) {
            form.submit(function() {
                alert('asd');
                return false;
            });
        }
    });*/
});