
document.getElementById('imageUpload').addEventListener('change', function(e) {
  var file = e.target.files[0];
  var reader = new FileReader();

  reader.onloadend = function() {
    localStorage.setItem('uploadedImage', reader.result);
    document.getElementById('ma').src = reader.result;
  }

  if (file) {
    reader.readAsDataURL(file);
  }
});