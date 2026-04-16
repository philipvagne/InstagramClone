// Mock feed data (would normally come from an API)
const posts = [
  {
    id: 1,
    name: "Vincent van Gogh",
    username: "vincey1853",
    location: "Zundert, Netherlands",
    avatar: "images/avatar-vangogh.jpg",
    postImage: "images/post-vangogh.jpg",
    comment: "just took a few mushrooms lol",
    likes: 21492,
    liked: false
  },
  {
    id: 2,
    name: "Gustave Courbet",
    username: "gus1819",
    location: "Ornans, France",
    avatar: "images/avatar-courbet.jpg",
    postImage: "images/post-courbet.jpg",
    comment: "i'm feelin a bit stressed tbh",
    likes: 12500,
    liked: false
  },
  {
    id: 3,
    name: "Joseph Ducreux",
    username: "jd1735",
    location: "Paris, France",
    avatar: "images/avatar-ducreux.jpg",
    postImage: "images/post-ducreux.jpg",
    comment: "gm friends!",
    likes: 15120,
    liked: false
  }
]

// Simple story data (UI-only for now)
const storiesData = [
  { username: "vangogh", avatar: "images/avatar-vangogh.jpg", seen: false },
  { username: "courbet", avatar: "images/avatar-courbet.jpg", seen: false },
  { username: "ducreux", avatar: "images/avatar-ducreux.jpg", seen: false }
]

// DOM references
const feed = document.getElementById("feed")
const storiesContainer = document.getElementById("stories")

// Builds HTML for a single post
function createPost(post) {
  return `
    <article class="post" data-id="${post.id}">

      <header class="post-header">
        <img src="${post.avatar}" alt="${post.name}" class="avatar">
        <div>
          <p class="username">
            <a href="#" class="name-link">${post.name}</a>
          </p>
          <p class="location">${post.location}</p>
        </div>
      </header>

      <img src="${post.postImage}" alt="Post image" class="post-image">

      <div class="post-actions">
        <div class="left-icons">
          <img src="images/icon-heart.png" class="icon heart-icon">
          <img src="images/icon-comment.png" class="icon">
          <img src="images/icon-dm.png" class="icon">
        </div>
      </div>

      <p class="likes">
        <strong class="like-count">${post.likes.toLocaleString()}</strong> likes
      </p>

      <p class="caption">
        <a href="#" class="username-link">${post.username}</a> ${post.comment}
      </p>

      <div class="comment-box">
        <input type="text" placeholder="Add a comment...">
        <button>Post</button>
      </div>

    </article>
  `
}

// Renders full feed
function renderFeed() {
  feed.innerHTML = posts.map(createPost).join("")
}

renderFeed()

// Renders stories section
function renderStories() {
  storiesContainer.innerHTML = storiesData.map((story, index) => `
    <div class="story" data-index="${index}">
      <div class="story-ring ${story.seen ? "seen" : ""}">
        <img src="${story.avatar}" alt="${story.username}">
      </div>
      <span>${story.username}</span>
    </div>
  `).join("")
}

renderStories()

// Mark story as seen when clicked
storiesContainer.addEventListener("click", (e) => {
  const storyEl = e.target.closest(".story")
  if (!storyEl) return

  storiesData[storyEl.dataset.index].seen = true
  renderStories()
})

// Likes (toggle state + UI update)
function toggleLike(post, postEl) {
  post.liked = !post.liked
  post.likes += post.liked ? 1 : -1

  const likeCount = postEl.querySelector(".like-count")
  likeCount.textContent = post.likes.toLocaleString()

  const heart = postEl.querySelector(".heart-icon")
  heart.classList.toggle("liked", post.liked)

  if (post.liked) {
    heart.classList.add("heart-pop")
    setTimeout(() => heart.classList.remove("heart-pop"), 300)
  }
}

// Like via click on heart icon
document.addEventListener("click", (e) => {
  if (!e.target.classList.contains("heart-icon")) return

  const postEl = e.target.closest(".post")
  const post = posts.find(p => p.id === Number(postEl.dataset.id))

  toggleLike(post, postEl)
})

// Like via double-click on image
document.addEventListener("dblclick", (e) => {
  const img = e.target.closest(".post-image")
  if (!img) return

  const postEl = img.closest(".post")
  const post = posts.find(p => p.id === Number(postEl.dataset.id))

  if (!post.liked) toggleLike(post, postEl)
})

// Comment input behavior
document.addEventListener("input", (e) => {
  if (!e.target.matches(".comment-box input")) return

  const input = e.target
  const button = input.closest(".comment-box").querySelector("button")

  const hasText = input.value.trim().length > 0
  button.classList.toggle("active", hasText)
  button.disabled = !hasText
})

// Submit comment (clears input only for now)
document.addEventListener("keydown", (e) => {
  if (!e.target.matches(".comment-box input")) return
  if (e.key !== "Enter") return

  e.preventDefault()

  const input = e.target
  const button = input.closest(".comment-box").querySelector("button")

  if (input.value.trim()) {
    input.value = ""
    button.classList.remove("active")
    button.disabled = true
  }
})

// Dark mode toggle
document.getElementById("themeToggle").addEventListener("change", () => {
  document.body.classList.toggle("dark-mode")
})

// Bottom nav active state
document.querySelectorAll(".nav-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"))
    btn.classList.add("active")
  })
})