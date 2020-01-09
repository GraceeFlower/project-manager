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

const API_ROOT = "http://localhost:3000/projects";
let itemList = document.getElementById('item-list');
  
function getListData() {
  ajax({
    url: API_ROOT,
    method: "GET",
    success: function (result) {renderItemList(result)},
    fail: function (error) {console.log(error)}
  });
}

function markItemStatus(status) {
  switch(status) {
    case 'ACTIVE':
      return 'active-item';
    case 'PENDING':
      return 'pending-item';
    case 'CLOSED':
      return 'closed-item';
    default:
      break;
  }
}

function renderItemList(data) {
  if (!Array.isArray(data) && !data instanceof Array) {
    return false;
  }

  itemList.innerHTML = data.reduce((acc, cur) => {
    const statusStyle = markItemStatus(cur.status);
    return acc += 
    `<li>
      <span class="item-name">${cur.name}</span>
      <span class="item-desc"><p>${cur.description}</p></span>
      <span class="item-deadline">${cur.endTime}</span>
      <span class="item-status ${statusStyle}">${cur.status}</span>
      <span class="item-operation">
        <input type="button" name="delete-item-btn" value="删除" />
      </span>
    </li>`;
  }, '');
}

getListData();