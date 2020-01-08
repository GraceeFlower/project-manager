function splitThousandsOfBits() {
  let numList = document.getElementsByClassName("specific-figure");
  const regexp = /\d{1,3}(?=(\d{3})+$)/g;
  [...numList].forEach(item => 
    item.innerHTML = item.innerHTML.replace(regexp, '$&,'));
}

splitThousandsOfBits();

function calculatePercent() {
  let numList = document.getElementsByClassName("specific-figure");
  let percentList = document.getElementsByClassName("percent-figure");
  for(let item = 1; item < numList.length; item++) {
    let percent = Math.round(Number(numList[item].innerHTML.match(/\d/g).join(''))
       * 100 / Number(numList[0].innerHTML.match(/\d/g).join('')));
    percentList[item -1].innerHTML = percent + '%';
  }
}

calculatePercent();