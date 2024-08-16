function save() {
  const filename = prompt("Enter a filename:");
  let text = document.getElementById("text").value;

  // Combine folder and filename
  const key = `textEditorFiles/${filename}`; 

  if (localStorage.getItem(key) !== null) {
    if (!confirm(`A file named "${filename}" already exists. Overwrite?`)) {
      return; // Don't save if the user cancels
    }
  }

  localStorage.setItem(key, text);
  // Refresh the file list in fileman.html
  // Send a message to fileman.html to refresh the file list
  if (window.opener) { 
    window.opener.postMessage('refreshFileList', '*');
  } 
}

function load() {
  const filename = prompt("Enter a filename:");

  // Combine folder and filename
  const key = `textEditorFiles/${filename}`; 

  const text = localStorage.getItem(key);
  if (text === null) {
    alert(`File "${filename}" not found.`);
    return;
  }
  document.getElementById("text").value = text;
}

function view() {
  let filenames = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith("textEditorFiles/")) {
      filenames.push(key.substring(16)); // Remove "textEditorFiles/" from the beginning
    }
  }
  alert("Saved Files:\n" + filenames.join("\n"));
}

function deleteFile() {
  const filename = prompt("Enter the filename to delete:");

  // Combine folder and filename
  const key = `textEditorFiles/${filename}`; 

  if (localStorage.getItem(key) !== null) {
    localStorage.removeItem(key);
    alert(`File "${filename}" deleted successfully.`);
  } else {
    alert(`File "${filename}" not found.`);
  }
}

function download() {
  const filename = prompt("Enter the filename to download:");

  // Combine folder and filename
  const key = `textEditorFiles/${filename}`; 

  const text = localStorage.getItem(key);
  if (text === null) {
    alert(`File "${filename}" not found.`);
    return;
  }

  // Create a temporary link element
  const link = document.createElement("a");
  link.href = "data:text/plain;charset=utf-8," + encodeURIComponent(text);
  link.download = filename; // Set the download attribute
  document.body.appendChild(link); // Append the link to the DOM
  link.click(); // Trigger a click event to initiate the download
  document.body.removeChild(link); // Remove the link from the DOM
}

function openFromComputer() {
  const input = document.createElement('input');
  input.type = 'file';
  //input.accept = '.txt'; // Accept only text files
  input.onchange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      document.getElementById('text').value = event.target.result;
    };
    reader.readAsText(file);
  };
  input.click();
}
