<template>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Gaming News</title>
    <link rel="stylesheet" href="style.css" />
  </head>
  <body>
    <header class="navbar">
      <div class="logo">🎮</div>
      <nav class="nav-links">
        <a href="#">Solutions</a>
        <a href="#">Community</a>
        <a href="#">Resources</a>
        <a href="#">Contact</a>
        <a href="#">Link</a>
        <button class="sign-in">Sign in</button>
        <button class="register">Register</button>
      </nav>
    </header>

    <main class="hero-section">
      <h1>Stay Ahead in <span>Gaming News</span></h1>
      <form class="email-form">
        <input type="email" placeholder="Enter your E-mail" required />
        <button type="submit">Subscribe Free</button>
      </form>
    </main>
  </body>
</template>
<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: Arial, sans-serif;
  background-color: #000;
  color: white;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 40px;
  background-color: #000;
}

.logo {
  font-size: 24px;
  color: #444;
}

.nav-links {
  display: flex;
  gap: 20px;
  align-items: center;
}

.nav-links a {
  color: white;
  text-decoration: none;
  font-size: 16px;
}

.sign-in {
  padding: 8px 16px;
  background: white;
  color: black;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.register {
  padding: 8px 16px;
  background: #b300ff;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.hero-section {
  height: calc(100vh - 80px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 20px;
}

.hero-section h1 {
  font-size: 48px;
  font-weight: bold;
  margin-bottom: 10px;
}

.hero-section h1 span {
  color: #b300ff;
}

.subtitle {
  color: #333;
  font-size: 16px;
  margin-bottom: 20px;
}

.email-form {
  display: flex;
  gap: 0;
}

.email-form input {
  padding: 12px 20px;
  font-size: 16px;
  border: none;
  border-radius: 8px 0 0 8px;
  width: 300px;
}

.email-form button {
  padding: 12px 20px;
  font-size: 16px;
  background-color: #b300ff;
  color: white;
  border: none;
  border-radius: 0 8px 8px 0;
  cursor: pointer;
}
</style>
