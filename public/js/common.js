async function addClub() {
  const createdDate = new Date().toJSON().slice(0, 10)
  const clubName = prompt("Club name:");
  const clubDescription = prompt("Club description:");
  await fetch("/admin/addClub", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      clubName: clubName,
      clubDescription: clubDescription,
      createdDate: createdDate,
    }),
  })
    .then((response) => {
      if (response.ok) {
        const resData = "Club created.";
        location.reload();
        return Promise.resolve(resData);
      }
      return Promise.reject(response);
    })
    .catch((response) => {
      alert(response.statusText);
    });
}

async function deleteClub(id) {
  await fetch("/admin/deleteClub", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      clubId: id,
    }),
  })
    .then((response) => {
      if (response.ok) {
        const resData = "Club deleted.";
        location.reload();
        return Promise.resolve(resData);
      }
      return Promise.reject(response);
    })
    .catch((response) => {
      alert(response.statusText);
    });
}