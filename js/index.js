function calculatePercent(numList, percentList) {
  for(let item = 1; item < numList.length; item++) {
    let percent = Math.round(Number(numList[item].innerHTML)
       * 100 / Number(numList[0].innerHTML));
    percentList[item -1].innerHTML = percent + '%';
  }
}

function splitThousandsOfBits(numList) {
  const regexp = /\d{1,3}(?=(\d{3})+$)/g;
  [...numList].forEach(item => 
    item.innerHTML = item.innerHTML.replace(regexp, '$&,'));
}

function initStatistic() {
  let numList = document.getElementsByClassName("specific-figure");
  let percentList = document.getElementsByClassName("percent-figure");
  calculatePercent(numList, percentList);
  splitThousandsOfBits(numList);
}

initStatistic();