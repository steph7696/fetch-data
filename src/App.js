import './App.css';

/* fetch json - need proxy b/c of strict-origin-when-cross-origin */
async function fetchData() {
  var proxyUrl = 'https://cors-anywhere.herokuapp.com/';
  var targetUrl = 'https://fetch-hiring.s3.amazonaws.com/hiring.json';
  return (await fetch(proxyUrl + targetUrl)).json();
};

/* display content in a table */
(async () => {
  const json = await fetchData();
  
  for (var i = 0; i < json.length; i++) {
    /* to sort results by "name", sort them first */
    /* also sort Ids to prevent timing issue - it will include 1st Id regardless of name or listId values if not sorted at same time */
    sortNamesAndIds(json, i);

    /* then, display all items grouped by "listId" */
    sortListIds(json, i);   
  }
})();

async function sortNamesAndIds(json, i) {
    await json.sort(function(a, b) {
      /* check if names have values */
      const isFirstNameValid = (a.name !== null) && (a.name !== "") && (json[i].name);
      const isSecondNameValid = (b.name !== null) && (b.name !== "") && (json[i].name);

      /* to compare, take off "Item " from string & convert to Number - but only if names have values */
      const firstName = (isFirstNameValid) && Number(a.name.substr(5, json[i].name.length - 1));
      const secondName = (isSecondNameValid) && Number(b.name.substr(5, json[i].name.length - 1));

      return (firstName - secondName);
    });

    if (json[i].name !== "" && json[i].name !== null) {
      document.getElementById("name").innerHTML += json[i].name + "<br>";
      document.getElementById("id").innerHTML += json[i].id + "<br>";
    }
}

async function sortListIds(json, i) {
  await json.sort(function(a, b) { 
    return a.listId - b.listId;
  })

  if (json[i].name !== "" && json[i].name !== null) {
    document.getElementById("listId").innerHTML += json[i].listId + "<br>";
  }
}

function App() {
  return (   
    <div>
      <h2>Items</h2>
      <table>
        <tbody>
          <tr>
            <th>Id</th>
            <th>ListId</th>
            <th>Name</th>
          </tr>
          <tr>
            <td id="id"></td>
            <td id="listId"></td>
            <td id="name"></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default App;
