function splitThousandsOfBits() {
  let numList = document.getElementsByClassName("specific-figure");
  const regexp = /\d{1,3}(?=(\d{3})+$)/g;
  for(let item = 0; item < numList.length; item++) {
    numList[item].innerHTML = numList[item].innerHTML.replace(regexp, '$&,');
  }
}

splitThousandsOfBits();