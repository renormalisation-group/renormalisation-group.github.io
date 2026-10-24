document.addEventListener("DOMContentLoaded", function () {
  const bios = window.authorBios;

  if (!bios || bios.length === 0) {
    return;
  }

  const bioElement = document.getElementById("author-bio");
  if (!bioElement) return;
  const storageKey = "authorBio:" + bioElement.dataset.authorId;

  let bio = sessionStorage.getItem(storageKey);

  if (!bio) {
    const randomIndex = Math.floor(Math.random() * bios.length);
    bio = bios[randomIndex];
    sessionStorage.setItem(storageKey, bio);
  }

  if (bioElement) {
    bioElement.innerHTML = "<p>" + bio + "</p>";
  }
});