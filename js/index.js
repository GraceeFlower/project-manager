let numList = document.getElementsByClassName("specific-figure");
let percentList = document.getElementsByClassName("percent-figure");

function calculatePercent() {
  for(let item = 1; item < numList.length; item++) {
    let percent = Math.round(Number(numList[item].innerHTML)
       * 100 / Number(numList[0].innerHTML));
    percentList[item -1].innerHTML = percent + '%';
  }
}

function splitThousandsOfBits() {
  const regexp = /\d{1,3}(?=(\d{3})+$)/g;
  [...numList].forEach(item => 
    item.innerHTML = item.innerHTML.replace(regexp, '$&,'));
}

const API_ROOT = "http://localhost:3000/projects";
let itemList = document.getElementById('item-list');
  
(function getListData() {
  ajax({
    url: API_ROOT,
    method: "GET",
    success: function (result) {getItemData(result)},
    fail: function (error) {console.log(error)}
  });
})();

function markItemStatus(status) {
  numList[0].innerHTML = Number(numList[0].innerHTML) + 1;
  switch(status) {
    case 'ACTIVE':
      numList[1].innerHTML = Number(numList[1].innerHTML) + 1;
      return 'active-item';
    case 'PENDING':
      numList[2].innerHTML = Number(numList[2].innerHTML) + 1;
      return 'pending-item';
    case 'CLOSED':
      numList[3].innerHTML = Number(numList[3].innerHTML) + 1;
      return 'closed-item';
    default:
      break;
  }
}

function getItemData(data) {
  renderItem(data);
  calculatePercent();
  splitThousandsOfBits();
}

function renderItem(data) {
  if (!Array.isArray(data) && !data instanceof Array) {
    return false;
  }
  itemList.innerHTML = data.reduce((acc, cur) => {
    const statusStyle = markItemStatus(cur.status);
    return acc += 
    `<li>
      <span class="item-name">${cur.name}</span>
      <span class="item-desc">
        <p>${cur.description}</p>
        <span class="complete-desc">${cur.description}</span>
      </span>
      <span class="item-deadline">${cur.endTime}</span>
      <span class="item-status ${statusStyle}">${cur.status}</span>
      <span class="item-operation">
        <input type="button" name="delete-item-btn" value="删除" />
      </span>
    </li>`;
  }, '');
}
