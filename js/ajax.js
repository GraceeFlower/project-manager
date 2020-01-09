window.ajax = function (options) {
  const ajaxData = {
    url: options.url || '',
    method: options.method.toUpperCase() || 'GET',
    header: options.header || '',
    data: options.data || null,
    success: options.success || function (result) {},
    fail: options.fail ||function (error) {}
  };

  let xhr = new XMLHttpRequest();

  xhr.open(ajaxData.method, ajaxData.url, ajaxData.data);

  if ('POST' === ajaxData.method || 'PUT' === ajaxData.method) {
    xhr.setRequestHeader = ('content-type', 'application/json');
    ajaxData = JSON.stringify(ajaxData.data);
  }

  xhr.onsuccess = () => ajaxData.success(xhr.responseText);
  xhr.onerror = () => ajaxData.fail(xhr.status);

  xhr.send(ajaxData.data);
}