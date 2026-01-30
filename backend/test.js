fetch("https://3000-iv4jinuro0v8oyaxjarfb.e2b.app/jokes")
  .then(res => res.json())
  .then(data => {
    console.log("Response:", data);
  })
  .catch(err => {
    console.error("Error:", err);
  });
