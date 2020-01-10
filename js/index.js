let numList = document.getElementsByClassName('specific-figure');
let percentList = document.getElementsByClassName('percent-figure');
let itemList = document.getElementById('item-list');
let confirmPage = document.getElementsByClassName('confirm-deletion-page')[0];
const API_ROOT = "http://localhost:3000/projects";
let pageStatus = 'all';

function getItemData(data) {
  separateStatus(data);
  splitThousandsOfBits()
}

function getListData() {
  ajax({
    url: API_ROOT,
    method: "GET",
    success: function (result) {getItemData(result);},
    fail: function (error) {console.log(error)}
  });
}

function calculatePercent(lenArr) {
  if (0 === lenArr[0]) {
    [...percentList].forEach(item => item.innerHTML = '0%');
  } else {
    let fullPercent = 100;
    let percentArr = lenArr.slice(1).map((element) => 
      Math.round(element * 10000 / lenArr[0]) / 100);
    fullPercent -= percentArr.reduce((pre, cur) => pre + cur, 0);
    if (fullPercent) {
      let addIndex;
      lenArr.slice(1).filter((element, index, arr) => {
        if (arr.lastIndexOf(element) === index) {
          addIndex = index;
        }
      });
      percentArr[addIndex] = (percentArr[addIndex] * 100 + fullPercent.toFixed(2) * 100) / 100;
    }
    percentArr.forEach((item, index) => percentList[index].innerHTML = item + '%');
  }
}

function splitThousandsOfBits() {
  const regexp = /\d{1,3}(?=(\d{3})+$)/g;
  [...numList].forEach(item => 
    item.innerHTML = item.innerHTML.replace(regexp, '$&,'));
}

function initNumList(lenArr) {
  [...numList].forEach((value, index) => value.innerHTML = lenArr[index]);
  calculatePercent(lenArr);
}

function handleData(data) {
  if (!Array.isArray(data) && !data instanceof Array) {
    return false;
  }
  let active = data.filter(item => 'ACTIVE' === item.status);
  let pending = data.filter(item => 'PENDING' === item.status);
  let closed = data.filter(item => 'CLOSED' === item.status);
  const lenArr = [data.length, active.length, pending.length, closed.length];
  return {
    active: active,
    pending: pending,
    closed: closed,
    lenArr: lenArr
  };
}

function separateStatus(data) {
  let {active, pending, closed, lenArr} = handleData(data);
  initNumList(lenArr);
  switch(pageStatus) {
    case 'active':
      renderItem(active);
      break;
    case 'pending':
      renderItem(pending);
      break;
    case 'closed':
      renderItem(closed);
      break;
    default:
      renderItem(data);
      break;
  }
}

function renderItem(data) {
  itemList.innerHTML = data.reduce((acc, cur) => {
    let statusStyle = `${cur.status.toLowerCase()}-item`;
    return acc += 
    `<li data-id=${cur.id}>
      <span class="item-name">${cur.name}</span>
      <span class="item-desc">
        <p>${cur.description}</p>
        <span class="complete-desc">${cur.description}</span>
      </span>
      <span class="item-deadline">${cur.endTime}</span>
      <span class="item-status ${statusStyle}">${cur.status}</span>
      <span class="item-operation">
        <input type="button" name="delete-item-btn" value="删除" onclick="createConfirmPage(${cur.id})"/>
      </span>
    </li>`;
  }, '');
}

function createConfirmPage(itemId) {
  confirmPage.style.display = 'block';
  confirmPage.innerHTML = `
    <div class="confirm-dialog-box">
      <button onclick="closeConfirm(false, null)"><span class="iconfont icon-close"></span></button>
      <div class="confirm-info">
        <span class="iconfont icon-confirm"></span>
        <h1>提示</h1>
        <p>确认删除该项目吗?</p>
      </div>
      <div class="confirm-btn-list">
        <input type="button" name="confirm" value="确认" onclick="closeConfirm(true, ${itemId})"/>
        <input type="button" name="cancel" value="取消" onclick="closeConfirm(false, null)"/>
      </div>
    </div>`
}

function closeConfirm(status, itemId) {
  confirmPage.innerHTML = '';
  confirmPage.style.display = 'none';
  if (status) {
    deleteItemData(itemId);
    reloadStatistic();
  }
}

function deleteItemData(itemId) {
  ajax({
    url: `${API_ROOT}/${itemId}`,
    method: "DELETE",
    success: deleteItem(itemId),
    fail: function (error) {console.log(error)}
  });
}

function deleteItem(itemId) {
  let chosenItem;
  for(let index = 0; index < itemList.children.length; index++) {
    if (itemId == itemList.children[index].getAttribute('data-id')) {
      chosenItem = itemList.children[index];
      break;
    }
  }
  itemList.removeChild(chosenItem);
}

function reloadStatistic() {
  ajax({
    url: API_ROOT,
    method: 'GET',
  })
  ajax({
    url: API_ROOT,
    method: 'GET',
    success: function (result) {reloadNumList(result);},
    fail: function (error) {console.log(error)}
  })
}

function reloadNumList(data) {
  let{lenArr} = handleData(data);
  initNumList(lenArr);
  splitThousandsOfBits();
}

getListData();
